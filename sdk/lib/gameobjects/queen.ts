import { PieceSymbolString } from "../types";
import { BaseGameObject } from "./base";

export default class Queen extends BaseGameObject {

	public getPieceSymbol(): PieceSymbolString {
		return "Queen";
	}

	getAvailableMoves() {		
		return [
			...this.getLinearSteps(1, 0),
			...this.getLinearSteps(-1, 0),
			...this.getLinearSteps(0, 1),
			...this.getLinearSteps(0, -1),
			...this.getLinearSteps(1, 1),
			...this.getLinearSteps(1, -1),
			...this.getLinearSteps(-1, 1),
			...this.getLinearSteps(-1, -1)
		];

	}
}