import { Vec2 as Vector2D } from "./types"

export type GameSDKHandler {
	move(from: Vector2D, to: Vector2D): void;

}
export default function GameSDK(): GameSDKHandler {
	
}