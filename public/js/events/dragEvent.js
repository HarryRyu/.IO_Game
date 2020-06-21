import {returnParameter} from '../parameters.js'

const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext("2d")

var zoom = returnParameter("zoom");
var mousedown = false;
var mousemove = false;
var mousePosition_x;
var mousePosition_y;

//when mouse is dragged

export function dragEvent(drawQueue){
        canvas.addEventListener("mousedown", event => {
        mousedown = true;
        var tmp = setTimeout(function(){
            if (mousedown) {
                mousemove = true;
                mousePosition_x = event.clientX;
                mousePosition_y = event.clientY;
            }
        },10)
        canvas.addEventListener("mousemove", event => {
            clearTimeout(tmp);
        })
    })

    canvas.addEventListener("mousemove", event => {
        if (mousemove) {
            ctx.translate(event.clientX - mousePosition_x, event.clientY - mousePosition_y);
            zoom.originx += mousePosition_x - event.clientX ;
            zoom.originy += mousePosition_y - event.clientY ;
            mousePosition_x = event.clientX;
            mousePosition_y = event.clientY;
            drawQueue[0]++;
        }
    })
    document.addEventListener("mouseup", event => {
        mousedown = false;
        mousemove = false;
    })
}