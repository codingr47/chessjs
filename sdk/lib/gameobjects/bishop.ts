import { BaseGameObject } from "./base";
import { Vector2 } from "../types";

export class Bishop extends BaseGameObject {
	public getAvailableMoves() {
		return [
			...this.getLinearSteps(1, 1),
			...this.getLinearSteps(1, -1),
			...this.getLinearSteps(-1, 1),
			...this.getLinearSteps(-1, -1)
		];
	}
}