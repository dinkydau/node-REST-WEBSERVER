const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir : '/tmp/'
})
);


app.put('/upload', function (req, res) {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No se ha seleccionado ningun archivo.',
            archivoCargado
        })
    }
    let archivoCargado = req.files.archivo;
    archivoCargado.mv('C:/Users/aaze9/OneDrive/Documentos/NODE/07-REST-SERVER/uploads/imagen.jpg',  (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: err,
                archivoCargado
            })
        }
        res.json({
            ok: true,
            message:'Se han cargado los archivos.',
            archivoCargado
        })
    })
})


module.exports=app;