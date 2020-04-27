const express = require('express')
const app = express()
const fs = require('fs')
const options = {
  key: fs.readFileSync('henkausssl.key'),
  cert: fs.readFileSync('henkaus.com.crt')
};
const https = require('https')
var server=https.createServer(options, app);
server.listen(443,function(){
console.log('Server running on port 3000')
});
const http = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000 

app.use(express.static(__dirname + "/public"))
let clients = 0

io.on('connection', function (socket) {
    socket.on("NewClient", function () {
	    console.log(clients)
        if (clients < 2) {
            if (clients == 1) {
                this.emit('CreatePeer')
            }
        }
        else
            this.emit('SessionActive')
        clients++;
    })
    socket.on('message', function(message){
        console.log('message' + message)
        this.broadcast.emit("messagedata", message)
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}

//https.listen(443, () => console.log(`Active on ${port} port`))
/*
var server=https.createServer(options, app);
server.listen(443,function(){
console.log('Server running on port 3000')
});
*/
