import { GameConfigurationObject } from "./gameConfiguration";
import { PieceSymbolString, PlayerOwnership, Vector2 } from "./general";

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
