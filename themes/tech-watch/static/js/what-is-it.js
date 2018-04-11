import { createBlob } from './blob'
// import Parallax from 'parallax-js'

var blob1 = createBlob({
    element: document.querySelector("#path1"),
    numPoints: 15,
    centerX: 500,
    centerY: 500,
    minRadius: 300,
    maxRadius: 375,
    minDuration: 5, 
    maxDuration: 10
});

var blob2 = createBlob({
    element: document.querySelector("#path2"),
    numPoints: 25,
    centerX: 500,
    centerY: 500,
    minRadius: 300,
    maxRadius: 375,
    minDuration: 5, 
    maxDuration: 10
});
 
console.log('ok') 
