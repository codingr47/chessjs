import { CANNOT_MOVE_OTHER_PLAYER, GAMEOBJECT_DOESNT_EXIST } from "./errors";
import GameBoard from "./gameboard";
import { GameConfigurationObject, PlayerOwnership, Vector2, GameEventNames, GameEventNamesArgsMap } from "./types"

export interface GameSDKHandler {
	move(from: Vector2, to: Vector2): void;
	subscribe<T extends GameEventNames>(eventName:T, cb: (data: GameEventNamesArgsMap[T]) => void): void;
	currentTurn: PlayerOwnership; 
	startGame: () => void;

}

export interface SDKProps {
	gameConfiguration?: GameConfigurationObject[];
}

export default function GameSDK(props: SDKProps): GameSDKHandler {
	let currentPlayer: PlayerOwnership = "player1";  
	const gameBoard = new GameBoard(props.gameConfiguration);
	const togglePlayer = () => { 
		if ( "player1" === currentPlayer) {
			currentPlayer = "player2";
		} else {
			currentPlayer = "player1";
		}
	};
	return {
		get currentTurn() { 
			return currentPlayer;
		},
		move(from: Vector2, to: Vector2): void {
			if (!gameBoard.hasGameObject(from)) {
				throw new Error(GAMEOBJECT_DOESNT_EXIST);
			}
			const gameObject = gameBoard.getGameObject(from);
			if (gameObject.getPlayerOwnership() !== currentPlayer) {
				throw new Error(CANNOT_MOVE_OTHER_PLAYER)
			}
			gameBoard.move(from, to);
			togglePlayer();
		},
		subscribe<T extends GameEventNames>(eventName:T, cb: (data: GameEventNamesArgsMap[T]) => void) {
			gameBoard.on(eventName, cb);
		},
		startGame() {
			gameBoard.startGame();
		}
	};
}