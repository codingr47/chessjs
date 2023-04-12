export const colorStringToInt = (color: string) => { 
	return parseInt(color.substring(1), 16);
}

export const sleep = async(ms: number) => new Promise<void>((res) => setTimeout(() => res(), ms));