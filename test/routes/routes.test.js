const request = require('supertest');
const express = require('express');
const router = require('./routes.js');
const app = express();
const ClienteController = require('../controllers/cliente.controller.js');
const CitasController = require('../controllers/citas.controller.js');

jest.mock('../controllers/cliente.controller');
jest.mock('../controllers/citas.controller');

describe('Test de rutas', () => {
  // Test de ruta de login
  describe('POST /login.html', () => {
    it('debería iniciar sesión correctamente con credenciales válidas', async () => {
      // Simula el comportamiento de obtenerUsuarioPorCorreo
      ClienteController.obtenerUsuarioPorCorreo.mockImplementationOnce((correo, callback) => {
        callback(null, { ID_USUARIO: 1, PASSWORD_USUARIO: 'hashedPassword', ROL_USUARIO: 'Cliente' });
      });

      // Simula bcrypt.compare para que siempre devuelva true
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const response = await request(app)
        .post('/login.html')
        .send({ correo: 'user@example.com', contrasena: 'password' });

      expect(response.status).toBe(302); // Redirige al usuario
      expect(response.headers.location).toBe('/user'); // Redirección esperada
    });

    it('debería devolver error si las credenciales son incorrectas', async () => {
      ClienteController.obtenerUsuarioPorCorreo.mockImplementationOnce((correo, callback) => {
        callback(null, null); // No se encuentra usuario
      });

      const response = await request(app)
        .post('/login.html')
        .send({ correo: 'user@example.com', contrasena: 'password' });

      expect(response.status).toBe(401); // Error de credenciales incorrectas
      expect(response.body.error).toBe('Credenciales de correo incorrectas');
    });
  });

  // Test de ruta para registrar una nueva cita
  describe('POST /registrarCita', () => {
    it('debería registrar una nueva cita correctamente', async () => {
      // Simula el comportamiento de verificarConflicto
      CitasController.verificarConflicto.mockImplementationOnce(() => null); // Sin conflictos

      const response = await request(app)
        .post('/registrarCita')
        .send({
          motivo: 'Consulta',
          descripcion: 'Descripción de la consulta',
          fecha: '2025-01-20',
          hora_inicio: '10:00',
          hora_fin: '11:00',
        })
        .set('Cookie', ['jwt=mocked-jwt-token']);

      expect(response.status).toBe(200); // Se espera que la cita sea registrada
      expect(response.text).toContain('¡Cita programada correctamente!');
    });

    it('debería devolver error si falta algún dato obligatorio', async () => {
      const response = await request(app)
        .post('/registrarCita')
        .send({
          motivo: 'Consulta',
          fecha: '2025-01-20',
          hora_inicio: '10:00',
        })
        .set('Cookie', ['jwt=mocked-jwt-token']);

      expect(response.status).toBe(400); // Error por datos faltantes
      expect(response.body.error).toBe('Faltan datos obligatorios');
    });
  });

  // Test de ruta para obtener los detalles de un cliente
  describe('GET /clientes/info/:id', () => {
    it('debería devolver los detalles del cliente', async () => {
      // Simula el comportamiento de obtenerUsuarioPorDni
      ClienteController.obtenerUsuarioPorDni.mockImplementationOnce((dni, callback) => {
        callback(null, { ID_USUARIO: 1, NOMBRES_USUARIO: 'John', APELLIDOS_USUARIO: 'Doe' });
      });

      const response = await request(app)
        .get('/clientes/info/1')
        .set('Cookie', ['jwt=mocked-jwt-token']);

      expect(response.status).toBe(200); // Devuelve la información correctamente
      expect(response.body.NOMBRES_USUARIO).toBe('John');
      expect(response.body.APELLIDOS_USUARIO).toBe('Doe');
    });

    it('debería devolver un error si el cliente no existe', async () => {
      ClienteController.obtenerUsuarioPorDni.mockImplementationOnce((dni, callback) => {
        callback(null, null); // No se encuentra el cliente
      });

      const response = await request(app)
        .get('/clientes/info/999')
        .set('Cookie', ['jwt=mocked-jwt-token']);

      expect(response.status).toBe(404); // Error: cliente no encontrado
      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });
});
