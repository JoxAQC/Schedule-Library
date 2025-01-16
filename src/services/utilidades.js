function formatoFecha(fecha) {
    // Convierte la fecha a un objeto Date
    const fechaObj = new Date(fecha);

    // Obtiene día, mes y año
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1; // Meses en JavaScript son indexados desde 0
    const año = fechaObj.getFullYear();

    // Formatea la fecha en el formato dd/mm/aaaa
    const fechaFormateada = `${dia}/${mes}/${año}`;

    return fechaFormateada;
  }


  module.exports = { formatoFecha };