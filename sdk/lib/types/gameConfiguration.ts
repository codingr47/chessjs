import { PieceSymbolString, PlayerOwnership, Vector2 } from "./general";


export type GameConfigurationObject = {
	x: number;
	y: number;
	type: PieceSymbolString;
	ownership: PlayerOwnership;
}

export type PlayerMove = {
	from: Vector2;
	to: Vector2;
}[];

const getGameObjectConfiguration = (position: Vector2, ownership: PlayerOwnership, type: PieceSymbolString): GameConfigurationObject => {
	return {
		x: position.X,
		y: position.Y,
		type,
		ownership: ownership,
	};
};

const getRookConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "Rook");
};

const getKnightConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "Knight");
};

const getBishopConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "Bishop");
};

const getKingConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "King");
};
const getPawnConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "Pawn");
};

const getQueenConfigurationObject = (position: Vector2, ownership: PlayerOwnership): GameConfigurationObject => {
	return getGameObjectConfiguration(position, ownership, "Queen");
};


export const defaultGameConfiguration: GameConfigurationObject[] = [
	getRookConfigurationObject(new Vector2(1, 1), "player2"),
	getKnightConfigurationObject(new Vector2(2, 1), "player2"),
	getBishopConfigurationObject(new Vector2(3, 1), "player2"),
	getQueenConfigurationObject(new Vector2(4, 1), "player2"),
	getKingConfigurationObject(new Vector2(5, 1), "player2"),
	getBishopConfigurationObject(new Vector2(6, 1), "player2"),
	getKnightConfigurationObject(new Vector2(7, 1), "player2"),
	getRookConfigurationObject(new Vector2(8, 1), "player2"),
	
	getPawnConfigurationObject(new Vector2(1, 2), "player2"),
	getPawnConfigurationObject(new Vector2(2, 2), "player2"),
	getPawnConfigurationObject(new Vector2(3, 2), "player2"),
	getPawnConfigurationObject(new Vector2(4, 2), "player2"),
	getPawnConfigurationObject(new Vector2(5, 2), "player2"),
	getPawnConfigurationObject(new Vector2(6, 2), "player2"),
	getPawnConfigurationObject(new Vector2(7, 2), "player2"),
	getPawnConfigurationObject(new Vector2(8, 2), "player2"),

	getPawnConfigurationObject(new Vector2(1, 7), "player1"),
	getPawnConfigurationObject(new Vector2(2, 7), "player1"),
	getPawnConfigurationObject(new Vector2(3, 7), "player1"),
	getPawnConfigurationObject(new Vector2(4, 7), "player1"),
	getPawnConfigurationObject(new Vector2(5, 7), "player1"),
	getPawnConfigurationObject(new Vector2(6, 7), "player1"),
	getPawnConfigurationObject(new Vector2(7, 7), "player1"),
	getPawnConfigurationObject(new Vector2(8, 7), "player1"),

	getRookConfigurationObject(new Vector2(1, 8), "player1"),
	getKnightConfigurationObject(new Vector2(2, 8), "player1"),
	getBishopConfigurationObject(new Vector2(3, 8), "player1"),
	getQueenConfigurationObject(new Vector2(4, 8), "player1"),
	getKingConfigurationObject(new Vector2(5, 8), "player1"),
	getBishopConfigurationObject(new Vector2(6, 8), "player1"),
	getKnightConfigurationObject(new Vector2(7, 8), "player1"),
	getRookConfigurationObject(new Vector2(8, 8), "player1"),
];
