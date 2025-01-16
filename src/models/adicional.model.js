const { createConnection } = require('../database/database.js');

function actualizarHorario(id, horaInicio, horaFin, callback) {
  const connection = createConnection();

  connection.connect((error) => {
      if (error) {
          return callback(error);
      }

      const query = `
          UPDATE horarios_atencion
          SET hora_inicio = ?, hora_fin = ?, actualizado_en = CURRENT_TIMESTAMP
          WHERE id = ?
      `;
      connection.query(query, [horaInicio, horaFin, id], (err, results) => {
          connection.end();

          if (err) {
              return callback(err);
          }

          if (results.affectedRows === 0) {
              return callback(new Error('No se encontró el horario especificado.'));
          }

          callback(null, results);
      });
  });
}

function obtenerHorariosAtencion(usuarioId, callback) {
  const connection = createConnection();

  connection.connect((error) => {
    if (error) {
      return callback(error, null);
    }

    const query = `
      SELECT id, dia_semana, hora_inicio, hora_fin 
      FROM horarios_atencion 
      WHERE id_usuario = ? 
      ORDER BY FIELD(dia_semana, 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo')`;

    connection.query(query, [usuarioId], (err, results) => {
      connection.end();

      if (err) {
        return callback(err, null);
      }

      if (results.length === 0) {
        return callback({ message: 'No se encontraron horarios para este usuario' }, null);
      }

      return callback(null, results);
    });
  });
}


module.exports = { actualizarHorario, obtenerHorariosAtencion };
