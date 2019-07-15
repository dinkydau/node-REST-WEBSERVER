const express = require('express');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
const _ = require('underscore');
let app = express();
let Producto = require('../models/producto');

//===========================================
//          Obtenemos productos con
//          categoria y pagiado
//===========================================
app.get('/producto', verificaToken, (req, res) => {
    console.log('Ya llegue aqui')
    //obtenemos la cantidad inicial y el maximo a mostrar en pantalla
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    //validacion de que son numeros
    limite = Number(limite);
    desde = Number(desde);
    //procedimiento para obtenerlos 
    Producto.find({ disponible: true }, 'nombre precioUni descripcion usuario')
        .populate('categoria','descripcion')
        .populate('usuario','nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }
            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    productosDB
                })
            })
        })
})
//===========================================
//          Obtenemos un producto con
//          categoria y pagiado
//===========================================
app.get('/producto/:id', [verificaToken], function (req, res) {
    let id = req.params.id;
    Producto.findById({ _id: id })
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }
            Producto.countDocuments({ _id: id }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    producto
                });
            })
        });
})
//===========================================
//              Crear producto
//===========================================
app.post('/producto', [verificaToken], function (req, res) {
    let body = req.body;
    let usuario = req.usuario._id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
//===========================================
//              Actualizar producto
//===========================================

//===========================================
//              Borrar producto
//===========================================

module.exports = app;