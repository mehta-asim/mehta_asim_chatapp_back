//import express server and createserver from respective packages
import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';

//declaring constants to use further ahead
const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

var usernames = [];


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

    io.emit('onconnect', usernames);

    socket.emit('CONNECTED', socket.id);

    socket.on('SEND_MESSAGE', (data) => {
        
        // console.log("SEND_MESSAGE event!", data);

        io.emit('MESSAGE', data);

    })

    socket.on('CONNECTED', (data) =>{
        // console.log('CONNECTED event!', data);
    })

    socket.on('USER_TYPING', (data)=>{

        // console.log('USER_TYPING event!', data);
        io.emit('SOMEONE_TYPING', data);

    })

    socket.on('USER_CONNECTED', (data)=>{
        // console.log('USER_CONECTED event!', data);
        socket.username = data.user;

        usernames = [...usernames,data];

        console.log(usernames);

        io.emit('SOMEONE_CONNECTED', data);
        // console.log('someone connected');

    })

    socket.on('EXITCHAT',(sock)=>{
        // console.log('user disconnected 1st:',sock.username);
        Array.prototype.forEach.call(usernames, (user,index) =>{
            if(user.user === sock.username){
                console.log('user disconnected :',sock.username);
                usernames.splice(index,1);

                io.emit('ondisconnect', usernames);
            }
        })
    })

    socket.on('disconnect', ()=>{

        Array.prototype.forEach.call(usernames, (user,index) =>{
            if(user.user === socket.username){
                console.log('user diconnected:',socket.username);
                usernames.splice(index,1);

                io.emit('ondisconnect', usernames);
            }
        })

        
    })

})