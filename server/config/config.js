//===================================
//            PUERTO
//===================================
process.env.PORT = process.env.PORT || 3000;
//===================================
//           conexion
//            MONGODB
//===================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
let urlDB;
if (process.env.NODE_ENV ==='dev'){
    urlDB='mongodb://localhost:27017/mariscos';
}else{
    urlDB=process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
//===================================
//          VENCIMIENTO
//             TOKEN
//===================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//===================================
//          SEED de autenticacion
//===================================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'seed-desarrollo';
