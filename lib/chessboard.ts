import * as THREE from "three";
import { Easing, Tween } from "@tweenjs/tween.js";
import { v4 as uuidGenerate } from "uuid";
import Pawn from "./gameobjects/pawn";
import { IEGameObject, PlayerOwnership } from "./types";
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


export type EventCallbackType = "move";

export type EventArguments = {
	type: EventCallbackType;
	ownership: PlayerOwnership;
	err?: string;
	
}
export type EventCallbackFunctor = { uuid: string; cb: (e: EventArguments) => void };

export type EventCallbacksStore = {
	[k in EventCallbackType]?: EventCallbackFunctor[];
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

	private temporaryHoverIndexes: number[];

	private temporarySelectedIndexes:[number, number, number[]][];

	private lastHoveredX: number = 0;

	private lastHoveredY: number = 0;

	private gameObjects: (IEGameObject | null)[][];

	private callbacks: EventCallbacksStore  = {};


	constructor(scene: THREE.Scene, { meshDimension, textureDimension, colors }: ChessboardOptions) {
		this.pixelData = new Uint8Array();
		this.temporaryHoverIndexes = [];
		this.temporarySelectedIndexes = [];
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

	private getTextureSquareIndexes(x: number, y: number) {
		const squreDimension = Math.floor(this.textureDimension / 8);
		const indexes: number[] = [];
		for (let i = 0; i < squreDimension; i++) {
			for (let j = 0; j < squreDimension; j++) {
				const k = ((y * squreDimension * this.textureDimension) + (i * this.textureDimension) + (x * (squreDimension) + j))
				indexes.push(k);
			}
		}
		return indexes;
	}

	public select(squares: THREE.Vector2[]) {
		const color = new THREE.Color(0, 0 , 180);
		squares.forEach(({ x, y }) => { 
			this.temporarySelectedIndexes.push([x, y, []]);
			this.getTextureSquareIndexes(x, y).forEach((k) => { 
				this.setPixel(color, k);
				this.temporarySelectedIndexes[this.temporarySelectedIndexes.length - 1][2].push(k);
			});
		});
	}
	public hover(x: number, y: number) {
		const hoverColor = new THREE.Color(colorStringToInt(this.colors.hoverColor));
		const squreDimension = Math.floor(this.textureDimension / 8);
		const color = hoverColor;
		if (this.lastHoveredX !== x || this.lastHoveredY !== y) {
			this.resetHover();
			this.getTextureSquareIndexes(x, y).forEach((k) => { 
				this.setPixel(color, k);
				this.temporaryHoverIndexes.push(k);
			});
			this.lastHoveredX = x;
			this.lastHoveredY = y;
			if (this.boardMaterial) {
				this.boardMaterial.map = this.generateDataTextureFromBitmap();
			}
		}
	}

	public resetHover() {
		const originalColor = this.boardOriginalColorsMap?.get(`${this.lastHoveredX},${this.lastHoveredY}`);
		if (0 < this.temporaryHoverIndexes.length && originalColor) {
			for (const i of this.temporaryHoverIndexes) {
				this.setPixel(originalColor, i);
			}
			this.temporaryHoverIndexes = [];
			if (this.boardMaterial) {
				this.boardMaterial.map = this.generateDataTextureFromBitmap();
			}
			this.lastHoveredX = -1;
			this.lastHoveredY = -1;
		}
	}

	public resetSelected() {
		this.temporarySelectedIndexes.forEach(([x, y, indexes]) => { 
			const originalColor = this.boardOriginalColorsMap?.get(`${x},${y}`);
			if (0 < indexes.length && originalColor) {
				for (const i of indexes) {
					this.setPixel(originalColor, i);
				}
			}
			if (this.boardMaterial) { 
				this.boardMaterial.map = this.generateDataTextureFromBitmap();
			}
			this.temporarySelectedIndexes = [];
		});
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

	public getBoardDimension() : number {
		return this.meshDimension;
	}

	public getGameObject(position: THREE.Vector2): IEGameObject | null {
		return this.gameObjects[position.x][position.y];
	}

	public moveObject(fromSquare: THREE.Vector2, toSquare: THREE.Vector2) {
		const gameObjectFrom = this.getGameObject(fromSquare);
		if (!gameObjectFrom) throw new Error("Cannot move from an empty square");
		const gameObjectTo = this.getGameObject(toSquare);
		if (gameObjectTo && gameObjectFrom.getPlayerOwnership() === gameObjectTo.getPlayerOwnership()) throw new Error("Invalid movement");
		gameObjectFrom.moveTo(toSquare, true);
		this.gameObjects[fromSquare.x][fromSquare.y] = null;
		this.gameObjects[toSquare.x][toSquare.y] = gameObjectFrom;
		if (gameObjectTo) {
			gameObjectTo.destroy();
		}
		this.callbacks["move"]?.forEach(({ cb }) => { 
			cb({
				ownership: gameObjectFrom.getPlayerOwnership(),
				type: "move",
			});
		})
		
	}

	public on(type: EventCallbackType, cb: EventCallbackFunctor["cb"]) {
		if (!this.callbacks[type]) {
			this.callbacks[type] = [];
		}
		const uuid = uuidGenerate(); 
		this.callbacks[type]?.push({
			uuid,
			cb,
		});	
		return uuid;
	}
	public off(type: EventCallbackType, uuidToRemove: string) {
		if (this.callbacks[type]) {
			this.callbacks[type] = this.callbacks[type]?.filter(({ uuid }) => uuid  !== uuidToRemove);
		}
	}

}