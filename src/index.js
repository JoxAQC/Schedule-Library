const dotenv = require('dotenv');
const express = require ('express')
const morgan = require ('morgan')
var path = require('path');

const app = express();

dotenv.config();
app.set('port', process.env.PORT);
app.use(morgan('dev'));

app.listen(app.get('port'), () =>{
    console.log('Servidor iniciado en el puerto', app.get('port') )
})

//Views
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'src', 'view')));

//Public
app.use(express.static(path.join(__dirname, 'public', 'static')));

//Routes
app.use(require('./routes/routes.js'))
