import {
	createBlob
} from './blob'

// import Parallax from 'parallax-js'
if (document.getElementById('what-is-it')) {

	var blob1 = createBlob({
		element: document.querySelector("#path1"), 
		numPoints: 25,
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

	var blob3 = createBlob({
		element: document.querySelector("#path3"),
		numPoints: 25,
		centerX: 500,
		centerY: 500,
		minRadius: 200,
		maxRadius: 245,
		minDuration: 5,
		maxDuration: 10
	});


	AOS.init({
		duration: 1200,
	});

	var scene = document.getElementById('scene');
	var scene2 = document.getElementById('scene2');
	var scene3 = document.getElementById('scene3');
	var scene4 = document.getElementById('scene4');

	var parallaxInstance = new Parallax(scene);
	var parallaxInstance2 = new Parallax(scene2);
	var parallaxInstance2 = new Parallax(scene3);
	var parallaxInstance2 = new Parallax(scene4);

}


console.log('ok')
console.log('ok')
