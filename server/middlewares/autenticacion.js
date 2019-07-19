const jwt = require('jsonwebtoken');
//===============================
//          Verificar
//            TOKEN
//===============================

let verificaToken = (req, res, next ) =>{
    let token =req.get('token');

    jwt.verify( token, process.env.SEED_TOKEN, (err,decoded)=>{
        if (err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'El Token no es valido'
                }
            });
        }
        req.usuario= decoded.usuario;
        //DEBUG console.log(token);
        next();
    });
}

//===============================
//          Verificar
//            ROLES
//===============================

let verificaRol = (req, res, next ) =>{
    
    let usuario = req.usuario;

    if( usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok:false,
            err:{
                message:'El usuario no tiene autorización.'
            }
        });
    }

}
//===========================================
//              VERIFICA TOKEN IMG
//===========================================
let verificaTokenImg =(req,res,next)=>{
    let token= req.query.token;
    jwt.verify( token, process.env.SEED_TOKEN, (err,decoded)=>{
        if (err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'El Token no es valido'
                }
            });
        }
        req.usuario= decoded.usuario;
        next();
    });
}

module.exports={
    verificaToken,
    verificaRol,
    verificaTokenImg
}