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

const segA = createSegment(35,16,40,12,6,true);
const segB = createSegment(78,30,12,40,8);
const segC = createSegment(78,88,12,40,8);
const segD = createSegment(35,130,40,12,6,true);
const segE = createSegment(20,88,12,40,8);
const segF = createSegment(20,30,12,40,8);
const segG = createSegment(35,73,40,12,6,true);

// custom:
function fillSegments(_ctx, segments)
{
    if (segments[0]) _ctx.fill(segA)
    if (segments[1]) _ctx.fill(segB)
    if (segments[2]) _ctx.fill(segC)
    if (segments[3]) _ctx.fill(segD)
    if (segments[4]) _ctx.fill(segE)
    if (segments[5]) _ctx.fill(segF)
    if (segments[6]) _ctx.fill(segG)
}