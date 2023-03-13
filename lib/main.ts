import * as THREE from "three";
import theme from "./colors.json"

const colorStringToInt = (color: string) => { 
	return parseInt(color.substring(1), 16);
}

const TEXTURE_DIMENSION = 200;

function setPixel(buffer: Uint8Array, color: THREE.Color, index: number) {
	const stride = index * 4;
	const r = Math.floor( color.r * 255 );
	const g = Math.floor( color.g * 255 );
	const b = Math.floor( color.b * 255 );
	buffer[stride] = r;
	buffer[stride + 1] = g;
	buffer[stride + 2] = b;
	buffer[stride + 3] = 255;
}

function getBoardTextureBitmap(dimension: number, hover: THREE.Vector2 | undefined) {
	const textureSize = Math.pow(dimension, 2);
	const pixelData = new Uint8Array(4 * textureSize);
	const primaryColor = new THREE.Color(colorStringToInt(theme.primaryColor));
	const secondaryColor = new THREE.Color(colorStringToInt(theme.secondaryColor));
	const hoverColor = new THREE.Color(colorStringToInt(theme.hoverColor));
	const dimensionSquare = Math.floor(dimension / 8);
	let color: THREE.Color = primaryColor;
	let j = 0;
	let k = 0;
	for (let i = 0; i< textureSize; i++) {
		const isPrimaryColor = (0 === (Math.floor(j / dimensionSquare) + Math.floor(k / dimensionSquare)) % 2) ? true : false;
		if (hover 
			&& (k >= (hover.y * dimensionSquare)  && k < ( (hover.y + 1) * dimensionSquare))
			&& (hover.x === Math.floor(j / dimensionSquare)  )) {
			color = hoverColor;
		}
		else if (isPrimaryColor) {
			color = primaryColor;
		} else {
			color = secondaryColor;
		}
		setPixel(pixelData, color, i);
		j++;
		if (j === dimension) {
			j = 0;
			k++;
		}
	}
	return pixelData;
}

function getDataTextureFromBitmap(pixelData: Uint8Array, textureDimension: number) {
	const texture = new THREE.DataTexture(pixelData, textureDimension, textureDimension);
	texture.needsUpdate = true;
	return texture;
}
function getBoard(dimension: number) {
	
	const geometry = new THREE.PlaneGeometry(dimension, dimension);
	const bitmap = getBoardTextureBitmap(TEXTURE_DIMENSION, undefined);
	const tempBufferIndexes = [];
	//const originalColor: THREE.Color | undefined;
	const mat = new THREE.MeshBasicMaterial({
		//color: 0x000000,
		side: THREE.DoubleSide,
		map: getDataTextureFromBitmap(bitmap, TEXTURE_DIMENSION),
	});
	const plane = new THREE.Mesh(geometry, mat);
	plane.position.set(0,0,0);
	plane.scale.set(1, 1, 1);
	return {
		hover(x: number, y: number) {
			const hoverColor = new THREE.Color(colorStringToInt(theme.hoverColor));
			const squreDimension = Math.floor(TEXTURE_DIMENSION / 8);
			const color = hoverColor;
			for (let i = 0; i < squreDimension; i++) {
				for (let j = 0; j < squreDimension; j++) {
					const k = ((y * squreDimension * TEXTURE_DIMENSION) + (i * TEXTURE_DIMENSION) + (x * (squreDimension) + j))
					setPixel(bitmap, color, k);
				}
			}
			mat.map = getDataTextureFromBitmap(bitmap, TEXTURE_DIMENSION);
		},
		plane,
	};
}

function getDebugSphere() {
	const geometry = new THREE.SphereGeometry(2, 32);
	const mat = new THREE.MeshBasicMaterial({
		color: 0x0000ff,
		side: THREE.DoubleSide,
	});
	const sphere = new THREE.Mesh(geometry, mat);
	sphere.position.set(0, 0, 0);
	return sphere;
}

const EPSILON_DELTA = 0.7;
const DELTA_BOUNDS = 5;
(async() => { 
	const width = document.body.clientWidth;
	const height = document.body.clientHeight;
	const scene = new THREE.Scene();
	const light = new THREE.AmbientLight( 0x808080 ); // soft white light
	scene.add(light);
	const camera = new THREE.PerspectiveCamera(90, width / height);
	camera.position.set(0, 0, 100);
	camera.lookAt( 0, 0, 0 );
	const renderer = new THREE.WebGLRenderer({});
	renderer.setSize(width, height);
	renderer.setClearColor( 0xFFEEEE, 1 );
	renderer.outputEncoding = THREE.sRGBEncoding;
	const displayPort = document.getElementById("displayPort");
	if (!displayPort) {
		throw new Error("Display port cannot be found");
	}
	const boardDimensions = 100;
	const board = getBoard(boardDimensions);
	scene.add(board.plane);
	const boundingBox = new THREE.Box3();
	boundingBox.setFromObject(board.plane);
	console.log(boundingBox.min.x);
	displayPort.appendChild(renderer.domElement);
	const cursor = getDebugSphere();
	let lastX: number, lastY: number;
	displayPort.addEventListener("pointermove", ({ clientY, clientX}) => {
			let directionX: number = 0, directionY: number = 0;
			if (EPSILON_DELTA < Math.abs(clientX - lastX)) {
				directionX = 0 < clientX - lastX ? 1 : -1; 
			} else if (EPSILON_DELTA < Math.abs(clientY - lastY)) {
				directionY = 0 > clientY - lastY ? 1 : -1;		
			}
			lastX = clientX;
			lastY = clientY;
			const directionVector = new THREE.Vector3(directionX, directionY).multiplyScalar(2);
			cursor.position.add(new THREE.Vector3(
				Math.abs(cursor.position.x  + directionX) > boardDimensions / 2 ? 0 : directionVector.x, 
				Math.abs(cursor.position.y  + directionY) > boardDimensions / 2 ? 0 : directionVector.y, 
			0));
			
			board.hover(
				(8 - Math.ceil(((boardDimensions / 2) - cursor.position.x) / (boardDimensions / 8))),
				(8 - Math.ceil(((boardDimensions / 2) - cursor.position.y) / (boardDimensions / 8))),
			);
	});
	scene.add(cursor);
	const update = ()  => {
		renderer.render(scene, camera);
		requestAnimationFrame(update);
	}
	update();
})();