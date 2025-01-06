const express=require('express');
const session = require('express-session');
const session=require('express-session');

const app=express();
//configuracion de la sesion 
app.use(session({
    secret:'mi-clave-secreta', //secreto para firmar la cookie de sesion
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}

})
);
//Middware para mostrar detalles de la sesion
app.use((req,res,next)=>{
    if(req.session){
        if(!req.session.createAt){
            req.session.createAt = new Date();//Asignamos la fecha de creacion de la sesion
        }
        req.session.lastAcces = new Date();//Asignamos la ultima vez accedio a la sesion
    }
    next();
});
//Ruta para mostrar la informacion de la sesion
app.get('/session',(req, res)=>{
    if(req.session){
        const sessionId = req.session.id;
        const createAt= req.session
    }
})