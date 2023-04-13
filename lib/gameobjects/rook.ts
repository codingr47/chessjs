import * as THREE from "three";
import GameObject, { GameObjectProps } from "./index";

export default class Rook extends GameObject {

	constructor(props: GameObjectProps)  {
		super(props);
	}

	getMesh(): THREE.Mesh {
		const mesh = this.refMesh;
		if (mesh) {
			return mesh;
		}
		const geometry = new THREE.ConeGeometry(5, 5, 10);
		const material = new THREE.MeshBasicMaterial( { color: this.color.getHex("srgb")  });
		const cone = new THREE.Mesh(geometry, material);
		cone.rotateX(THREE.MathUtils.degToRad(90));
		this.refMesh = cone;
		return cone;
	}
	gerAvailableMoves(): THREE.Vector2[] {
		const moves: THREE.Vector2[] = [];
		for (let x = this.currentBoardPosition.x + 1; x <= 7; x++ ) {
			const gameObjectAtPosition = this.refChessboard.getGameObject(new THREE.Vector2(x, this.currentBoardPosition.y));
			if (!gameObjectAtPosition) {
				moves.push(new THREE.Vector2(x, this.currentBoardPosition.y));
			} else if (gameObjectAtPosition && gameObjectAtPosition.getPlayerOwnership() !== this.getPlayerOwnership()) {
				moves.push(new THREE.Vector2(x, this.currentBoardPosition.y));
				break;
			} else {
				break;
			}
		}
		for (let x = this.currentBoardPosition.x - 1; x >= 0; x-- ) {
			const gameObjectAtPosition = this.refChessboard.getGameObject(new THREE.Vector2(x, this.currentBoardPosition.y));
			if (!gameObjectAtPosition) {
				moves.push(new THREE.Vector2(x, this.currentBoardPosition.y));
			} else if (gameObjectAtPosition && gameObjectAtPosition.getPlayerOwnership() !== this.getPlayerOwnership()) {
				moves.push(new THREE.Vector2(x, this.currentBoardPosition.y));
				break;
			} else {
				break;
			}
		}
		for (let y = this.currentBoardPosition.y + 1; y <= 7; y++ ) {
			const gameObjectAtPosition = this.refChessboard.getGameObject(new THREE.Vector2(this.currentBoardPosition.x, y));
			if (!gameObjectAtPosition) {
				moves.push(new THREE.Vector2(this.currentBoardPosition.x, y));
			} else if (gameObjectAtPosition && gameObjectAtPosition.getPlayerOwnership() !== this.getPlayerOwnership()) {
				moves.push(new THREE.Vector2(this.currentBoardPosition.x, y));
				break;
			} else {
				break;
			}
		}
		for (let y = this.currentBoardPosition.y - 1; y >= 0; y-- ) {
			const gameObjectAtPosition = this.refChessboard.getGameObject(new THREE.Vector2(this.currentBoardPosition.x, y));
			if (!gameObjectAtPosition) {
				moves.push(new THREE.Vector2(this.currentBoardPosition.x, y));
			} else if (gameObjectAtPosition && gameObjectAtPosition.getPlayerOwnership() !== this.getPlayerOwnership()) {
				moves.push(new THREE.Vector2(this.currentBoardPosition.x, y));
				break;
			} else {
				break;
			}
		}
		return moves;
	}
	protected transformPosition(p: THREE.Vector3): THREE.Vector3 {
		return new THREE.Vector3(
			p.x,
			p.y,
			p.z + 3,
		)
	}
	
}