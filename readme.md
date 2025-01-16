# Módulo de Gestión de Horarios de Atención

Este módulo proporciona funcionalidades para gestionar horarios de atención en un sistema de citas médicas. Incluye funciones para obtener, actualizar y formatear los horarios de atención de un usuario, además de ofrecer pruebas automatizadas usando Jest.

## Instalación

### 1. Instalar las dependencias

Para integrar este módulo en tu proyecto, sigue estos pasos:

#### Requisitos previos
- Node.js (versión 14 o superior)
- NPM (versión 6 o superior)

#### Paso 1: Clonar el repositorio

Si aún no has clonado el repositorio en tu proyecto, puedes hacerlo con el siguiente comando:

 ```bash
git clone https://github.com/JoxAQC/Schedule-Library.git
```


#### Paso Paso 2: Instalar las dependencias

Una vez que tengas el módulo en tu proyecto, navega hasta la carpeta donde se encuentra el módulo y ejecuta el siguiente comando para instalar las dependencias necesarias:

 ```bash
npm install
```

Este comando instalará las dependencias definidas en el archivo package.json.

## Uso del Módulo
Para utilizar el módulo en tu aplicación, sigue estos pasos:

### Paso 1: Importar el controlador
Dentro de tu archivo donde quieras utilizar el controlador de horarios, importa el controlador de la siguiente manera:

```javascript

const { obtenerHorariosAtencion, actualizarHorario } = require('ruta_del_modulo');
```
### Paso 2: Configurar las rutas en tu servidor
Si estás utilizando Express, por ejemplo, puedes integrar las rutas del controlador en tu servidor de la siguiente manera:

```javascript
const express = require('express');
const { obtenerHorariosAtencion, actualizarHorario } = require('ruta_del_modulo');

const app = express();
app.use(express.json());

// Definir rutas para obtener y actualizar los horarios
app.get('/horarios/:usuarioId', obtenerHorariosAtencion);
app.post('/horarios', actualizarHorario);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
```
### Paso 3: Rutas en el frontend
Si necesitas invocar estas funciones desde el frontend o una aplicación cliente, puedes usar una herramienta como axios o fetch para hacer las solicitudes HTTP correspondientes:

Ejemplo con fetch para obtener los horarios:
``` javascript
fetch('/horarios/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  ```
Ejemplo con fetch para actualizar los horarios:
```javascript
fetch('/horarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 1,
    horaInicio: '08:00',
    horaFin: '12:00',
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```
## Funciones Disponibles
El módulo expone las siguientes funciones para gestionar los horarios de atención:

obtenerHorariosAtencion(usuarioId, res)
Esta función obtiene los horarios de atención de un usuario. Los resultados se formatean antes de ser enviados a la vista tablist.

### Parámetros:

- usuarioId: El ID del usuario cuyo horario de atención se quiere obtener.
- res: El objeto de respuesta de Express.
actualizarHorario(req, res)
Esta función actualiza los horarios de atención para un usuario. Los horarios son validados antes de ser actualizados.

### Parámetros:

- req: El objeto de solicitud de Express que contiene los datos de la cita.
- res: El objeto de respuesta de Express.
## Respuestas de las Rutas
Ruta: GET /horarios/:usuarioId
Esta ruta obtiene los horarios de atención para un usuario específico.

####  Respuesta Exitosa (200 OK):

```json
[
  {
    "id": 1,
    "dia": "lunes",
    "inicio": "08:00",
    "fin": "12:00"
  },
  {
    "id": 2,
    "dia": "martes",
    "inicio": "09:00",
    "fin": "13:00"
  }
]
```
#### Respuesta de Error (500 Internal Server Error):

```json

{
  "error": "Error al obtener los horarios de atención"
}
```
### Ruta: POST /horarios
Esta ruta actualiza un horario de atención.

#### Cuerpo de la Solicitud:

```json
{
  "id": 1,
  "horaInicio": "08:00",
  "horaFin": "12:00"
}
```
#### Respuesta Exitosa (200 OK):

```json
{
  "success": true,
  "message": "Horario actualizado correctamente."
}
```
#### Respuesta de Error (400 Bad Request):

```json
{
  "success": false,
  "message": "Faltan datos obligatorios."
}
```
#### Respuesta de Error (500 Internal Server Error):

```json
{
  "success": false,
  "message": "Error al actualizar el horario."
}
```
## Consideraciones
- Asegúrate de tener configurado correctamente tu servidor de Express antes de integrar el módulo.
- Verifica que las rutas y funciones sean accesibles desde el frontend a través de las solicitudes HTTP.
- Si deseas personalizar el formato de la respuesta o la vista, puedes modificar el controlador obtenerHorariosAtencion.