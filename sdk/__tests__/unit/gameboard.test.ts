import GameBoard from "../../lib/gameboard";

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
	it("will return 16 moves for all 8 knights of each player, when configuration is default", () => { 
		const gameBoard = new GameBoard();
		gameBoard.startGame();
		expect(gameBoard.getPlayerMoves("player1").length).toBe(16);
		expect(gameBoard.getPlayerMoves("player2").length).toBe(16);
	});
});