import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Chessboard from "./chessboard";
import theme from "./colors.json"
import PlayerMouseController from "./controllers/playerMouseController";

const TEXTURE_DIMENSION = 400;
const MESH_DIMENSION = 100;


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
			player1Color2: theme.primaryColor2,
			player2Color: theme.secondaryColor,
			player2Color2: theme.secondaryColor2,
		},
		textureDimension: TEXTURE_DIMENSION,
	});
	displayPort.appendChild(renderer.domElement);
	const mouseController = new PlayerMouseController({
		chessboard: chessBoard,
		displayPort,
		ownership: "player1",
		pointerColor: new THREE.Color(0, 0 , 180),
		scene
	});
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