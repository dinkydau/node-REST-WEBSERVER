//REQUIRES
require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Constantes y variables globales

const puerto= process.env.PORT;

//FUNCIONES DE EMISION
app.get('/', function (req, res) {
  res.json('Hola mundo');
})
app.get('/usuario', function( req, res ){
    res.json('Hola desde usuarios ');
})
app.post('/usuario', function( req, res ){
    let body= req.body;
    if ( body.nombre === undefined || body.edad === undefined || body.correo === undefined ){
        res.status(400).json({
            ok:false,
            message:'Json incompleto'
        });
    }else{
        res.json({ persona : body });
    }
    
})
app.put('/usuario/:id', function( req, res ){
    let id = req.params.id; 
    res.json({ id });
})
app.delete('/usuario', function( req, res ){
    res.json('Hola desde el DELETE usuarios ');
})

app.listen(puerto, ()=>{
    console.log("ESTAMOS EN EL PUERTO: ",puerto);
})