import Chessboard from "../chessboard";

export type GameObjectProps = { 
	scene:THREE.Scene;
	initialPosition: THREE.Vector3;
	chessboard: Chessboard;
};
export default abstract class GameObject {
	
	private refChessboard: Chessboard;
	private refMesh: THREE.Mesh | undefined;

	constructor({ scene, initialPosition, chessboard}: GameObjectProps)  {
		const mesh = this.getMesh();
		scene.add(mesh);
		mesh.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
		this.refChessboard = chessboard;
	}
	moveTo(destination: THREE.Vector3) {
		this.refMesh?.position.set(destination.x, destination.y, destination.z);
	}
	abstract getMesh(): THREE.Mesh;
	abstract gerAvailableMoves(): THREE.Vector2[];
}