import { GAMEOBJECT_DOESNT_EXIST, INVALID_MOVE } from "../../lib/errors";
import GameBoard from "../../lib/gameboard";
import { Vector2, defaultGameConfiguration } from "../../lib/types";

describe("#GameBoard class", () => { 
	it("will store 0 gameObjects on initiation", () => { 
		const gameBoard = new GameBoard();
		expect(Array.from((gameBoard as any).mapGameObjects).length).toBe(0);
	});
	it("will store 32 gameObjects on gameStart, when configuration is default", () => { 
		const gameBoard = new GameBoard();
		gameBoard.startGame();
		expect(Array.from((gameBoard as any).mapGameObjects).length).toBe(32);
	});
	it("will return 20 moves for all 8 pieces of each player, when configuration is default", () => { 
		const gameBoard = new GameBoard();
		gameBoard.startGame();
		expect(gameBoard.getPlayerMoves("player1").length).toBe(20);
		expect(gameBoard.getPlayerMoves("player2").length).toBe(20);
	});
	it("will return 29, when configuration is default and 5th pawn of player 1 form the left moves 2 steps forwards and player2 copied him", () => { 
		const gameBoard = new GameBoard();
		gameBoard.startGame();
		gameBoard.move(new Vector2(5, 7), new Vector2(5, 5));
		gameBoard.move(new Vector2(5, 2), new Vector2(5, 4));
		expect(gameBoard.getPlayerMoves("player1").length).toBe(29);
		expect(gameBoard.getPlayerMoves("player2").length).toBe(29);
	});
	it("will return 27, when configuration is default and 4th pawn of player 1 form the left moves 2 steps forwards and player2 copied him", () => { 
		const gameBoard = new GameBoard();
		gameBoard.startGame();
		gameBoard.move(new Vector2(4, 7), new Vector2(4, 5));
		gameBoard.move(new Vector2(4, 2), new Vector2(4, 4));
		expect(gameBoard.getPlayerMoves("player1").length).toBe(27);
		expect(gameBoard.getPlayerMoves("player2").length).toBe(27);
	});
	it("will return 21, when configuration is default and 3th pawn of player 1 form the left moves 2 steps forwards and player2 copied him", () => { 
		const gameBoard = new GameBoard();
		gameBoard.startGame();
		gameBoard.move(new Vector2(3, 7), new Vector2(3, 5));
		gameBoard.move(new Vector2(3, 2), new Vector2(3, 4));
		expect(gameBoard.getPlayerMoves("player1").length).toBe(21);
		expect(gameBoard.getPlayerMoves("player2").length).toBe(21);
	});
	it("will return 20, when configuration is default and 3th pawn of player 1 from the left moves 2 steps forwards and player2 copied him", () => { 
		const gameBoard = new GameBoard();
		gameBoard.startGame();
		gameBoard.move(new Vector2(2, 7), new Vector2(2, 5));
		gameBoard.move(new Vector2(2, 2), new Vector2(2, 4));
		expect(gameBoard.getPlayerMoves("player1").length).toBe(20);
		expect(gameBoard.getPlayerMoves("player2").length).toBe(20);
	});
	it("will return 20, when configuration is default and 2nd pawn of player 1 from the left moves 2 steps forwards and player2 copied him", () => { 
		const gameBoard = new GameBoard();
		gameBoard.startGame();
		gameBoard.move(new Vector2(2, 7), new Vector2(2, 5));
		gameBoard.move(new Vector2(2, 2), new Vector2(2, 4));
		expect(gameBoard.getPlayerMoves("player1").length).toBe(20);
		expect(gameBoard.getPlayerMoves("player2").length).toBe(20);
	});

	it("will return 20, when configuration is default and 1st pawn of player 1 from the left moves 2 steps forwards and player2 copied him", () => { 
		const gameBoard = new GameBoard();
		gameBoard.startGame();
		gameBoard.move(new Vector2(1, 7), new Vector2(1, 5));
		gameBoard.move(new Vector2(1, 2), new Vector2(1, 4));
		expect(gameBoard.getPlayerMoves("player1").length).toBe(20);
		expect(gameBoard.getPlayerMoves("player2").length).toBe(20);
	});

	it("will return castling move for both players when there is space (knight and bishop missing)", ()=> { 
		const gameBoard = new GameBoard(defaultGameConfiguration.filter(({
			type
		}) => { 
			return !["Bishop", "Knight"].includes(type);
		}));
		gameBoard.startGame();
		expect(gameBoard.getPlayerMoves("player1").find((moves) => {
			return moves.length === 2 &&
			moves[0].from.equals(new Vector2(5, 8)) &&
			moves[0].to.equals(new Vector2(7, 8)) &&
			moves[1].from.equals(new Vector2(8, 8)) &&
			moves[1].to.equals(new Vector2(6, 8)) 
		})).not.toBe(undefined);
		expect(gameBoard.getPlayerMoves("player2").find((moves) => {
			return moves.length === 2 &&
			moves[0].from.equals(new Vector2(5, 1)) &&
			moves[0].to.equals(new Vector2(7, 1)) &&
			moves[1].from.equals(new Vector2(8, 1)) &&
			moves[1].to.equals(new Vector2(6, 1)) 
		})).not.toBe(undefined);
	});
	describe("#errors", () => {
		it(`will throw an '${GAMEOBJECT_DOESNT_EXIST}' when looking for an unidentified gameobject`, () => { 
			const gameBoard = new GameBoard();
			expect(() => gameBoard.getGameObject("unknown-id")).toThrowError(GAMEOBJECT_DOESNT_EXIST);
		});
		it(`will throw an ${INVALID_MOVE} when attempting to move a pawn 3 steps forwards instead of 3`, () => { 
			const gameBoard = new GameBoard();
			gameBoard.startGame();
			expect(() => gameBoard.move(new Vector2(1, 7), new Vector2(1, 4))).toThrowError(INVALID_MOVE);
		});
	});
	describe("#notifications", () => { 
		it ("will notify when game has started", () => { 
			const gameBoard = new GameBoard();
			const spyGameStarted = jest.fn();
			gameBoard.on("GameStarted", spyGameStarted);
			expect(spyGameStarted).toHaveBeenCalledTimes(0);
			gameBoard.startGame();
			expect(spyGameStarted).toHaveBeenCalledTimes(1);
		});
		it ("will notify when is moved", () => { 
			const gameBoard = new GameBoard();
			const spyMoved = jest.fn();
			gameBoard.on("PieceMoved", spyMoved);
			gameBoard.startGame();
			gameBoard.move(new Vector2(5,7), new Vector2(5, 5));
			expect(spyMoved).toHaveBeenCalledTimes(1);
			expect(spyMoved).toHaveBeenCalledWith(expect.objectContaining({
				ownership: "player1",
				from: new Vector2(5, 7),
				to: new Vector2(5, 5),
				symbolType: "Pawn",
			}));
		});
		it("will notify when a pawn is eaten, and destroy the pawn on the game board", () => { 
			const gameBoard = new GameBoard();
			const spyDestroyed = jest.fn();
			gameBoard.on("PieceDestroyed", spyDestroyed);
			gameBoard.startGame();
			gameBoard.move(new Vector2(5, 7), new Vector2(5, 5));
			gameBoard.move(new Vector2(6 , 2), new Vector2(6, 4));
			expect(gameBoard.hasGameObject(new Vector2(6, 4))).toBe(true);
			expect(gameBoard.getGameObject(new Vector2(6, 4)).getPlayerOwnership()).toBe("player2");
			gameBoard.move(new Vector2(5, 5), new Vector2(6,4));
			expect(gameBoard.hasGameObject(new Vector2(6, 4))).toBe(true);
			expect(gameBoard.getGameObject(new Vector2(6, 4)).getPlayerOwnership()).toBe("player1");
			expect(spyDestroyed).toHaveBeenCalledTimes(1);
			expect(spyDestroyed).toHaveBeenLastCalledWith(expect.objectContaining({
				ownership: "player2",
				position: new Vector2(6, 4),
				symbolType: "Pawn",
			}));
		});
	});
});	