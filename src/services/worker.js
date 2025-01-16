const amqp = require('amqplib');

const QUEUE_NAME = 'citas_queue';

async function startWorker() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  console.log('Worker esperando mensajes. Para salir, presione CTRL+C');

  channel.consume(QUEUE_NAME, (msg) => {
    const citaData = JSON.parse(msg.content.toString());

    // Procesa la solicitud de registro de cita
    processCitaRequest(citaData);

    // Confirma la recepción del mensaje
    channel.ack(msg);
  }, { noAck: false });
}

function processCitaRequest(citaData) {
  // Aquí puedes realizar validaciones adicionales y luego llamar a la función de registro de citas
  CitasController.registrarCita(citaData.usuarioId, citaData.mascotas, citaData.fecha, citaData.motivo, (error, resultado) => {
    if (error) {
      console.error('Error al registrar la cita:', error);
    } else {
      console.log('Cita registrada con éxito');
    }
  });
}

startWorker();