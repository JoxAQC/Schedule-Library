const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const CitasController = require('./citas.controller.test');
const CitasModel = require('../models/citas.model');

describe('Citas Controller', () => {

  afterEach(() => {
    // Restaurar los stubs y espías después de cada test
    sinon.restore();
  });

  describe('obtenerCitas', () => {
    it('should return 500 if there is an error in CitasModel.obtenerCitas', (done) => {
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      // Simular un error en el modelo
      sinon.stub(CitasModel, 'obtenerCitas').callsArgWith(0, new Error('Database error'));

      CitasController.obtenerCitas({}, res);

      setImmediate(() => {
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ error: 'Error al obtener citas' })).to.be.true;
        done();
      });
    });

    it('should return results if CitasModel.obtenerCitas is successful', (done) => {
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      // Simular un éxito en el modelo
      const fakeResults = [{ id: 1, fecha: '2025-01-01' }];
      sinon.stub(CitasModel, 'obtenerCitas').callsArgWith(0, null, fakeResults);

      CitasController.obtenerCitas({}, res);

      setImmediate(() => {
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(fakeResults)).to.be.true;
        done();
      });
    });
  });

  describe('registrarCita', () => {
    it('should call CitasModel.registrarCita and pass the result to the callback', (done) => {
      const fakeCita = {
        usuarioId: 1,
        fecha: '2025-01-01',
        hora_inicio: '10:00',
        hora_fin: '11:00',
        motivo: 'Motivo',
        descripcion: 'Descripción'
      };

      const callback = sinon.spy();
      
      // Simular un éxito en la función registrarCita
      sinon.stub(CitasModel, 'registrarCita').callsArgWith(1, null, { success: true });

      CitasController.registrarCita(fakeCita.usuarioId, fakeCita.fecha, fakeCita.hora_inicio, fakeCita.hora_fin, fakeCita.motivo, fakeCita.descripcion, callback);

      setImmediate(() => {
        expect(callback.calledWith(null, { success: true })).to.be.true;
        done();
      });
    });

    it('should pass error to callback if CitasModel.registrarCita fails', (done) => {
      const fakeCita = {
        usuarioId: 1,
        fecha: '2025-01-01',
        hora_inicio: '10:00',
        hora_fin: '11:00',
        motivo: 'Motivo',
        descripcion: 'Descripción'
      };

      const callback = sinon.spy();
      
      // Simular un error en la función registrarCita
      sinon.stub(CitasModel, 'registrarCita').callsArgWith(1, new Error('Error en la base de datos'));

      CitasController.registrarCita(fakeCita.usuarioId, fakeCita.fecha, fakeCita.hora_inicio, fakeCita.hora_fin, fakeCita.motivo, fakeCita.descripcion, callback);

      setImmediate(() => {
        expect(callback.calledWith(new Error('Error en la base de datos'), null)).to.be.true;
        done();
      });
    });
  });

  describe('verificarConflicto', () => {
    it('should return conflict if the start time is later than the end time', async () => {
      const conflicto = await CitasController.verificarConflicto('2025-01-01', '12:00', '10:00');
      expect(conflicto).to.have.property('conflict', true);
      expect(conflicto).to.have.property('causa', 'La hora de inicio debe ser anterior a la hora de fin.');
    });

    it('should return conflict if the date is in the past', async () => {
      const conflicto = await CitasController.verificarConflicto('2020-01-01', '10:00', '11:00');
      expect(conflicto).to.have.property('conflict', true);
      expect(conflicto).to.have.property('causa', 'No se pueden programar citas en fechas u horas pasadas.');
    });

    it('should return false if no conflicts are found', async () => {
      sinon.stub(CitasController, 'verificarConflictoConCitasPrevias').resolves(false);
      sinon.stub(CitasController, 'verificarHorarioDentroDeAtencion').resolves(true);

      const conflicto = await CitasController.verificarConflicto('2025-01-01', '10:00', '11:00');
      expect(conflicto).to.equal(false);
    });
  });
});
