//===========================================
//              REQUIRES
//===========================================
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
//===========================================
//              HABILITAMOS
//              FILE UPLOAD
//===========================================
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
})
);

//===========================================
//              METODO PUT PARA
//              CARGAR IMAGENES
//===========================================
app.put('/upload/:tipo/:id', function (req, res) {
    //===========================================
    //              Obtenemos las 
    //           variables necesaras
    //===========================================
    let tipo = req.params.tipo;
    let id = req.params.id;

    //===========================================
    //              Validaciones
    //                  tipos
    //===========================================
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: '1Los tipos permitidas son: ' + tiposValidos.join(', '),
                valor: tipo,
                tipos: tiposValidos
            }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No se ha seleccionado ningun archivo.',
        })
    }

    let archivoCargado = req.files.archivo;
    let nombreCortado = archivoCargado.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    //===========================================
    //              extensiones validas
    //===========================================

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las  extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }
    //===========================================
    //              Cargamos la imagen
    //===========================================
    archivoCargado.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: err,
                archivoCargado
            })
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }
        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }
    })
})
//===========================================
//              FUNCION PARA
//              CARGAR LA IMAGEN
//              DEL USUARIO
//===========================================

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        borraArchivoDuplicado('usuarios', usuarioDB.img)
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuariGuardado) => {
            res.json({
                ok: true,
                usuario: usuariGuardado,
                img: nombreArchivo
            })
        })
    })
}
//===========================================
//              FUNCION PARA
//              CARGAR LA IMAGEN
//              DEL PRODUCTO
//===========================================
function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existente'
                }
            });
        }
        borraArchivoDuplicado('productos', productoDB.img)
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })

    })
}


//===========================================
//              FUNCION PARA
//              VALIDAR SI LA
//              IMAGEN AUN EXISTE.
//===========================================
function borraArchivoDuplicado(tipo, nombreBorrar) {
    let pathUrlImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreBorrar}`);
    if (fs.existsSync(pathUrlImagen)) {
        fs.unlinkSync(pathUrlImagen);
    }
}
//===========================================
//              EXPORTACION
//===========================================
module.exports = app;