const { createConnection } = require('../database/database.js');

function obtenerCitas(callback) {
  const connection = createConnection();

  connection.connect((error) => {
    if (error) {
      return callback(error, null);
    }

    connection.query('SELECT * FROM vw_detallesconsulta', (err, results) => {
      connection.end();
      if (err) {
        return callback(err, null);
      }

      return callback(null, results);
    });
  });
}

function obtenerRegistros(callback) {
  const connection = createConnection();

  connection.connect((error) => {
    if (error) {
      return callback(error, null);
    }

    connection.query('SELECT * FROM tb_citas', (err, results) => {
      connection.end();
      if (err) {
        return callback(err, null);
      }

      return callback(null, results);
    });
  });
}

function obtenerHorarioAtencionPorDia(diaSemana, callback) {
  const connection = createConnection(); // Crear una nueva conexión

  connection.connect((error) => {
    if (error) {
      return callback(error, null); // Retornar el error si la conexión falla
    }

    const query = 'SELECT hora_inicio AS inicio, hora_fin AS fin FROM horarios_atencion WHERE dia_semana = ?';
    connection.query(query, [diaSemana], (err, results) => {
      connection.end(); // Cerrar la conexión después de ejecutar la consulta
      if (err) {
        return callback(err, null); // Retornar el error si la consulta falla
      }

      callback(null, results[0]); // Retornar el resultado del horario (o undefined si no existe)
    });
  });
}

function registrarCita(cita, callback) {
  const connection = createConnection();

  connection.connect((connectionError) => {
    if (connectionError) {
      return callback(connectionError, null);
    }

    connection.query('INSERT INTO TB_CITAS SET ?', cita, (err, results) => {
      connection.end();
      if (err) {
        return callback(err, null);
      }

      return callback(null, results);
    });
  });
}


function modificarCita(idCita, citaActualizada, callback) {
  const connection = createConnection();

  connection.connect((connectionError) => {
    if (connectionError) {
      return callback(connectionError, null);
    }

    const query = `
      UPDATE TB_CITAS
      SET FECHA_CITA = ?, HORA_INICIO = ?, HORA_FIN = ?
      WHERE ID_CITA = ?
    `;

    const values = [
      citaActualizada.FECHA_CITA,
      citaActualizada.HORA_INICIO,
      citaActualizada.HORA_FIN,
      idCita,
    ];

    connection.query(query, values, (err, results) => {
      connection.end();
      if (err) {
        return callback(err, null);
      }

      callback(null, results);
    });
  });
}

module.exports = { obtenerCitas, obtenerRegistros, registrarCita, obtenerHorarioAtencionPorDia, modificarCita};