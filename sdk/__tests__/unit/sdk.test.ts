import GameSDK from "../../lib/sdk";
import { CANNOT_MOVE_OTHER_PLAYER, GAMEOBJECT_DOESNT_EXIST, INVALID_MOVE } from "../../lib/errors";
import { Vector2 } from "../../lib/types";

describe("#GameSDK", () => { 
	describe("#errors", () => { 
		it(`will throw '${GAMEOBJECT_DOESNT_EXIST}' when trying to move a piece from an unknown location`, () => { 
			const sdk = GameSDK({});
			sdk.startGame();
			expect(() => sdk.move(new Vector2(55, 55), new Vector2(55, 54))).toThrow(GAMEOBJECT_DOESNT_EXIST);

		});
		it(`will throw '${INVALID_MOVE}' when trying to make an invalid move`, () => { 
			const sdk = GameSDK({});
			sdk.startGame();
			expect(() => sdk.move(new Vector2(5, 7), new Vector2(5, 4))).toThrow(INVALID_MOVE);

		});
		it(`will throw '${CANNOT_MOVE_OTHER_PLAYER}' when trying to move a player's piece on the other player's turn`, () => { 
			const sdk = GameSDK({});
			sdk.startGame();
			expect(() => sdk.move(new Vector2(2, 2), new Vector2(2, 3))).toThrow(CANNOT_MOVE_OTHER_PLAYER);

		});
	}); 
	it("will toggle player when making a move", () => { 
		const sdk = GameSDK({});
		sdk.startGame();
		expect(sdk.currentTurn).toBe("player1");
		sdk.move(new Vector2(5, 7), new Vector2(5, 6));
		expect(sdk.currentTurn).toBe("player2");
		sdk.move(new Vector2(5, 2), new Vector2(5, 4));
		expect(sdk.currentTurn).toBe("player1");
	});
	
});