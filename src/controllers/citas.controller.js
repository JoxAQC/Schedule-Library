const CitasModel = require('../models/citas.model');

function obtenerCitas(req, res) {
  CitasModel.obtenerCitas((error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener citas' });
    } else {
      res.json(results);
    }
  });
}


function obtenerRegistros(req, res) {
  CitasModel.obtenerRegistros((error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener citas' });
    } else {
      res.json(results);
    }
  });
}

function registrarCita(usuarioId, fecha, hora_inicio, hora_fin, motivo, descripcion, callback) {
  const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone; // Obtiene la zona horaria del cliente

  const cita = {
    ID_USUARIO: usuarioId,
    FECHA_CITA: fecha,
    HORA_INICIO: hora_inicio,
    HORA_FIN: hora_fin,
    MOTIVO_CITA: motivo,
    DESCRIPCION: descripcion,
    ZONA_HORARIA: zonaHoraria
  };

  CitasModel.registrarCita(cita, (error, resultado) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, resultado);
    }
  });
}

function modificarCita(idCita, fecha, hora_inicio, hora_fin, callback) {
  console.log(idCita)
  console.log(fecha)
  const citaActualizada = {
    FECHA_CITA: fecha,
    HORA_INICIO: hora_inicio,
    HORA_FIN: hora_fin,
  };

  CitasModel.modificarCita(idCita, citaActualizada, (error, resultado) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, resultado);
    }
  });
}




// async function verificarConflictoConCitasPrevias(usuarioId, fecha, hora_inicio, hora_fin) {
//   return new Promise((resolve, reject) => {
//     CitasModel.obtenerRegistros((error, citas) => {
//       if (error) {
//         return reject(error);
//       }

//       const conflicto = citas.some(cita => {
//         const mismoUsuario = cita.ID_USUARIO === usuarioId;
//         const mismaFecha = new Date(cita.FECHA_CITA).toISOString().split('T')[0] === fecha;
//         const inicioDentroDeOtra = hora_inicio >= cita.HORA_INICIO && hora_inicio < cita.HORA_FIN;
//         const finDentroDeOtra = hora_fin > cita.HORA_INICIO && hora_fin <= cita.HORA_FIN;
//         const abarcaOtra = hora_inicio <= cita.HORA_INICIO && hora_fin >= cita.HORA_FIN;

//         return mismoUsuario && mismaFecha && (inicioDentroDeOtra || finDentroDeOtra || abarcaOtra);
//       });

//       resolve(conflicto);
//     });
//   });
// }

async function verificarConflictoConCitasPrevias(fecha, hora_inicio, hora_fin, bufferMinutos = 10) {
  return new Promise((resolve, reject) => {
    CitasModel.obtenerRegistros((error, citas) => {
      if (error) {
        return reject(error);
      }

      const bufferMs = bufferMinutos * 60 * 1000; // Convertir el buffer de minutos a milisegundos
      const horaInicioMs = new Date(`1970-01-01T${hora_inicio}Z`).getTime();
      const horaFinMs = new Date(`1970-01-01T${hora_fin}Z`).getTime();

      const conflicto = citas.some(cita => {
        const mismaFecha = new Date(cita.FECHA_CITA).toISOString().split('T')[0] === fecha;

        const citaInicioMs = new Date(`1970-01-01T${cita.HORA_INICIO}Z`).getTime();
        const citaFinMs = new Date(`1970-01-01T${cita.HORA_FIN}Z`).getTime();

        // Verificar conflictos con el buffer
        const inicioConBuffer = horaInicioMs < citaFinMs + bufferMs && horaInicioMs >= citaInicioMs - bufferMs;
        const finConBuffer = horaFinMs > citaInicioMs - bufferMs && horaFinMs <= citaFinMs + bufferMs;
        const abarcaConBuffer = horaInicioMs <= citaInicioMs - bufferMs && horaFinMs >= citaFinMs + bufferMs;

        return mismaFecha && (inicioConBuffer || finConBuffer || abarcaConBuffer);
      });

      resolve(conflicto);
    });
  });
}


async function verificarHorarioDentroDeAtencion(fecha, hora_inicio, hora_fin) {

  return new Promise((resolve, reject) => {
    // Obtener el día de la semana basado en la fecha
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diaSemana = diasSemana[new Date(fecha).getDay()];

    // Consultar la base de datos para obtener el horario del día
    CitasModel.obtenerHorarioAtencionPorDia(diaSemana, (error, horario) => {
      if (error) {
        return reject(`Error al consultar horario de atención: ${error}`);
      }

      if (!horario) {
        return resolve(false); // No hay horario definido para este día
      }

      const { inicio: horaInicioAtencion, fin: horaFinAtencion } = horario;

      // Verificar que el horario de la cita esté dentro del horario de atención
      const inicioValido = hora_inicio >= horaInicioAtencion && hora_inicio < horaFinAtencion;
      const finValido = hora_fin > horaInicioAtencion && hora_fin <= horaFinAtencion;

      resolve(inicioValido && finValido);
    });
  });
}



async function verificarConflicto(fecha, hora_inicio, hora_fin) {
  const ahora = new Date();
  const fechaHoraInicio = new Date(`${fecha}T${hora_inicio}`);
  const fechaHoraFin = new Date(`${fecha}T${hora_fin}`);

  if (hora_inicio >= hora_fin) {
    return { conflict: true, causa: 'La hora de inicio debe ser anterior a la hora de fin.' };
  }

  if (fechaHoraInicio < ahora) {
    return { conflict: true, causa: 'No se pueden programar citas en fechas u horas pasadas.' };
  }

  const duracionMinima = 10 * 60 * 1000; // 10 minutos en milisegundos
  if (fechaHoraInicio.getTime() + duracionMinima > fechaHoraFin.getTime()) {
    return { conflict: true, causa: 'La cita debe durar al menos 10 minutos.' };
  }


  try {
    // Verificar conflicto con citas previas
    const conflicto = await verificarConflictoConCitasPrevias(fecha, hora_inicio, hora_fin);
    if (conflicto) {
      return { conflict: true, causa: 'Conflicto con citas previas.' };
    }

    // Verificar horario dentro del horario de atención
    const horarioValido = await verificarHorarioDentroDeAtencion(fecha, hora_inicio, hora_fin);

    if (!horarioValido) {
      return { conflicto: true, causa: 'Fuera del horario de atención del médico.' };
    }
      
    return (false);
  } catch (error) {
    throw new Error(`Error al verificar disponibilidad: ${error.message}`);
  }
}



// // Función para obtener la última cita en el día
// async function obtenerUltimaCita(usuarioId, fecha) {
//   return new Promise((resolve, reject) => {
//     CitasModel.obtenerRegistros((error, citas) => {
//       if (error) {
//         return reject(error);
//       }

//       const citasDelDia = citas.filter(cita => 
//         cita.ID_USUARIO === usuarioId && cita.FECHA_CITA === fecha
//       );

//       if (citasDelDia.length === 0) {
//         return resolve(null);
//       }

//       const ultimaCita = citasDelDia.reduce((ultima, actual) => 
//         new Date(`${fecha}T${actual.HORA_FIN}`) > new Date(`${fecha}T${ultima.HORA_FIN}`) ? actual : ultima
//       );

//       resolve(ultimaCita);
//     });
//   });
// }

module.exports = { obtenerCitas, obtenerRegistros, registrarCita, verificarConflicto, modificarCita };
