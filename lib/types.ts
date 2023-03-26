import * as THREE from "three";

export type PlayerOwnership = "player1" | "player2";

export interface IEGameObject {
	moveTo(destination: THREE.Vector2): void;
	getAbsolutePosition(): THREE.Vector3;
	getMesh(): THREE.Mesh;
	gerAvailableMoves(): THREE.Vector2[];
	getPlayerOwnership(): PlayerOwnership;
}