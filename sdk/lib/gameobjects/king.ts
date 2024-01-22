import { BaseGameObject } from "./base";
import { isPositionInGameBoardBounds } from "../utils";
import { PieceSymbolString } from "../types";

export default class King extends BaseGameObject {
	
	public getPieceSymbol(): PieceSymbolString {
		return "King";
	}

	getAvailableMoves() {		
		const currentPosition = this.getPosition();
		const otherPlayerMoves = this.refGameBoard.getPlayerMoves("player1" === this.getPlayerOwnership() ? "player2" : "player1", ["King"]);
		return [
			currentPosition.add(0, 1),
			currentPosition.add(1, 1),
			currentPosition.add(1, 0),
			currentPosition.add(1, -1),
			currentPosition.add(0, -1),
			currentPosition.add(-1, -1),
			currentPosition.add(-1,  0),
			currentPosition.add(-1,  1),
		].filter((potentialDestination) => { 
			if (!isPositionInGameBoardBounds(potentialDestination)) {
				return false;
			}
			if (this.refGameBoard.hasGameObject(potentialDestination)) {
				if (this.refGameBoard.getGameObject(potentialDestination).getPlayerOwnership()  === this.getPlayerOwnership()) {
					return false;
				}
			}
			if (otherPlayerMoves.find((otherPlayerMove) =>  {
				return otherPlayerMove.find(({ to }) => { return to.equals(potentialDestination); });
			})) {
				return false;
			}
			return true;
		}).map((destPosition) => { 
			return [{ from: currentPosition, to: destPosition }];
		});
	}
}