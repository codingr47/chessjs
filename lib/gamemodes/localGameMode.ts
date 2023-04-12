import * as THREE from "three";
import BaseGameMode, { GameModeProps } from ".";
import PlayerMouseController from "../controllers/playerMouseController";
import { sleep } from "../utils";

export default class LocalGameMode extends BaseGameMode {
	mouseController: PlayerMouseController | undefined;

	constructor(props: GameModeProps) {
		super(props);
		if (this.chessboard && this.scene) {
			this.mouseController = new PlayerMouseController({
				chessboard: this.chessboard,
				displayPort: this.refDisplayPort,
				ownership: "player1",
				pointerColor: new THREE.Color(0x0000bb),
				scene: this.scene,
			});
		}
	}
	async main(): Promise<void> {
		await this.mouseController?.waitForPlayerMove();
		this.mouseController?.setPlayerOwnership("player2");
		await this.mouseController?.waitForPlayerMove();
		this.mouseController?.setPlayerOwnership("player1");
	}
	
}