import GameBoard from "../gameboard";
import { PieceSymbolString, PlayerMove, PlayerOwnership, Vector2 } from "../types";
import { isPositionInGameBoardBounds } from "../utils";

export interface IEGameObject {
	getPosition(): Vector2;
	getAvailableMoves(): PlayerMove[];
	getPlayerOwnership(): PlayerOwnership;
	getId(): string;
	getPieceSymbol(): PieceSymbolString;
}
export abstract class BaseGameObject implements IEGameObject {

	protected refGameBoard: GameBoard;
	private id: string;

	private owner: PlayerOwnership;

	constructor(gameBoard: GameBoard, id: string, owner: PlayerOwnership) {
		this.id = id;
		this.owner = owner;
		this.refGameBoard = gameBoard;
	}

	public getPosition(): Vector2 {
		return this.refGameBoard.getGameObjectPosition(this.id);
	}
	public getAvailableMoves(): PlayerMove[] { 
		throw new Error("Not Implemented"); 
	};
	public getPlayerOwnership(): PlayerOwnership {
		return this.owner;
	};
	public getId() {
		return this.id;
	}

	public getPieceSymbol(): PieceSymbolString {
		return "Pawn";
	}

	public getLinearSteps(incX: 1 | -1 | 0, incY: 1 | -1 | 0): PlayerMove[] {
		const availableMoves: PlayerMove[] = [];
		let currentPosition = this.getPosition();
		currentPosition = currentPosition.add(incX, incY);
		let continueLoop = isPositionInGameBoardBounds(currentPosition);
		while (isPositionInGameBoardBounds(currentPosition) && continueLoop) {
			if (this.refGameBoard.hasGameObject(currentPosition)) {
				continueLoop = false;
				if (this.refGameBoard.getGameObject(currentPosition).getPlayerOwnership() != this.getPlayerOwnership()) {
					availableMoves.push([{ from: this.getPosition(), to: currentPosition.clone()}]);
				}
			} else {
				availableMoves.push([{ from: this.getPosition(), to: currentPosition.clone()}]);
			}
			currentPosition = currentPosition.add(incX, incY);
		}	
		return availableMoves;
	}
}
