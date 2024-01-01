import { BaseGameObject } from ".";

export default class Queen extends BaseGameObject {
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