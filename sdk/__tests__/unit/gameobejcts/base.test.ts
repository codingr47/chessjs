import GameBoard from "../../../lib/gameboard";
import { BaseGameObject } from "../../../lib/gameobjects/base";

class MockGameObject extends BaseGameObject {

}

describe("#MockGameObject", () => { 
	it("will throw when not overriding getAvailableMoves", () => {
		const obj  = new MockGameObject(new GameBoard(), "123123", "player1");
		expect(() => obj.getAvailableMoves()).toThrow();
	});
})