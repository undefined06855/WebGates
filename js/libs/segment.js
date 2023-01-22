/*
 * Most of this code is taken from https://codepen.io/GregSpe/pen/bJbJRp.
 * A copy of the licence is included in COPYRIGHTS.txt
 */

function createSegment(x,y,width,height,pointDepth,horizontal) {
    let rectangle = new Path2D();
    rectangle.rect(x, y, width, height);
    rectangle.moveTo(x, y);
    if (horizontal) {
      // left triangle
      rectangle.lineTo(x - pointDepth, y + (height/2));
      rectangle.lineTo(x, y + height);
      // right triangle
      rectangle.moveTo(x+width, y);
      rectangle.lineTo(x+width+pointDepth,y + (height/2));
      rectangle.lineTo(x+width, y+height);
    } else {
      // top triangle
      rectangle.lineTo(x + (width/2), y-pointDepth);
      rectangle.lineTo(x+width, y);
      // bottom triangle
      rectangle.moveTo(x, y+height);
      rectangle.lineTo(x + (width/2), y+height+pointDepth);
      rectangle.lineTo(x+width, y+height);
    }
    
    rectangle.closePath();
    
    return rectangle;
}

const segA = createSegment(15,0,40,12,6,true);
const segB = createSegment(58,14,12,40,8);
const segC = createSegment(58,72,12,40,8);
const segD = createSegment(15,114,40,12,6,true);
const segE = createSegment(0,72,12,40,8);
const segF = createSegment(0,14,12,40,8);
const segG = createSegment(15,57,40,12,6,true);


const segmentlist = [segA, segB, segC, segD, segE, segF, segG]
// custom:
function fillSegments(_ctx, _canvas, segments)
{
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height)
    for (var i = 0; i < segments.length; i++)
    {
      if (segments[i]) _ctx.fillStyle = "#f00"
      else _ctx.fillStyle = "#461e05"
      _ctx.fill(segmentlist[i])
    }
}