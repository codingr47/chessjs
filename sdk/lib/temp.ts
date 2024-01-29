
// export interface IEGameObject {
// 	moveTo(destination: THREE.Vector2, tween?: boolean): void;
// 	getAbsolutePosition(): THREE.Vector3;
// 	getMesh(): THREE.Mesh;
// 	gerAvailableMoves(): THREE.Vector2[];
// 	getPlayerOwnership(): PlayerOwnership;
// 	destroy(): Promise<void>;
// }

// export interface IEGameController {
// 	waitForPlayerMove(): Promise<void>;
// }

// export interface IEGameMode {
// 	main(): Promise<void>;
// 	run(): Promise<void>;
// }

export type GameMemoryState = {
	position: Vector2;
	ownership: PlayerOwnership;
	pieceType: PieceSymbolString;
}[];


export class Vector2 {
	private x: number;
	private y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	get X() {
		return this.x;
	}

	get Y() {
		return this.y;
	}

	public setX(x: number) {
		this.x = x;
	}

	public setY(y: number) {
		this.y = y;
	}

	public add(x = 0, y = 0): Vector2 { 
		return new Vector2(this.X + x, this.Y + y);
	}

	public clone(): Vector2 {
		return this.add(0, 0);
	}
	
	public equals(v: Vector2): boolean {
		return this.X === v.X && this.Y === v.Y;
	}
}

export type GameConfigurationObject = {
	x: number;
	y: number;
	type: PieceSymbolString;
	ownership: PlayerOwnership;
}

export type PlayerMove = {
	from: Vector2;
	to: Vector2;
}[];

const getGameObjectConfiguration = (position: Vector2, ownership: PlayerOwnership, type: PieceSymbolString): GameConfigurationObject => {
	return {
		x: position.X,
		y: position.Y,
		type,
		ownership: ownership,
	};
};

const getRookConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "Rook");
};

const getKnightConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "Knight");
};

const getBishopConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "Bishop");
};

const getKingConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "King");
};
const getPawnConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "Pawn");
};

const getQueenConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "Queen");
};


export const defaultGameConfiguration: GameConfigurationObject[] = [
	getRookConfigurationObject(new Vector2(1, 1), "player2"),
	getKnightConfigurationObject(new Vector2(2, 1), "player2"),
	getBishopConfigurationObject(new Vector2(3, 1), "player2"),
	getQueenConfigurationObject(new Vector2(4, 1), "player2"),
	getKingConfigurationObject(new Vector2(5, 1), "player2"),
	getBishopConfigurationObject(new Vector2(6, 1), "player2"),
	getKnightConfigurationObject(new Vector2(7, 1), "player2"),
	getRookConfigurationObject(new Vector2(8, 1), "player2"),
	
	getPawnConfigurationObject(new Vector2(1, 2), "player2"),
	getPawnConfigurationObject(new Vector2(2, 2), "player2"),
	getPawnConfigurationObject(new Vector2(3, 2), "player2"),
	getPawnConfigurationObject(new Vector2(4, 2), "player2"),
	getPawnConfigurationObject(new Vector2(5, 2), "player2"),
	getPawnConfigurationObject(new Vector2(6, 2), "player2"),
	getPawnConfigurationObject(new Vector2(7, 2), "player2"),
	getPawnConfigurationObject(new Vector2(8, 2), "player2"),

	getPawnConfigurationObject(new Vector2(1, 7), "player1"),
	getPawnConfigurationObject(new Vector2(2, 7), "player1"),
	getPawnConfigurationObject(new Vector2(3, 7), "player1"),
	getPawnConfigurationObject(new Vector2(4, 7), "player1"),
	getPawnConfigurationObject(new Vector2(5, 7), "player1"),
	getPawnConfigurationObject(new Vector2(6, 7), "player1"),
	getPawnConfigurationObject(new Vector2(7, 7), "player1"),
	getPawnConfigurationObject(new Vector2(8, 7), "player1"),

	getRookConfigurationObject(new Vector2(1, 8), "player1"),
	getKnightConfigurationObject(new Vector2(2, 8), "player1"),
	getBishopConfigurationObject(new Vector2(3, 8), "player1"),
	getQueenConfigurationObject(new Vector2(4, 8), "player1"),
	getKingConfigurationObject(new Vector2(5, 8), "player1"),
	getBishopConfigurationObject(new Vector2(6, 8), "player1"),
	getKnightConfigurationObject(new Vector2(7, 8), "player1"),
	getRookConfigurationObject(new Vector2(8, 8), "player1"),
];

export type GameEventNames = "GameStarted" | "PieceDestroyed" | "Spawn" | "PieceMoved";


export interface BaseEventArgs  {
	time: string;
}

export interface GameStartedArgs extends BaseEventArgs {
	configuration: GameConfigurationObject[];
}

export interface PieceDestroyedArgs extends BaseEventArgs {
	position: Vector2;
	ownership: PlayerOwnership;
	symbolType: PieceSymbolString;
}

export interface SpawnArgs extends PieceDestroyedArgs {

}

export interface PieceMovedArgs extends BaseEventArgs {
	from: Vector2;
	to: Vector2;
	symbolType: PieceSymbolString;
	ownership: PlayerOwnership;
}

export type GameEventNamesArgsMap =  {
	GameStarted: GameStartedArgs;
	PieceMoved: PieceMovedArgs;
	PieceDestroyed: PieceDestroyedArgs;
	Spawn: SpawnArgs;
}
