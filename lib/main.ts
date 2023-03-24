import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Chessboard from "./chessboard";
import theme from "./colors.json"

const TEXTURE_DIMENSION = 400;
const MESH_DIMENSION = 100;

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
	const chessBoard = new Chessboard(scene, {
		meshDimension: MESH_DIMENSION,
		colors: {
			hoverColor: theme.hoverColor,
			player1Color: theme.primaryColor,
			player2Color: theme.secondaryColor,
		},
		textureDimension: TEXTURE_DIMENSION,
	});
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
			chessBoard.hover(
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