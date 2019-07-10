//===================================
//          PUERTO
//===================================

process.env.PORT = process.env.PORT || 3000;

//===================================
//          ENTORNO
//===================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB;

if (process.env.NODE_ENV ==='dev'){
    urlDB='mongodb://localhost:27017/mariscos';
}else{
    urlDB='mongodb+srv://dinkydau:lnij8TlfXIXYYVAq@cluster0-f7avu.mongodb.net/test'
}

process.env.URLDB = urlDB;