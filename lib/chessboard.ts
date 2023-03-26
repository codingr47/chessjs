import * as THREE from "three";
import Pawn from "./gameobjects/pawn";
import { IEGameObject } from "./types";
import { colorStringToInt } from "./utils";

export type Colors = {
	player1Color: string;
	player1Color2: string;
	player2Color: string;
	player2Color2: string;
	hoverColor: string;
}


export type ChessboardOptions = {
	textureDimension: number;
	meshDimension: number; 
	colors: Colors;
}


export default class Chessboard {

	private pixelData: Uint8Array;

	private textureDimension:number;

	private meshDimension: number;

	private sceneRef: THREE.Scene;
	
	private colors: Colors;

	private boardMesh: THREE.Mesh | undefined;

	private boardMaterial: THREE.MeshBasicMaterial | undefined;

	private boardOriginalColorsMap: Map<string, THREE.Color> | undefined;

	private tempBufferIndexes: number[];

	private lastHoveredX: number = 0;

	private lastHoveredY: number = 0;

	private gameObjects: (IEGameObject | null)[][];


	constructor(scene: THREE.Scene, { meshDimension, textureDimension, colors }: ChessboardOptions) {
		this.pixelData = new Uint8Array();
		this.tempBufferIndexes = [];
		this.textureDimension = textureDimension;
		this.meshDimension = meshDimension;
		this.colors = colors;
		this.sceneRef = scene;
		this.gameObjects = [];
		this.initializeTexture();
		this.initializeMesh();
		this.fillOriginalColorsMap();
		this.initializeGameObjects();

	}

	private fillOriginalColorsMap() {
		this.boardOriginalColorsMap = new Map<string, THREE.Color>();
		const squreDimension = this.textureDimension / 8;
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				const index =  ((y * squreDimension * this.textureDimension) + (x * (squreDimension)));
				this.boardOriginalColorsMap.set(`${x},${y}`, this.getPixelColor(index));
			}
		}
	}

	private setPixel(color: THREE.Color, index: number) {
		const stride = index * 4;
		const r = Math.floor( color.r * 255 );
		const g = Math.floor( color.g * 255 );
		const b = Math.floor( color.b * 255 );
		this.pixelData[stride] = r;
		this.pixelData[stride + 1] = g;
		this.pixelData[stride + 2] = b;
		this.pixelData[stride + 3] = 255;
	}

	private getPixelColor(index: number): THREE.Color {
		const stride = index * 4;
		const r = this.pixelData[stride] / 255;
		const g = this.pixelData[stride + 1] / 255;
		const b = this.pixelData[stride + 2] / 255;
		return new THREE.Color(r, g, b);
	}

	private initializeTexture() {
		const textureSize = Math.pow(this.textureDimension, 2);
		this.pixelData = new Uint8Array(4 * textureSize);
		const primaryColor = new THREE.Color(colorStringToInt(this.colors.player1Color));
		const secondaryColor = new THREE.Color(colorStringToInt(this.colors.player2Color));
		const dimensionSquare = Math.floor(this.textureDimension / 8);
		let color: THREE.Color = primaryColor;
		let j = 0;
		let k = 0;
		for (let i = 0; i< textureSize; i++) {
			const isPrimaryColor = (0 === (Math.floor(j / dimensionSquare) + Math.floor(k / dimensionSquare)) % 2) ? true : false;
			if (isPrimaryColor) {
				color = primaryColor;
			} else {
				color = secondaryColor;
			}
			this.setPixel(color, i);
			j++;
			if (j === this.textureDimension) {
				j = 0;
				k++;
			}
		}
	}
	private generateDataTextureFromBitmap(): THREE.DataTexture {
		const texture = new THREE.DataTexture(this.pixelData, this.textureDimension, this.textureDimension);
		texture.needsUpdate = true;
		texture.minFilter = THREE.LinearFilter;
		return texture;
	}

	private initializeMesh() {
		const geometry = new THREE.PlaneGeometry(this.meshDimension, this.meshDimension);
		this.fillOriginalColorsMap();
		const mat = new THREE.MeshBasicMaterial({
			//color: 0x000000,
			side: THREE.DoubleSide,
			map: this.generateDataTextureFromBitmap(),
		});
		this.boardMaterial = mat;
		const plane = new THREE.Mesh(geometry, mat);
		plane.position.set(0,0,0);
		plane.scale.set(1, 1, 1);
		this.sceneRef.add(plane);
		this.boardMesh = plane;
	}

	private initializeGameObjects() {
		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++) {
				if (!Array.isArray(this.gameObjects[x])) { 
					this.gameObjects[x] = [];
				}
				this.gameObjects[x][y] = null;
			}
		}
		for(let x = 0; x<8; x++) {
			const pawnPlayer1 = new Pawn({
				color: new THREE.Color(this.colors.player1Color2),
				chessboard: this,
				initialBoardPosition: new THREE.Vector2(x, 1),
				scene: this.sceneRef,
				playerOwnership: "player1",
			});
			this.gameObjects[x][1] = pawnPlayer1;

			const pawnPlayer2 = new Pawn({
				color: new THREE.Color(this.colors.player2Color2),
				chessboard: this,
				initialBoardPosition: new THREE.Vector2(x, 6),
				scene: this.sceneRef,
				playerOwnership: "player2",
			});
			this.gameObjects[x][6] = pawnPlayer2;
		}
	}

	public hover(x: number, y: number) {
		const hoverColor = new THREE.Color(colorStringToInt(this.colors.hoverColor));
		const squreDimension = Math.floor(this.textureDimension / 8);
		const color = hoverColor;
		const originalColor = this.boardOriginalColorsMap?.get(`${this.lastHoveredX},${this.lastHoveredY}`);
		if (0 < this.tempBufferIndexes.length && originalColor) {
			for (const i of this.tempBufferIndexes) {
				this.setPixel(originalColor, i);
			}
			this.tempBufferIndexes = [];
		}
		for (let i = 0; i < squreDimension; i++) {
			for (let j = 0; j < squreDimension; j++) {
				const k = ((y * squreDimension * this.textureDimension) + (i * this.textureDimension) + (x * (squreDimension) + j))
				this.setPixel(color, k);
				this.tempBufferIndexes.push(k);
			}
		}
		this.lastHoveredX = x;
		this.lastHoveredY = y;
		if (this.boardMaterial) {
			this.boardMaterial.map = this.generateDataTextureFromBitmap();
		}
	}
	
	public logicalPositionToRealPosition(twoDimensionalPosition: THREE.Vector2): THREE.Vector3 {
		const squareDimension = this.meshDimension / 8;
		const xZero = -0.5 * this.meshDimension;
		const yZero = -0.5 * this.meshDimension;
		const xMargin = squareDimension / 2;
		const yMargin = squareDimension / 2;
		return new THREE.Vector3(
			xMargin+ xZero + (squareDimension * twoDimensionalPosition.x),
			yMargin + yZero + (squareDimension * twoDimensionalPosition.y),
			0,
		)
	}
}