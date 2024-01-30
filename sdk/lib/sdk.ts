import { CANNOT_MOVE_OTHER_PLAYER, CANNOT_MOVE_WHEN_GAME_OVER, GAMEOBJECT_DOESNT_EXIST } from "./errors";
import GameBoard from "./gameboard";
import { getBaseEventObject } from "./utils";
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
	let gameOver = false;
	const gameBoard = new GameBoard(props.gameConfiguration);
	const togglePlayer = () => { 
		if ( "player1" === currentPlayer) {
			currentPlayer = "player2";
		} else {
			currentPlayer = "player1";
		}
	};
	const checkForCheck = () => {
		const currentPlayerKingPosition = gameBoard.getGameObjectsByPieceSymbol("King", currentPlayer)[0].getPosition();
		const threateningPlayer: PlayerOwnership = "player1" === currentPlayer ? "player2" : "player1"
		const otherPlayerMoves = gameBoard.getPlayerMoves(threateningPlayer, ["King"]);
		const threateningPositions:Vector2[] = [];
		otherPlayerMoves.forEach((moves) => {
			const threateningMove = moves.find(({ to }) => { 
				return to.equals(currentPlayerKingPosition);
			});
			if (threateningMove) {
				threateningPositions.push(threateningMove.from);
			}
		});
		if ( 0 < threateningPositions.length) {
			gameBoard.notify("Check", {
				...getBaseEventObject(),
				threatenedPlayer: currentPlayer,
				threatFrom: threateningPositions,
			});
		}
	}

	const checkForChackMate = () => {
		const kingMoves = gameBoard.getGameObjectsByPieceSymbol("King", currentPlayer)[0].getAvailableMoves();
		if (0 === kingMoves.length) {
			gameOver = true;
			gameBoard.notify("CheckMate", {
				...getBaseEventObject(),
				beatenPlayer: currentPlayer,
			})
		}
		
	}
	return {
		get currentTurn() { 
			return currentPlayer;
		},
		move(from: Vector2, to: Vector2): void {
			if (gameOver) {
				throw new Error(CANNOT_MOVE_WHEN_GAME_OVER);
			}
			if (!gameBoard.hasGameObject(from)) {
				throw new Error(GAMEOBJECT_DOESNT_EXIST);
			}
			const gameObject = gameBoard.getGameObject(from);
			if (gameObject.getPlayerOwnership() !== currentPlayer) {
				throw new Error(CANNOT_MOVE_OTHER_PLAYER)
			}
			gameBoard.move(from, to);
			togglePlayer();
			checkForChackMate();
			checkForCheck();
		},
		subscribe<T extends GameEventNames>(eventName:T, cb: (data: GameEventNamesArgsMap[T]) => void) {
			gameBoard.on(eventName, cb);
		},
		startGame() {
			gameBoard.startGame();
			checkForChackMate();
			checkForCheck();
		},
		
	};
}