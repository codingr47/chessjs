import * as THREE from "three";
import GameObject from "./index";

export default class Pawn  extends GameObject {
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
		if (this.initialBoardPosition.equals(this.currentBoardPosition)) {
			movements.push(new THREE.Vector2(this.currentBoardPosition.x, this.currentBoardPosition.y + 1));
			movements.push(new THREE.Vector2(this.currentBoardPosition.x, this.currentBoardPosition.y + 2));
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