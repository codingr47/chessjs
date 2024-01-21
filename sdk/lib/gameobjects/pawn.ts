import { BaseGameObject } from "./base";
import { Vector2 } from "../types";
import { isPositionInGameBoardBounds } from "../utils";

export default class Pawn extends BaseGameObject {


	private getDirection(): number {
		return "player1" === this.getPlayerOwnership() ? -1 : 1;
	}

	private didPawnMoveOnce(): boolean {
		if ("player1" === this.getPlayerOwnership()) {
			return this.getPosition().Y !== 7;
		} else {
			return this.getPosition().Y !== 2;
		}
	}
	getAvailableMoves() {
		const availableMoves: Vector2[] = [];
		const direction = this.getDirection();
		const position = this.getPosition();
		const forwardsOne  = new Vector2(position.X, position.Y + direction);
		const forwardsTwo  = new Vector2(position.X, position.Y + direction + direction);
		if (isPositionInGameBoardBounds(forwardsOne) && !this.refGameBoard.hasGameObject(forwardsOne)) {
			availableMoves.push(forwardsOne);
		}
		if (isPositionInGameBoardBounds(forwardsTwo) 
			&& !this.refGameBoard.hasGameObject(forwardsTwo) 
			&& !this.didPawnMoveOnce()
		) {
			availableMoves.push(forwardsTwo);
		} 
		const diagonalOne = new Vector2(position.X + 1, position.Y + direction)
		const diagonalTwo = new Vector2(position.X - 1, position.Y + direction);
		if (isPositionInGameBoardBounds(diagonalOne) 
			&& this.refGameBoard.hasGameObject(diagonalOne) 
			&& this.refGameBoard.getGameObject(diagonalOne).getPlayerOwnership() !== this.getPlayerOwnership()
		) {
			availableMoves.push(diagonalOne);
		}
		if (isPositionInGameBoardBounds(diagonalTwo)
			&& this.refGameBoard.hasGameObject(diagonalTwo) 
			&& this.refGameBoard.getGameObject(diagonalTwo).getPlayerOwnership() !== this.getPlayerOwnership()
		) {
			availableMoves.push(diagonalTwo);
		}
		return availableMoves;
	}

}