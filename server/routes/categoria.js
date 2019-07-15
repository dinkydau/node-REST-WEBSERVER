const express = require('express');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
const _ = require('underscore');
let app = express();
let Categoria = require('../models/categoria');
//===============================
//  Motrar todas las categorias
//===============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    categorias
                });
            });
        })
});
//===============================
//  Motrar una categorias por ID
//===============================
app.get('/categoria/:id', [verificaToken], function (req, res) {
    let id = req.params.id;
    Categoria.findById({ _id: id })
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }
            Categoria.countDocuments({ _id: id }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    categorias
                });
            });
        })
});

//===============================
//     Crear nueva categoria
//===============================
app.post('/categoria', verificaToken, function (req, res) {

    let body = req.body;
    let usuario = req.usuario._id;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});
//===============================
//     Actualiza categoria
//===============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    Categoria.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});
//===============================
//     Borrado de categoria
//===============================
app.delete('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaEliminada) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err
            });
        }
        if (!categoriaEliminada) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaEliminada
        })
    });
});

module.exports = app;