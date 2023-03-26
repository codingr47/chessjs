import * as THREE from "three";
import Chessboard from "../chessboard";
import { IEGameObject, PlayerOwnership } from "../types";

export type GameObjectProps = { 
	scene:THREE.Scene;
	initialBoardPosition: THREE.Vector2;
	chessboard: Chessboard;
	color: THREE.Color;
	playerOwnership: PlayerOwnership;
};
export default abstract class GameObject  implements IEGameObject{
	
	private refChessboard: Chessboard;
	private ownership: PlayerOwnership;
	protected refMesh: THREE.Mesh | undefined;
	protected color: THREE.Color;
	protected initialBoardPosition: THREE.Vector2;
	protected currentBoardPosition: THREE.Vector2;

	constructor({ scene, initialBoardPosition, chessboard, color, playerOwnership }: GameObjectProps)  {
		this.refChessboard = chessboard;
		this.color = color;
		this.initialBoardPosition = initialBoardPosition;
		this.currentBoardPosition = this.initialBoardPosition;
		this.ownership = playerOwnership;
		const mesh = this.getMesh();
		scene.add(mesh);
		this.moveTo(this.initialBoardPosition);
	}
	moveTo(destination: THREE.Vector2) {
		const threeDSpaceGameObjectPosition = this.transformPosition(this.refChessboard.logicalPositionToRealPosition(destination));
		this.getMesh().position.set(threeDSpaceGameObjectPosition.x, threeDSpaceGameObjectPosition.y, threeDSpaceGameObjectPosition.z);
		this.currentBoardPosition = destination;
	}
	getAbsolutePosition(): THREE.Vector3 {
		const position = new THREE.Vector3();
		this.getMesh().getWorldPosition(position);
		return position;
	}
	getPlayerOwnership(): PlayerOwnership {
		return this.ownership;
	}
	abstract getMesh(): THREE.Mesh;
	abstract gerAvailableMoves(): THREE.Vector2[];
	protected abstract transformPosition(p: THREE.Vector3): THREE.Vector3;
}