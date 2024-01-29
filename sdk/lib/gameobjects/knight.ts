import { BaseGameObject } from "./base";
import { isPositionInGameBoardBounds } from "../utils";
import { PieceSymbolString } from "../temp";

export default class Knight extends BaseGameObject {
	
	public getPieceSymbol(): PieceSymbolString {
		return "Knight";
	}

	getAvailableMoves() {		
		const currentPosition = this.getPosition();
		return [
			currentPosition.add(1 , 2),
			currentPosition.add(2 , 1),
			currentPosition.add(-1 , -2),
			currentPosition.add(-2 , -1),
			currentPosition.add(1 , -2),
			currentPosition.add(2 , -1),
			currentPosition.add(-1 , 2),
			currentPosition.add(-2 , 1),
		].filter((potentialDestination) => { 
			if (!isPositionInGameBoardBounds(potentialDestination)) {
				return false;
			}
			if (this.refGameBoard.hasGameObject(potentialDestination)) {
				if (this.refGameBoard.getGameObject(potentialDestination).getPlayerOwnership() == this.getPlayerOwnership()) {
					return false;
				}
			}
			return true;
		})
		.map((destPosition) => { 
			return [{ from: currentPosition, to: destPosition }]
		})
	}
}