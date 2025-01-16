const FichaMedicaModel = require('../models/adicional.model');
const path = require('path');

function obtenerHorariosAtencion(usuarioId, res) {

  FichaMedicaModel.obtenerHorariosAtencion(usuarioId, (error, horarios) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener los horarios de atención' });
    }

    // Formatear horarios
    const horariosFormateados = horarios.map(horario => ({
      id: horario.id,
      dia: horario.dia_semana,
      inicio: horario.hora_inicio,
      fin: horario.hora_fin
    }));

    res.render(path.join(__dirname, '..', 'view', 'tablist'), { horarios: horariosFormateados });
  });
}


  function actualizarHorario(req, res) {


      const { id, horaInicio, horaFin } = req.body;
  
      // Validaciones básicas
      if (!id || !horaInicio || !horaFin) {
          return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
      }
  
      FichaMedicaModel.actualizarHorario(id, horaInicio, horaFin, (error, result) => {
          if (error) {
              console.error('Error al actualizar el horario:', error);
              return res.status(500).json({ success: false, message: 'Error al actualizar el horario.' });
          }
  
          res.json({ success: true, message: 'Horario actualizado correctamente.' });
      });
  }
  
  


module.exports = { obtenerHorariosAtencion, actualizarHorario };