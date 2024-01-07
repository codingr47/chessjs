import { Vector2 } from "../../lib/types";
import { isPositionInGameBoardBounds } from "../../lib/utils";

describe("#isPositionInGameBoardBounds", () => {
	it("will return true for X=4, Y=5", () => { 
		expect(isPositionInGameBoardBounds(new Vector2(4, 5))).toBe(true);
	});
	it("will return false for X=0, Y=5", () => { 
		expect(isPositionInGameBoardBounds(new Vector2(0, 5))).toBe(false);
	});
	it("will return false for X=4, Y=0", () => { 
		expect(isPositionInGameBoardBounds(new Vector2(4, 0))).toBe(false);
	});
	it("will return false for X=-4, Y=-5", () => { 
		expect(isPositionInGameBoardBounds(new Vector2(-4, -5))).toBe(false);
	});
});