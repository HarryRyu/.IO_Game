import {returnParameter} from '../parameters.js'

const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext("2d")
var zoomSetting = returnParameter("zoom")
//
//When mouse wheel is rolled
//

export function wheelEvent(drawQueue) {
    canvas.addEventListener("wheel", event => {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext("2d")
        const wheel = event.wheelDelta;
        var zoom = 0;
    
        if (wheel < 0){
            zoom = 0.95;
            if (zoomSetting.currentzoom < 0.7){
                return;
            }
        }
        else {
            zoomSetting.mousex = event.clientX - canvas.offsetLeft;
            zoomSetting.mousey = event.clientY - canvas.offsetTop;
            zoom = 1.05;
            if (zoomSetting.currentzoom > 2){
                return;
            }
        }
        zoomSetting.currentzoom *= zoom;
        ctx.translate(zoomSetting.originx, zoomSetting.originy);
        ctx.scale(zoom,zoom);
        ctx.translate(-(zoomSetting.mousex / zoomSetting.scale + zoomSetting.originx - zoomSetting.mousex / (zoomSetting.scale * zoom)),
                      -(zoomSetting.mousey / zoomSetting.scale + zoomSetting.originy - zoomSetting.mousey / (zoomSetting.scale * zoom))
        );
        
        zoomSetting.originx = (zoomSetting.mousex / zoomSetting.scale + zoomSetting.originx - zoomSetting.mousex / (zoomSetting.scale * zoom));
        zoomSetting.originy = (zoomSetting.mousey / zoomSetting.scale + zoomSetting.originy - zoomSetting.mousey / (zoomSetting.scale * zoom));
        zoomSetting.scale *= zoom;
        drawQueue[0]++;
    })
}