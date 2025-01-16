$(document).ready(function() {
    fetch('/obtener-citas')
    .then(response => response.json())
    .then(data => {
        const eventos = data.map(cita => {
            
            return {
                id: cita.Id,
                name: cita.Motivo,
                date: cita['Fecha Cita'],
                description: "Paciente: " + cita.Nombre + "<br>" + cita.Descripción + "<br>" + cita['Numero contacto'] + "<br>" + cita.Horario,
                type: "schedule appointment"
            };
        });

        $('#calendar').evoCalendar({
            language: "es",
            theme: "Midnight Blue",
            format: 'mm/dd/yyyy',
           eventHeaderFormat: "dd MM yyyy",
            calendarEvents: eventos
        });
    })
    .catch(error => console.error('Error al obtener eventos:', error));
})

$(document).ready(function() {
    $(document).on('click', '#cerrar-popup', function() {
    $('#overlay').hide();
    mensaje.close();
});
    
});
$('#calendar').on('selectEvent', function(event, activeEvent) {
    $('#overlay').show();
    mensaje.showModal();
    document.getElementById('btnIngresar').addEventListener('click', enviarForm);
    console.log(activeEvent.id)
    console.log("hola")
    function enviarForm() {
    document.getElementById('btnIngresar').disabled = true;
    const datos = {
        citaId: activeEvent.id,
        fecha: document.getElementById('fecha').value,
        horaInicio: document.getElementById('hora-inicio').value,
        horaFin: document.getElementById('hora-fin').value
      };
      console.log(datos)
      const url = '/reprogramarFecha'; // Endpoint para reprogramar
      const opciones = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      };

    fetch(url, opciones)
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del servidor:', data);
      window.location.href = '/citas';
    })
    .catch(error => {
      console.error('Error al realizar la solicitud POST:', error);
    });
}
});

