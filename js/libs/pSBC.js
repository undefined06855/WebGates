// Version 4
// https://stackoverflow.com/a/13542669/

// pSBC lightens or darkens a hex or rgb colour. (unused)

// this function is a smaller part of pSBC, which just
// does shading (lighter and darker)
const RGB_Linear_Shade=(p,c)=>{
    var i=parseInt,r=Math.round,[a,b,c,d]=c.split(","),P=p<0,t=P?0:255*p,P=P?1+p:1-p;
    return"rgb"+(d?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+t)+","+r(i(b)*P+t)+","+r(i(c)*P+t)+(d?","+d:")");
}

// helper hex => rgb function
// modified from https://stackoverflow.com/a/5624139/
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? "rgb(" + 
       + parseInt(result[1], 16) + ","
       + parseInt(result[2], 16) + ","
       + parseInt(result[3], 16) + ")"
    : null;
  }
  