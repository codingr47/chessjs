import { BaseGameObject } from "./base";
import { PieceSymbolString, Vector2 } from "../temp";

export class Bishop extends BaseGameObject {
	
	public getPieceSymbol(): PieceSymbolString {
		return "Bishop";
	}

	public getAvailableMoves() {
		return [
			...this.getLinearSteps(1, 1),
			...this.getLinearSteps(1, -1),
			...this.getLinearSteps(-1, 1),
			...this.getLinearSteps(-1, -1)
		];
	}
}