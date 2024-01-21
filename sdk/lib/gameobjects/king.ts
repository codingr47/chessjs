import { BaseGameObject } from "./base";
import { isPositionInGameBoardBounds } from "../utils";

export default class King extends BaseGameObject {
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
		].filter((position) => { 
			if (!isPositionInGameBoardBounds(position)) {
				return false;
			}
			if (this.refGameBoard.hasGameObject(position)) {
				if (this.refGameBoard.getGameObject(position).getPlayerOwnership()  === this.getPlayerOwnership()) {
					return false;
				}
			}
			if (otherPlayerMoves.find((otherPlayerMove) =>  {
				return otherPlayerMove.to.equals(position)
			})) {
				return false;
			}
			return true;
		});
	}
}