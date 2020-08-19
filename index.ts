import Server from "./classes/server";
import userRouter from "./routes/usuario";
import mongoose from 'mongoose';
import bodyParser from "body-parser";


const server = new Server();


//Body parser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

//Rutas de mi app
server.app.use('/user', userRouter)

//Conectar DB
mongoose.connect('mongodb://localhost:27017/fotosgram',
    {useNewUrlParser: true, useCreateIndex: true}, (err) => {
        if(err) throw err;
        console.log('base de datos ONLINE');
    }) 

//levantar express
server.start( ()=> {
    console.log(`Servidor corriendo en puerto ${server.port}`);
} )