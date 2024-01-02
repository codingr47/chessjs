import { PieceSymbolString, PlayerOwnership, Vector2 } from "../types";
import GameBoard from "../gameboard";
import Pawn from "./pawn";
import Rook from "./rook";
import { isPositionInGameBoardBounds } from "../utils";
import { Bishop } from "./bishop";
import Knight from "./knight";
import Queen from "./queen";
import King from "./king";

export interface IEGameObject {
	getPosition(): Vector2;
	getAvailableMoves(): Vector2[];
	getPlayerOwnership(): PlayerOwnership;
	getId(): string;
	getPieceSymbol(): PieceSymbolString;
}
export abstract class BaseGameObject implements IEGameObject {

	protected refGameBoard: GameBoard;
	private id: string;
	static pieceSymbol: PieceSymbolString = "Pawn";

	private owner: PlayerOwnership;

	constructor(gameBoard: GameBoard, id: string, owner: PlayerOwnership) {
		this.id = id;
		this.owner = owner;
		this.refGameBoard = gameBoard;
	}

	public getPosition(): Vector2 {
		return this.refGameBoard.getGameObjectPosition(this.id);
	}
	public getAvailableMoves(): Vector2[] { 
		throw new Error("Not Implemented"); 
	};
	public getPlayerOwnership(): PlayerOwnership {
		return this.owner;
	};
	public getId() {
		return this.id;
	}
	public getPieceSymbol() {
		return BaseGameObject.pieceSymbol;
	}

	public getLinearSteps(incX: 1 | -1 | 0, incY: 1 | -1 | 0): Vector2[] {
		const availableMoves: Vector2[] = [];
		let currentPosition = this.getPosition();
		let continueLoop = true;
		do {
			currentPosition = currentPosition.add(incX, incY);
			if (this.refGameBoard.hasGameObject(currentPosition)) {
				continueLoop = false;
				if (this.refGameBoard.getGameObject(currentPosition).getPlayerOwnership() != this.getPlayerOwnership()) {
					availableMoves.push(currentPosition.clone());
				}
			} else {
				availableMoves.push(currentPosition.clone());
			}
		} while (isPositionInGameBoardBounds(currentPosition) && continueLoop)
		return availableMoves;
	}
}

export const gameObjectsMap = {
	Rook,
	Bishop, 
	King,
	Knight,
	Pawn,
	Queen,
}