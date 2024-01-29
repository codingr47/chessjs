import { PieceSymbolString } from "../temp";
import { BaseGameObject } from "./base";

export default class Rook extends BaseGameObject {

	public getPieceSymbol(): PieceSymbolString {
		return "Rook";
	}
	getAvailableMoves() {		
		return [
			...this.getLinearSteps(1, 0),
			...this.getLinearSteps(-1, 0),
			...this.getLinearSteps(0, 1),
			...this.getLinearSteps(0, -1),
		];
	}
}