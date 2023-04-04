import * as THREE from "three";
import GameController from ".";
import { GameControllerProps, PlayerOwnership } from "../types";
import { colorStringToInt } from "../utils";

const EPSILON_DELTA = 0.7;

type PlayerMouseControllerProps = {
	pointerColor: THREE.Color;
	displayPort: HTMLElement;
}
export default class PlayerMouseController extends GameController {
	pointer: THREE.Mesh | undefined;

	private pointerColor: THREE.Color;

	private domDisplayElement: HTMLElement;

	private lastX: number = 0;
	private lastY: number = 0;
	
	constructor({ chessboard, ownership, scene, pointerColor, displayPort }: GameControllerProps & PlayerMouseControllerProps) {
		super({ chessboard, ownership, scene });
		this.pointerColor = pointerColor;
		this.domDisplayElement = displayPort;
		this.createDebugSphere();
		this.initializeMouseMove();
		
	}

	private initializeMouseMove() {
			this.lastX = 0;
			this.lastY = 0;
			this.domDisplayElement.addEventListener("pointermove", ({ clientY, clientX}) => {
				let directionX: number = 0, directionY: number = 0;
				if (EPSILON_DELTA < Math.abs(clientX - this.lastX)) {
					directionX = 0 < clientX - this.lastX ? 1 : -1; 
				} else if (EPSILON_DELTA < Math.abs(clientY - this.lastY)) {
					directionY = 0 > clientY - this.lastY ? 1 : -1;		
				}
				const boardDimensions = this.chessboard.getBoardDimension();
				this.lastX = clientX;
				this.lastY = clientY;
				const directionVector = new THREE.Vector3(directionX, directionY).multiplyScalar(2);
				this.pointer?.position.add(new THREE.Vector3(
					Math.abs(this.pointer?.position.x  + directionX) > boardDimensions / 2 ? 0 : directionVector.x, 
					Math.abs(this.pointer?.position.y  + directionY) > boardDimensions / 2 ? 0 : directionVector.y, 
				0));
				let boardHoverX = (8 - Math.ceil(((boardDimensions / 2) - (this.pointer?.position.x || 0)) / (boardDimensions / 8)));
				let boardHoverY = (8 - Math.ceil(((boardDimensions / 2) - (this.pointer?.position.y || 0)) / (boardDimensions / 8)));
				if (7 < boardHoverX) {
					boardHoverX = 7;
				} 
				if (7 < boardHoverY) {
					boardHoverY = 7;
				} 
				const gameObject = this.chessboard.getGameObject(new THREE.Vector2(boardHoverX, boardHoverY));
				if (this.ownership === gameObject?.getPlayerOwnership()) {
					this.chessboard.hover(
						boardHoverX,
						boardHoverY,
					);
				} else {
					this.chessboard.resetHover();
				}
		});
	}
	
	private createDebugSphere() {
		const geometry = new THREE.SphereGeometry(2, 32);
		const mat = new THREE.MeshBasicMaterial({
			color: this.pointerColor.getHex(),
			side: THREE.DoubleSide,
		});
		const sphere = new THREE.Mesh(geometry, mat);
		sphere.position.set(0, 0, 0);
		this.pointer = sphere;
		this.scene.add(this.pointer);
	}
	
	public setPlayerOwnership(ownership: PlayerOwnership) {
		this.ownership = ownership;
	}

	async waitForPlayerMove(): Promise<void> {

	}
	
}