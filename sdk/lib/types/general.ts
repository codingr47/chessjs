export type PlayerOwnership = "player1" | "player2";

export type PieceSymbolString = "Pawn" | "Knight" | "Rook" | "Bishop" | "King" | "Queen";

export type GameMemoryState = {
	position: Vector2;
	ownership: PlayerOwnership;
	pieceType: PieceSymbolString;
}[];


export class Vector2 {
	private x: number;
	private y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	get X() {
		return this.x;
	}

	get Y() {
		return this.y;
	}

	public setX(x: number) {
		this.x = x;
	}

	public setY(y: number) {
		this.y = y;
	}

	public add(x = 0, y = 0): Vector2 { 
		return new Vector2(this.X + x, this.Y + y);
	}

	public clone(): Vector2 {
		return this.add(0, 0);
	}
	
	public equals(v: Vector2): boolean {
		return this.X === v.X && this.Y === v.Y;
	}
}