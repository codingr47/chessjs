import { BaseGameObject } from "./base";
import { isPositionInGameBoardBounds } from "../utils";
import { PieceSymbolString, Vector2 } from "../temp";

export default class King extends BaseGameObject {
	
	public getPieceSymbol(): PieceSymbolString {
		return "King";
	}

	getAvailableMoves() {		
		const currentPosition = this.getPosition();
		const otherPlayerMoves = this.refGameBoard.getPlayerMoves("player1" === this.getPlayerOwnership() ? "player2" : "player1", ["King"]);
		const moves = [
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
		const yCastling = "player1" === this.getPlayerOwnership() ? 8 : 1;
		if ( this.getPosition().equals(new Vector2(5, yCastling))  
		  && !this.refGameBoard.hasGameObject(new Vector2(6, yCastling))
		  && !this.refGameBoard.hasGameObject(new Vector2(7, yCastling))
		  && this.refGameBoard.hasGameObject(new Vector2(8, yCastling))
	  	) {
			const pieceForCastling = this.refGameBoard.getGameObject(new Vector2(8, yCastling));
			if ("Rook" === pieceForCastling.getPieceSymbol() && pieceForCastling.getPlayerOwnership() === this.getPlayerOwnership()) {
				moves.push([{ from: this.getPosition(), to: this.getPosition().add(2) }, { from: this.getPosition().add(3, 0), to: this.getPosition().add(1, 0)}]);
			}
		}
		return moves;
	}
}