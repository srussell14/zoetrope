const fs = require('fs')
const http = require('http')

sockets = []
canvases = []

let canvasWidth = 768
let canvasHeight = 1024
let spacing = 60
let numberOfIpads = 2
let totalWidth = (numberOfIpads * canvasWidth) + (numberOfIpads * spacing)

let position = {x: 0, y: 300}
let flyToY = 300

const httpServer = http.createServer((req, res) => {

    let filename = (req.url.split("?")[0] !== "/") ? req.url.split("?")[0] : "/index.html"

    fs.readFile(__dirname + filename, (err, data) => {



        console.log(`File: ${__dirname + filename}`)
        if (err) {
            res.setHeader("Content-Type", "application/json")
            res.statusCode = 404
            res.end(JSON.stringify(err))
            return

        }

        res.writeHead(200)
        res.end(data)

    })

})

const io = require('socket.io')(httpServer)

setInterval(() => {

    io.emit("position", position)

    position.x = position.x + 10;

    if (position.y != flyToY) {

      if (position.y < flyToY) {
        position.y = position.y + 10
        if (position.y > flyToY) {
          position.y = flyToY
        }
      }

      if (position.y > flyToY) {
        position.y = position.y - 10
        if (position.y < flyToY) {
          positiony = flyToY
        }
      }
    }

    if (position.x > totalWidth) {

        position.x = 0;
    }

}, 50)

io.on("connection", (socket) => {


    sockets.push(socket)

    console.log(socket.handshake.headers.referer.split("=")[1])


    console.log("Canvas connected!", sockets.length)

    //totalWidth = (sockets.length * canvasWidth) + (60 * sockets.length - 1);

    socket.on("identify", (id) => {

        console.log(`Canvas ID: ${id}`)
        canvases[sockets.indexOf(socket)] = id;

    })

    socket.on("touch", (data) => {
      //console.log(data.x, data.y, data.canvasId)
      console.log(typeof data.x)
      let cid = parseInt(data.canvasId)
      console.log(position.x, parseInt(data.canvasId)*canvasWidth, (parseInt(data.canvasId)+1) * canvasWidth)
      if (position.x > (cid * canvasWidth) && position.x < canvasWidth * (cid+1) ) {
      flyToY = data.y
      }
    })

    socket.on("disconnect", () => {

        //TO Add splicing to remove disconnected client
        sockets = sockets.filter((sock) => socket.handshake.headers.referer.split("=")[1] !== sock.handshake.headers.referer.split("=")[1])

        //totalWidth = (sockets.length * canvasWidth) + (60 * sockets.length - 1);

        console.log("Disconnected")
        // console.log(`${canvases[sockets.indexOf(socket)]} disconnected`)

    })

})

httpServer.listen(4008, () => {
    console.log("Server Listening")
})
