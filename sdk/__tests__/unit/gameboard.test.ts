import GameBoard from "../../lib/gameboard";
import { Vector2 } from "../../lib/types";

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
});	