//import { generateRandom, sum } from './utils';
import sketch from './sketch';
import Tools from './Tools';
import './what-is-it.js'

 
// global tools
window.tools = new Tools();


if(document.getElementById('timeline')) { 
    new p5(sketch, 'timeline');
}

