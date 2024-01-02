import { PlayerOwnership, Vec2 as Vector2D } from "./types"

export interface GameSDKHandler {
	move(from: Vector2D, to: Vector2D): void;
	currentTurn: PlayerOwnership; 

}

export default function GameSDK(): GameSDKHandler {
	let currentPlayer: PlayerOwnership = "player1";  
	return {
		get currentTurn() { 
			return currentPlayer;
		},
		move(from: Vector2D, to: Vector2D): void {
			return;
		}
	}
}