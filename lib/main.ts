import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import theme from "./colors.json"

const colorStringToInt = (color: string) => { 
	return parseInt(color.substring(1), 16);
}

const TEXTURE_DIMENSION = 400;

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

function getPixelColor(buffer: Uint8Array, index: number): THREE.Color {
	const stride = index * 4;
	const r = buffer[stride] / 255;
	const g = buffer[stride + 1] / 255;
	const b = buffer[stride + 2] / 255;
	return new THREE.Color(r, g, b);
}
function getBoardTextureBitmap(dimension: number) {
	const textureSize = Math.pow(dimension, 2);
	const pixelData = new Uint8Array(4 * textureSize);
	const primaryColor = new THREE.Color(colorStringToInt(theme.primaryColor));
	const secondaryColor = new THREE.Color(colorStringToInt(theme.secondaryColor));
	const dimensionSquare = Math.floor(dimension / 8);
	let color: THREE.Color = primaryColor;
	let j = 0;
	let k = 0;
	for (let i = 0; i< textureSize; i++) {
		const isPrimaryColor = (0 === (Math.floor(j / dimensionSquare) + Math.floor(k / dimensionSquare)) % 2) ? true : false;
		if (isPrimaryColor) {
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
	texture.minFilter = THREE.LinearFilter;
	return texture;
}

function fillOriginalColorsMap(buffer: Uint8Array, map: Map<string, THREE.Color>) {
	const squreDimension = TEXTURE_DIMENSION / 8;

	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			const index =  ((y * squreDimension * TEXTURE_DIMENSION) + (x * (squreDimension)));
			map.set(`${x},${y}`, getPixelColor(buffer, index));
		}
	}
}

function getBoard(dimension: number) {
	const geometry = new THREE.PlaneGeometry(dimension, dimension);
	const boardOriginalColorsMap = new Map<string, THREE.Color>();
	const bitmap = getBoardTextureBitmap(TEXTURE_DIMENSION);
	fillOriginalColorsMap(bitmap, boardOriginalColorsMap);
	console.log(boardOriginalColorsMap);
	let tempBufferIndexes: number[] = [];
	const mat = new THREE.MeshBasicMaterial({
		//color: 0x000000,
		side: THREE.DoubleSide,
		map: getDataTextureFromBitmap(bitmap, TEXTURE_DIMENSION),
	});
	const plane = new THREE.Mesh(geometry, mat);
	plane.position.set(0,0,0);
	plane.scale.set(1, 1, 1);
	let lastHoveredX: number, lastHoveredY: number;
	return {
		hover(x: number, y: number) {
			const hoverColor = new THREE.Color(colorStringToInt(theme.hoverColor));
			const squreDimension = Math.floor(TEXTURE_DIMENSION / 8);
			const color = hoverColor;
			const originalColor = boardOriginalColorsMap.get(`${lastHoveredX},${lastHoveredY}`);
			if (0 < tempBufferIndexes.length && originalColor) {
				for (const i of tempBufferIndexes) {
					setPixel(bitmap, originalColor, i);
				}
				tempBufferIndexes = [];
			}
			for (let i = 0; i < squreDimension; i++) {
				for (let j = 0; j < squreDimension; j++) {
					const k = ((y * squreDimension * TEXTURE_DIMENSION) + (i * TEXTURE_DIMENSION) + (x * (squreDimension) + j))
					setPixel(bitmap, color, k);
					tempBufferIndexes.push(k);
				}
			}
			lastHoveredX = x;
			lastHoveredY = y;
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
	const renderer = new THREE.WebGLRenderer({ antialias: true, });
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
			let boardHoverX = (8 - Math.ceil(((boardDimensions / 2) - cursor.position.x) / (boardDimensions / 8)));
			let boardHoverY = (8 - Math.ceil(((boardDimensions / 2) - cursor.position.y) / (boardDimensions / 8)));
			if (7 < boardHoverX) {
				boardHoverX = 7;
			} 
			if (7 < boardHoverY) {
				boardHoverY = 7;
			} 
			board.hover(
				boardHoverX,
				boardHoverY,
			);
	});
	scene.add(cursor);

	const orbit = new OrbitControls(camera, renderer.domElement);
	orbit.enableDamping = true;
	orbit.zoomSpeed = 0.3;
	orbit.maxPolarAngle = THREE.MathUtils.degToRad(135);
	orbit.minPolarAngle = THREE.MathUtils.degToRad(90);
	orbit.maxAzimuthAngle = THREE.MathUtils.degToRad(45);
	orbit.minAzimuthAngle = THREE.MathUtils.degToRad(-45);
	orbit.enablePan = false;
	const update = ()  => {
		renderer.render(scene, camera);
		orbit.update();
		requestAnimationFrame(update);
	}
	update();
})();