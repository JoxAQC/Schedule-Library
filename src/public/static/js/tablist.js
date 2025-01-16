// Espera a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {
    // Función para buscar y resaltar coincidencias
    function buscar() {
        var input = document.getElementById("busqueda");
        var filtro = input.value.toUpperCase();
        var tabla = document.querySelector(".customer-tabla");
        var filas = tabla.getElementsByTagName("tr");

        for (var i = 0; i < filas.length; i++) {
            var tdNombre = filas[i].getElementsByTagName("td")[0]; // Columna de Nombre
            if (tdNombre) {
                var texto = tdNombre.textContent || tdNombre.innerText;
                if (texto.toUpperCase().indexOf(filtro) > -1) {
                    filas[i].style.backgroundColor = "#d5f5fa"; // Cambia el color de fondo de la fila a #d5f5fa
                } else {
                    filas[i].style.backgroundColor = ""; // Restablece el color de fondo
                }
            }
        }
    }

    // Agregar un evento click al botón de búsqueda
    var botonBuscar = document.getElementById("buscar");
    if (botonBuscar) {
        botonBuscar.addEventListener("click", buscar);
    }

    // Agregar un evento "keydown" para la tecla "Enter" en el campo de búsqueda
    var inputBusqueda = document.getElementById("busqueda");
    if (inputBusqueda) {
        inputBusqueda.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                buscar();
            }
        });
    }
});