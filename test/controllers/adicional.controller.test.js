// test/controllers/adicional.controller.test.js
const request = require('supertest');
const express = require('express');
const path = require('path');
const { obtenerHorariosAtencion, actualizarHorario } = require('../../controllers/adicional.controller');

// Mock de FichaMedicaModel
jest.mock('../../models/adicional.model');

const app = express();
app.use(express.json());
app.get('/horarios/:usuarioId', obtenerHorariosAtencion);
app.post('/horarios', actualizarHorario);

describe('Controlador Adicional', () => {

  describe('obtenerHorariosAtencion', () => {
    it('debería devolver los horarios de atención con éxito', async () => {
      // Mock de la función obtenerHorariosAtencion del modelo
      const mockHorarios = [
        { id: 1, dia_semana: 'Lunes', hora_inicio: '08:00', hora_fin: '12:00' },
        { id: 2, dia_semana: 'Martes', hora_inicio: '09:00', hora_fin: '13:00' }
      ];
      const mockRender = jest.fn();
      const res = { render: mockRender };

      // Mock del modelo
      const FichaMedicaModel = require('../../models/adicional.model');
      FichaMedicaModel.obtenerHorariosAtencion.mockImplementation((usuarioId, callback) => {
        callback(null, mockHorarios);
      });

      // Simulamos la solicitud GET
      await request(app)
        .get('/horarios/1') // Simula una solicitud GET a esta ruta
        .expect(200); // Espera un código de estado 200

      expect(mockRender).toHaveBeenCalledWith(path.join(__dirname, '..', 'view', 'tablist'), {
        horarios: mockHorarios.map(horario => ({
          id: horario.id,
          dia: horario.dia_semana,
          inicio: horario.hora_inicio,
          fin: horario.hora_fin
        }))
      });
    });

    it('debería devolver un error si hay un problema al obtener los horarios', async () => {
      const mockRender = jest.fn();
      const res = { render: mockRender };
      const FichaMedicaModel = require('../../models/adicional.model');
      FichaMedicaModel.obtenerHorariosAtencion.mockImplementation((usuarioId, callback) => {
        callback(new Error('Error al obtener los horarios'), null);
      });

      await request(app)
        .get('/horarios/1')
        .expect(500);
    });
  });

  describe('actualizarHorario', () => {
    it('debería actualizar el horario correctamente', async () => {
      const FichaMedicaModel = require('../../models/adicional.model');
      FichaMedicaModel.actualizarHorario.mockImplementation((id, horaInicio, horaFin, callback) => {
        callback(null, { success: true });
      });

      const response = await request(app)
        .post('/horarios')
        .send({ id: 1, horaInicio: '10:00', horaFin: '14:00' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Horario actualizado correctamente.');
    });

    it('debería devolver error si faltan datos', async () => {
      const response = await request(app)
        .post('/horarios')
        .send({ horaInicio: '10:00' }) // Faltan "id" y "horaFin"
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Faltan datos obligatorios.');
    });

    it('debería devolver error si hay un fallo en la actualización del horario', async () => {
      const FichaMedicaModel = require('../../models/adicional.model');
      FichaMedicaModel.actualizarHorario.mockImplementation((id, horaInicio, horaFin, callback) => {
        callback(new Error('Error al actualizar el horario'), null);
      });

      const response = await request(app)
        .post('/horarios')
        .send({ id: 1, horaInicio: '10:00', horaFin: '14:00' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error al actualizar el horario.');
    });
  });

});
