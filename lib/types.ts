import * as THREE from "three";
import Chessboard from "./chessboard";

export type PlayerOwnership = "player1" | "player2";

export type GameControllerProps  = {
	chessboard: Chessboard;
	ownership: PlayerOwnership;
	scene: THREE.Scene;
}

export interface IEGameObject {
	moveTo(destination: THREE.Vector2): void;
	getAbsolutePosition(): THREE.Vector3;
	getMesh(): THREE.Mesh;
	gerAvailableMoves(): THREE.Vector2[];
	getPlayerOwnership(): PlayerOwnership;
}

export interface IEGameController {
	waitForPlayerMove(): Promise<void>;
}