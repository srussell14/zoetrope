let voyager

let position = {x: 0, y: 0}

let canvasId = undefined;

let selectedId = -1;

let canvasWidth = 768
let canvasHeight = 1024

let socket

let spacing = 60

function preload() {

    bird = createImg('Bird.gif')

}

function setup() {



    // canvasWidth = document.documentElement.clientWidth
    // canvasHeight = document.documentElement.clientHeight
    //console.log(document.documentElement.clientWidth, document.documentElement.clientHeight)
    createCanvas(canvasWidth, canvasHeight)

    canvasId = window.location.search.substr(1).split("=")[1]

    setupSocket()

}

function draw() {

    fill(0, 200, 255)
    noStroke()
    rect(0,0,canvasWidth, canvasHeight)

    // console.log(position.x - (canvasWidth * canvasId) - (spacing * canvasId), position.y)
    bird.position(position.x - (canvasWidth * canvasId) - (spacing * canvasId), position.y)

}

function touchEnded() {

  socket.emit("touch", {x: mouseX, y: mouseY, canvasId: canvasId})

}


function setupSocket() {

    socket = io()

    if (socket !== undefined) {

        //Identify yourself

        socket.emit("identify", canvasId)

        socket.on("position", (pos) => {

                position = pos;

        })

    }
}
