export const colorStringToInt = (color: string) => { 
	return parseInt(color.substring(1), 16);
}

export const inBoardBounds = (position: THREE.Vector2): boolean => { 
	return position.x >= 0 && position.x <= 7 && position.y >= 0 && position.y <= 7;
}

export const sleep = async(ms: number) => new Promise<void>((res) => setTimeout(() => res(), ms));