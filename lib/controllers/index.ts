import Chessboard from "../chessboard";
import { GameControllerProps, IEGameController, PlayerOwnership } from "../types";

export default abstract class GameController implements IEGameController {
	
	protected chessboard:Chessboard;
	protected ownership:PlayerOwnership;
	protected scene: THREE.Scene;

	constructor({ chessboard, ownership, scene }: GameControllerProps) {
		this.chessboard = chessboard;
		this.ownership = ownership;
		this.scene  = scene;
	}

	abstract waitForPlayerMove(): Promise<void>;
	
}