const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaRol } =require('../middlewares/autenticacion');

//FUNCIONES DE REST

// app.get('/', function (req, res) {
//     res.json('Hola mundo');
// });

app.get('/usuario', verificaToken ,  (req, res) => {
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({estado:true}, 'nombre email estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }
            //Usuario.count( )
            Usuario.countDocuments({estado:true}, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    usuarios
                });
            })
        });

});

app.post('/usuario', [verificaToken,verificaRol] ,function (req, res) {
    
    let body = req.body;

    //Validacion del modelo de usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', [verificaToken,verificaRol] ,function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //ejemplo de como evitara actualizar con hardcode
    //  delete body.password;
    //  delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })



});


app.delete('/usuario/:id', [verificaToken,verificaRol] , function (req, res) {
    let id = req.params.id;
    let body = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

});



// eliminamos de manera permanentemente de la base de datos
// app.delete('/usuario/:id', function (req, res) {

//     let id =req.params.id;
//     Usuario.findByIdAndRemove(id , (err,usuarioBorrado)=>{
//         if (err) {
//             res.status(400).json({
//                 ok: false,
//                 message: err
//             });
//         }
//         if (!usuarioBorrado){
//             res.status(400).json({
//                 ok: false,
//                 err: {
//                     message:'Usuario no encontrado'
//                 }
//             });
//         }
//         res.json({
//             ok:true,
//             usuario:usuarioBorrado
//         })

//     });

// });

module.exports = app;