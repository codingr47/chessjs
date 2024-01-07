import { Vector2 } from "../../lib/types";

describe("#Vector2", () => { 
	it("will return the right X and right Y for object", () => { 
		const v = new Vector2(5, 6);
		expect(v.X).toBe(5);
		expect(v.Y).toBe(6);
	});
	it("will mutate object when calling setX", () => { 
		const v = new Vector2(5, 6);
		expect(v.X).toBe(5);
		v.setX(6);
		expect(v.X).toBe(6);
	});
	it("will mutate object when calling setY", () => { 
		const v = new Vector2(5, 6);
		expect(v.Y).toBe(6);
		v.setY(7);
		expect(v.Y).toBe(7);
	});
	it("will not mutate when calling add", () => { 
		const v = new Vector2(5, 5);
		v.add(7, 7);
		expect(v.X).toBe(5);
		expect(v.Y).toBe(5);
	});
	it("will return a new added vector when calling add", () => { 
		const v = new Vector2(5, 5).add(1, 2);
		expect(v.X).toBe(6);
		expect(v.Y).toBe(7);
	});
	it("will return a new cloned different Vector2 when calling clone", () => { 
		const v = new Vector2(4, 4);
		const v2 = v.clone();
		expect(v).not.toBe(v2);
		expect(v.X).toEqual(v2.X);
		v2.setX(1);
		expect(v.X).not.toEqual(v2.X);
	});
	it("will return true when calling equals, on another vector with the same values", () => { 
		expect(new Vector2(1, 5).equals(new Vector2(1, 5))).toBe(true);
	});
	it("will return false when calling equals, on another vector with different values", () => { 
		expect(new Vector2(1, 5).equals(new Vector2(5, 1))).toBe(false);
	});
	it("will return an equal vector2 when calling add without any parameters (default X=0, Y=0)", () => { 
		expect(new Vector2(1, 1).add().equals(new Vector2(1, 1))).toBe(true);
	});
});