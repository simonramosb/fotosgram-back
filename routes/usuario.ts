import { Router, Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { verificaToken } from "../middlewares/autenticacion";


const userRouter = Router();

//Login
userRouter.post('/login', (req: Request, res: Response)=>{

    const body = req.body;

    Usuario.findOne({email: body.email}, (err, userDB) => {
        if (err) throw err;

        if ( !userDB ){
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }

        if(userDB.compararPassword(body.password)){

            const tokenUsuario = Token.getJwtToken({
                _id: userDB.id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar,
            });

            res.json({
                ok: true,
                token: tokenUsuario
            });
            
        }else{
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos ********'
            })
        }

    })

});



// Crear un usuario
userRouter.post('/create', (req: Request, res: Response)=> {

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
    };


    Usuario.create(user).then(userDB =>{

        const tokenUsuario = Token.getJwtToken({
            _id: userDB.id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar,
        });

        res.json({
            ok: true,
            token: tokenUsuario,
        });

    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })


});

//Actualizar usuario
userRouter.post('/update', verificaToken, (req: any, res: Response)=>{

    const user = {

        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar,
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, (err, userDB) => {
        if (err) throw err;
        if (!userDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

        const tokenUsuario = Token.getJwtToken({
            _id: userDB.id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar,
        });

        res.json({
            ok: true,
            token: tokenUsuario,
        });

    });

});

export default userRouter;