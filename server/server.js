//REQUIRES
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/usuario'));//obtener todos los valores de CRUD usuario
//Constantes y variables globales
const puerto = process.env.PORT;


app.get('/', function (req, res) {
    res.json('Hola mundo');
});


mongoose.connect(process.env.URLDB, {useNewUrlParser:true, useCreateIndex:true} , (err, res) => {
    if (err) throw err;
    console.log('Base de datos activa.')
});

app.listen(puerto, () => {
    console.log("ESTAMOS EN EL PUERTO: ", puerto);
})