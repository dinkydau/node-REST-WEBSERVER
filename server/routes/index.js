const express = require('express');
const app = express();

app.use(require('./usuario'));//obtener todos los valores de CRUD usuario
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
module.exports=app;