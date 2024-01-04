import { v4 as uuid } from "uuid";
import { BaseEventArgs, GameConfigurationObject, GameEventNames, GameEventNamesArgsMap, PieceSymbolString, PlayerOwnership, Vector2, defaultGameConfiguration } from "./types";
import { IEGameObject, gameObjectsMap } from "./gameobjects";
import { GAMEOBJECT_DOESNT_EXIST, INVALID_MOVE } from "./errors";

type GameObject = null | IEGameObject;
type GameObjectMapObject = { position: Vector2; gameObject: IEGameObject };
type HistoryStateObject = {
	state: GameConfigurationObject[]; 
	insertedAt: number;
};

class GameBoard {
	private gameObjects: GameObject[][];
	private mapGameObjects: Map<string, GameObjectMapObject>;
	private history: HistoryStateObject[];
	private callbacks: { [k in GameEventNames]?: ((cb: GameEventNamesArgsMap[k]) => void)[] };

	constructor(configuration?: GameConfigurationObject[] | undefined) {
		this.gameObjects = [];
		this.history = [];
		this.mapGameObjects = new Map();
		this.callbacks = {};
		this.initializeGameObjects();
		this.loadBoard(configuration);
	}

	private loadBoard(from: GameConfigurationObject[] = defaultGameConfiguration) {
		for(const conf of from) {
			this.spawnGameObject(new Vector2(conf.x, conf.y), conf.type, conf.ownership);
		}
		this.notify("GameStarted", { 
			...this.getBaseEventObject(),
			configuration: from 
		});
	} 

	private spawnGameObject(initialPosition: Vector2, type: PieceSymbolString, ownership: PlayerOwnership) {
		const id = uuid();
		const gameObject = new  (gameObjectsMap[type])(this, id, ownership);
		this.gameObjects[initialPosition.Y - 1][initialPosition.X - 1] = gameObject;
		this.mapGameObjects.set(id, {
			gameObject,
			position: initialPosition,
		});
	}

	private initializeGameObjects(): void {
		for (let y = 0; y<8; y++) {
			for (let x = 0; x < 8; x++) {
				if(!Array.isArray(this.gameObjects[x])) {
					this.gameObjects[y] = [];
				}
				this.gameObjects[y][x] = null;
			}
		}
	}

	private getGameObjectWithVector2(position: Vector2): IEGameObject {
		const gameObject = this.gameObjects[position.X][position.Y];
		if (!gameObject) {
			throw new Error(GAMEOBJECT_DOESNT_EXIST);
		}
		return gameObject;
	}
	private getGameObjectMapObject(id: string): GameObjectMapObject {
		const mappedGameObjectData = this.mapGameObjects.get(id);
		if (!mappedGameObjectData) {
			throw new Error(GAMEOBJECT_DOESNT_EXIST);
		}
		return mappedGameObjectData;
	}
	private getGameObjectWithId(id: string): IEGameObject {
		return this.getGameObjectMapObject(id).gameObject;
	}

	public getGameObject(i: Vector2 | string): IEGameObject {
		if ("string" === typeof i) {
			return this.getGameObjectWithId(i);
		} else {
			return this.getGameObjectWithVector2(i);
		}
	}

	private getBaseEventObject(): BaseEventArgs {
		return {
			time: new Date().toISOString(),
		};
	}

	public hasGameObject(i: Vector2 | string): boolean {
		try {
			this.getGameObject(i);
			return true;
		} catch (err) {
			return false;
		}
	}

	public getGameObjectPosition(id: string): Vector2 {
		return this.getGameObjectMapObject(id).position;
	}

	private saveCurrentHistory(): void {
		this.history.push({ 
			state: Array.from(this.mapGameObjects.values()).map((g) => { 
				return {
					x: g.position.X,
					y: g.position.Y,
					type: g.gameObject.getPieceSymbol(),
					ownership: g.gameObject.getPlayerOwnership(),
				};
			}),
			insertedAt: Date.now(),
		});
	}

	public move(from: Vector2, to: Vector2) {
		this.saveCurrentHistory();
		const fromGameObject = this.getGameObject(from); 
		if (!fromGameObject.getAvailableMoves().find((vectorDest) => { 
			return vectorDest.X === to.X && vectorDest.Y === to.Y;
		})) {
			throw new Error(INVALID_MOVE);
		}
		this.gameObjects[from.X][from.X] = null;
		this.mapGameObjects.set(fromGameObject.getId(), {
			gameObject: fromGameObject,
			position: to,
		});
		let toGameObject: IEGameObject | undefined;
		try {
			toGameObject = this.getGameObject(to);
			this.gameObjects[to.X][to.Y] = null;
			this.mapGameObjects.delete(toGameObject.getId());
			this.notify("PieceDestroyed", {
				...this.getBaseEventObject(),
				ownership: toGameObject.getPlayerOwnership(),
				position: to,
				symbolType: toGameObject.getPieceSymbol(),
			});
		} catch (err) {
			
		}
		this.gameObjects[to.X][to.Y] = fromGameObject;
		this.notify("PieceMoved", {
			...this.getBaseEventObject(),
			from,
			to,
			symbolType: fromGameObject.getPieceSymbol(),
		});
	}


	public getPlayerMoves(player: PlayerOwnership): Vector2[] {
		const playerGameObjects = Array.from(this.mapGameObjects.values()).filter((g) => { 
			return g.gameObject.getPlayerOwnership() == player;
		});
		return playerGameObjects.map((g) => { 
			return g.gameObject.getAvailableMoves();
		}).flat();
	} 

	public on<T extends GameEventNames>(eventName: T, cb: ((d: GameEventNamesArgsMap[T]) => void)) {
		if (!this.callbacks[eventName]) {
			this.callbacks[eventName] = [];
		}
		this.callbacks[eventName]?.push(cb);
	}

	private notify<T extends GameEventNames>(eventName: T, data: GameEventNamesArgsMap[T]) {
		const callbacks = this.callbacks[eventName];
		if (callbacks) {
			callbacks.forEach((cb) =>  {
				cb(data);
			});
		}
	}

	
}

export default GameBoard;