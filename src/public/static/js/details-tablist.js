function editarHorario(id) {
    const fila = document.getElementById(`horario-${id}`);
    const horaInicio = fila.querySelector('.hora-inicio');
    const horaFin = fila.querySelector('.hora-fin');
    const botonEditar = fila.querySelector('.editar-btn');

    // Habilitar los campos de hora para edición
    horaInicio.disabled = false;
    horaFin.disabled = false;

    // Cambiar el botón "Editar" por "Guardar" y "Cancelar"
    fila.querySelector('.tabla-cell:last-child').innerHTML = 
        `<button class="guardar-btn" onclick="guardarHorario('${id}')">Guardar</button>
        <button class="cancelar-btn" onclick="cancelarEdicion('${id}')">Cancelar</button>`;
}

function guardarHorario(id) {
    const fila = document.getElementById(`horario-${id}`);
    const horaInicio = fila.querySelector('.hora-inicio').value;
    const horaFin = fila.querySelector('.hora-fin').value;

    // Enviar los datos actualizados al servidor
    fetch('/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, horaInicio, horaFin })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Horario actualizado correctamente');
            location.reload();
        } else {
            alert('Error al actualizar el horario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al actualizar el horario');
    });
}

function cancelarEdicion(id) {
    const fila = document.getElementById(`horario-${id}`);
    const horaInicio = fila.querySelector('.hora-inicio');
    const horaFin = fila.querySelector('.hora-fin');
    const botonGuardar = fila.querySelector('.guardar-btn');
    const botonCancelar = fila.querySelector('.cancelar-btn');

    // Desactivar los campos de hora y restaurar valores originales
    horaInicio.disabled = true;
    horaFin.disabled = true;
    botonGuardar.remove();
    botonCancelar.remove();

    fila.querySelector('.tabla-cell:last-child').innerHTML = 
        `<button class="editar-btn" onclick="editarHorario('${id}')">Editar</button>`;
}
