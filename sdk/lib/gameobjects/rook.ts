import { BaseGameObject } from "./base";

export default class Rook extends BaseGameObject {
	getAvailableMoves() {		
		return [
			...this.getLinearSteps(1, 0),
			...this.getLinearSteps(-1, 0),
			...this.getLinearSteps(0, 1),
			...this.getLinearSteps(0, -1),
		];
	}
}