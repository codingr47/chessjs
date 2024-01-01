import { GameMemoryState, IEGameObject } from "../types";


export default class LogicalChessBoard {
	private gameObjects: (IEGameObject | null)[][] = [];

	constuctor() {
		this.initializeEmptyBoard();
	}

	private initializeEmptyBoard(): void {
		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++) {
				if (!Array.isArray(this.gameObjects[x])) { 
					this.gameObjects[x] = [];
				}
				this.gameObjects[x][y] = null;
			}
		}
	}

	private initializePieces(): void {

	}

	private initializePiecesFromMemory(state: GameMemoryState): void {
		state.forEach(({ position: { X, Y }, ownership, pieceType }) => { 
			this.setPiece({ x: X, y: Y, ownership, pieceSymbol: pieceSymbolStringToClassConstructor(pieceType) })
		});
	} 

	private intitializePieces(state: GameMemoryState | undefined) {
		if (state) {
			this.initializePiecesFromMemory(state);
		} else {
			this.initializePieces();
		}
	}
}