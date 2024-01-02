import * as THREE from "three";
import GameObject, { GameObjectProps } from "./index";

export default class Pawn  extends GameObject {

	private direction: 1 | -1 = 1;
	constructor(props: GameObjectProps)  {
		super(props);
		this.direction = "player1" === this.getPlayerOwnership() ? 1 : -1; 
	}

	getMesh(): THREE.Mesh {
		const mesh = this.refMesh;
		if (mesh) {
			return mesh;
		}
		const geometry = new THREE.BoxGeometry(5, 5, 10);
		const material = new THREE.MeshBasicMaterial( { color: this.color.getHex("srgb")  });
		const cube = new THREE.Mesh(geometry, material);
		this.refMesh = cube;
		return cube;
	}
	gerAvailableMoves(): THREE.Vector2[] {
		const movements: THREE.Vector2[] = [];
		const forwardsSquare = new THREE.Vector2(this.currentBoardPosition.x, this.currentBoardPosition.y + this.direction);
		if (!this.refChessboard.getGameObject(forwardsSquare)) {
			movements.push(forwardsSquare);
		}
		const leftDiagonalSquare =  new THREE.Vector2(this.currentBoardPosition.x - 1, this.currentBoardPosition.y + this.direction);
		const leftDiagonalSquareGameObject = this.refChessboard.getGameObject(leftDiagonalSquare);
		if (leftDiagonalSquareGameObject && leftDiagonalSquareGameObject.getPlayerOwnership() !== this.getPlayerOwnership()) {
			movements.push(leftDiagonalSquare);
		}
		const rightDiagonalSquare =  new THREE.Vector2(this.currentBoardPosition.x + 1, this.currentBoardPosition.y + this.direction);
		const rightDiagonalSquareGameObject = this.refChessboard.getGameObject(rightDiagonalSquare);
		if (rightDiagonalSquareGameObject && rightDiagonalSquareGameObject.getPlayerOwnership() !== this.getPlayerOwnership()) {
			movements.push(rightDiagonalSquare);
		}
		if (this.initialBoardPosition.equals(this.currentBoardPosition)) {
			const forwardsForwardsSquare = new THREE.Vector2(this.currentBoardPosition.x, this.currentBoardPosition.y + (this.direction * 2));
			if (!this.refChessboard.getGameObject(forwardsForwardsSquare)) {
				movements.push(forwardsForwardsSquare);
			}
		}
		return movements;
	}
	protected transformPosition(p: THREE.Vector3): THREE.Vector3 {
		return new THREE.Vector3(
			p.x,
			p.y,
			p.z + 3,
		)
	}
	
}