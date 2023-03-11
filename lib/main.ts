import * as THREE from "three";
import theme from "./colors.json"

const colorStringToInt = (color: string) => { 
	return parseInt(color.substring(1), 16);
}

function getBoardTexture(dimension: number) {
	const textureSize = Math.pow(dimension, 2);
	const pixelData = new Uint8Array(4 * textureSize);
	const primaryColor = new THREE.Color(colorStringToInt(theme.primaryColor));
	const secondaryColor = new THREE.Color(colorStringToInt(theme.secondaryColor));
	const dimensionSquare = Math.floor(dimension / 8);
	let color: THREE.Color = primaryColor;
	let j = 0;
	let k = 0;
	for (let i = 0; i< textureSize; i++) {
		const stride = i * 4;
		const isPrimaryColor = (0 === (Math.floor(j / dimensionSquare) + Math.floor(k / dimensionSquare)) % 2) ? true : false;
		if (isPrimaryColor) {
			color = primaryColor;
		} else {
			color = secondaryColor;
		}
		const r = Math.floor( color.r * 255 );
		const g = Math.floor( color.g * 255 );
		const b = Math.floor( color.b * 255 );
		pixelData[stride] = r;
		pixelData[stride + 1] = g;
		pixelData[stride + 2] = b;
		pixelData[stride + 3] = 255;
		j++;
		if (j === dimension) {
			j = 0;
			k++;
		}
	}
	const texture = new THREE.DataTexture(pixelData, dimension, dimension);
	texture.needsUpdate = true;
	return texture;
}
function getBoard() {
	const geometry = new THREE.PlaneGeometry(100, 100);
	const mat = new THREE.MeshBasicMaterial({
		//color: 0x000000,
		side: THREE.DoubleSide,
		map: getBoardTexture(200),
	});
	const plane = new THREE.Mesh(geometry, mat);
	plane.position.set(0,0,0);
	return plane;
}

(async() => { 
	const width = document.body.clientWidth;
	const height = document.body.clientHeight;
	const scene = new THREE.Scene();
	const light = new THREE.AmbientLight( 0x808080 ); // soft white light
	scene.add(light);
	const camera = new THREE.PerspectiveCamera( 45,width / height, 1, 500 );
	camera.position.set(0, 0, 500);
	camera.lookAt( 0, 0, 0 );
	const renderer = new THREE.WebGLRenderer({});
	renderer.setSize(width, height);
	renderer.setClearColor( 0xFFEEEE, 1 );
	renderer.outputEncoding = THREE.sRGBEncoding;
	const displayPort = document.getElementById("displayPort");
	if (!displayPort) {
		throw new Error("Display port cannot be found");
	}
	scene.add(getBoard());
	displayPort.appendChild(renderer.domElement);
	const update = ()  => {
		renderer.render(scene, camera);
		requestAnimationFrame(update);
	}
	update();
})();