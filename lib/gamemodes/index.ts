import * as THREE from "three";
import { update as tweenUpdate } from "@tweenjs/tween.js";
import { IEGameMode } from "../types";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import theme from "../colors.json"
import Chessboard from "../chessboard";

export type GameModeProps = {
	width: number;
	height: number;
	chessboardMeshDimension: number;
	chessboardTextureDimension: number;
	displayPortElement: HTMLElement;
	orbitControls?: boolean;
	rendererBackgorundColor?: THREE.Color;
}
export default abstract class BaseGameMode implements IEGameMode {
	
	private viewWidth: number;
	private viewHeight: number;
	private chessboardMeshDimension: number;
	private chessboardTextureDimension: number;
	protected refDisplayPort: HTMLElement;
	private useOrbitControls: boolean;

	private orbit: OrbitControls | undefined;

	private gameOver = false;
	protected scene: THREE.Scene | undefined;
	protected renderer: THREE.WebGLRenderer | undefined;
	protected camera: THREE.Camera | undefined;
	protected light: THREE.AmbientLight | undefined;
	protected chessboard: Chessboard | undefined;

	constructor(props: GameModeProps) {
		this.viewWidth = props.width;
		this.viewHeight = props.height;
		this.chessboardMeshDimension = props.chessboardMeshDimension;
		this.chessboardTextureDimension = props.chessboardTextureDimension;
		this.refDisplayPort = props.displayPortElement;
		this.useOrbitControls = !!props.orbitControls;
		this.initScene();
		this.initChessboard();
		this.initRenderer(props.rendererBackgorundColor);
		this.initOrbit();
	}

	private initScene() {
		const scene = new THREE.Scene();
		const light = new THREE.AmbientLight( 0x808080 );
		const camera = new THREE.PerspectiveCamera(90, this.viewWidth / this.viewHeight);
		camera.position.set(0, 0, 100);
		camera.lookAt( 0, 0, 0 );
		scene.add(light);
		this.scene = scene;
		this.light = light;
		this.camera = camera;


	}
	private initChessboard() {
		if (!this.scene) throw new Error();
		const chessboard = new Chessboard(this.scene, {
			meshDimension: this.chessboardMeshDimension,
			colors: {
				hoverColor: theme.hoverColor,
				player1Color: theme.primaryColor,
				player1Color2: theme.primaryColor2,
				player2Color: theme.secondaryColor,
				player2Color2: theme.secondaryColor2,
			},
			textureDimension: this.chessboardTextureDimension,
		});
		this.chessboard = chessboard;
	}
	private initRenderer(bgColor?: THREE.Color) {
		const renderer = new THREE.WebGLRenderer({ antialias: true, });
		renderer.setSize(this.viewWidth, this.viewHeight);
		renderer.setClearColor( bgColor ? bgColor.getHex() : 0xFFEEEE, 1 );
		renderer.outputEncoding = THREE.sRGBEncoding;
		this.refDisplayPort.appendChild(renderer.domElement);
		const update = (ms: number)  => {
			if (this.scene && this.camera) { 
				renderer.render(this.scene, this.camera);
			}
			if (this.orbit) { 
				this.orbit.update();
			}
			tweenUpdate(ms);
			requestAnimationFrame(update);
		}
		update(0);
		this.renderer = renderer;
	}

	private initOrbit() {
		if (this.useOrbitControls && this.camera && this.renderer) {
			const orbit = new OrbitControls(this.camera, this.renderer.domElement);
			orbit.enableDamping = true;
			orbit.zoomSpeed = 0.3;
			orbit.maxPolarAngle = THREE.MathUtils.degToRad(135);
			orbit.minPolarAngle = THREE.MathUtils.degToRad(90);
			orbit.maxAzimuthAngle = THREE.MathUtils.degToRad(45);
			orbit.minAzimuthAngle = THREE.MathUtils.degToRad(-45);
			orbit.enablePan = false;
		}
	}

	private async mainLoop() {
		while (!this.gameOver) {
			await this.main();
		}
	}


	abstract main(): Promise<void>;

	public async run() {
		return this.mainLoop();
	}

}