import * as THREE from "three";
import GameObject, { GameObjectProps } from "./index";
import { inBoardBounds } from "../../../../sdk/lib/utils";

export default class Knight  extends GameObject {

	constructor(props: GameObjectProps)  {
		super(props);
	}

	getMesh(): THREE.Mesh {
		const mesh = this.refMesh;
		if (mesh) {
			return mesh;
		}
		const geometry = new THREE.TorusGeometry(2, 2, 10);
		const material = new THREE.MeshBasicMaterial( { color: this.color.getHex("srgb")  });
		const torus = new THREE.Mesh(geometry, material);
		this.refMesh = torus;
		return torus;
	}
	gerAvailableMoves(): THREE.Vector2[] {
		const rightMoveUp = new THREE.Vector2(this.currentBoardPosition.x + 1, this.currentBoardPosition.y + 2);
		const rightMoveDown = new THREE.Vector2(this.currentBoardPosition.x + 1, this.currentBoardPosition.y -  2);
		const leftMoveUp =  new THREE.Vector2(this.currentBoardPosition.x -1 , this.currentBoardPosition.y + 2);
		const leftMoveDown = new THREE.Vector2(this.currentBoardPosition.x - 1, this.currentBoardPosition.y -  2);
		const alterRightMoveUp = new THREE.Vector2(this.currentBoardPosition.x + 2, this.currentBoardPosition.y + 1);
		const alterRightMoveDown = new THREE.Vector2(this.currentBoardPosition.x + 2, this.currentBoardPosition.y - 1);
		const alterLeftMoveUp = new THREE.Vector2(this.currentBoardPosition.x - 2, this.currentBoardPosition.y + 1);
		const alterLeftMoveDown = new THREE.Vector2(this.currentBoardPosition.x - 2, this.currentBoardPosition.y - 1);
	    return [rightMoveUp, rightMoveDown, leftMoveUp, leftMoveDown, alterRightMoveUp, alterRightMoveDown, alterLeftMoveUp, alterLeftMoveDown]
			.filter((v) => {
				const objectAtVector = this.refChessboard.getGameObject(v);
				return inBoardBounds(v) && (!objectAtVector || (objectAtVector &&  objectAtVector.getPlayerOwnership() !== this.getPlayerOwnership()));
			});
	}
	protected transformPosition(p: THREE.Vector3): THREE.Vector3 {
		return new THREE.Vector3(
			p.x,
			p.y,
			p.z + 3,
		)
	}
	
}