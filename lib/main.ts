import { update as tweenUpdate } from "@tweenjs/tween.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Chessboard from "./chessboard";
import PlayerMouseController from "./controllers/playerMouseController";
import LocalGameMode from "./gamemodes/localGameMode";

const TEXTURE_DIMENSION = 400;
const MESH_DIMENSION = 100;


(async() => { 
	const displayPort = document.getElementById("displayPort");
	if (!displayPort) throw new Error("Invalid html element");
	const gameMode = new LocalGameMode({
		chessboardMeshDimension: MESH_DIMENSION,
		chessboardTextureDimension: TEXTURE_DIMENSION,
		displayPortElement: displayPort,
		width: document.body.clientWidth,
		height: document.body.clientHeight,
		orbitControls: true,
	});
	await gameMode.run();
})();