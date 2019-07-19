const express = require('express');
const fs = require('fs');
let app = express();
const path = require('path');
const{verificaTokenImg}=require('../middlewares/autenticacion');
app.get('/imagen/:tipo/:img', verificaTokenImg,(req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathUrlImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    console.log(pathUrlImagen)
    if (fs.existsSync(pathUrlImagen)) {
        res.sendFile(pathUrlImagen)
    } else {
        let noImgPath = path.resolve(__dirname, '../assets/notfound.png')
        res.sendFile(noImgPath);
    }
})


module.exports = app;