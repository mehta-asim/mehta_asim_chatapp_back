import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methos: ['GET','POST'],
    },
});

app.get('/',(req, res) => {
    console.log("you connected");
    res.send("you connected");
})


httpServer.listen(port, ()=>{
    console.log(`chatapp backend is running on ${port}`);
})

io.on('connection', (socket)=>{
    
    console.log('a user connected');

    socket.emit('CONNECTED', socket.id);

    socket.on('SEND_MESSAGE', (data) => {
        
        console.log("SEND_MESSAGE event!", data);

        io.emit('MESSAGE', data);

    })

    socket.on('USER_TYPING', (data)=>{

        io.emit('SOMEONE_TYPING', data);
        
    })
})