//REQUIRES
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

//#####################################
//              PARSER
//#####################################

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//#####################################
//    habilitamos la capeta public
//#####################################

app.use(express.static(path.resolve(__dirname,'../public')));

//#####################################
//    habilitamos rutas PETICIONES
//#####################################

app.use(require('./routes/index'));

//#####################################
//   Constantes y variables globales
//#####################################

const puerto = process.env.PORT;

//#####################################
//           CONEXION MONGO
//#####################################

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos activa.')
});

//#####################################
//        APERTURA DEL PUERTO
//#####################################

app.listen(puerto, () => {
    console.log("ESTAMOS EN EL PUERTO: ", puerto);
})