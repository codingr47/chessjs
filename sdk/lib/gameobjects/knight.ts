import { BaseGameObject } from "./base";
import { isPositionInGameBoardBounds } from "../utils";
import { PieceSymbolString } from "../types";

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
		].filter((position) => { 
			if (!isPositionInGameBoardBounds(position)) {
				return false;
			}
			if (this.refGameBoard.hasGameObject(position)) {
				if (this.refGameBoard.getGameObject(position).getPlayerOwnership() == this.getPlayerOwnership()) {
					return false;
				}
			}
			return true;
		});
	}
}