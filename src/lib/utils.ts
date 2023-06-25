import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function swap(array: number[], i: number, j: number): number[] {
	const temp = array[i];
	array[i] = array[j];
	array[j] = temp;
	return array;
}

// This is only used for generating arrays that are visible
// so we want to have at least one element be max so that
// the container isnt resizing weirdly each time
export function randomArray(length = 50, max = 250) {
	const array = Array.from({ length }).map(() => Math.floor(Math.random() * max));
  if (!array.some((el) => el === max))
    array[Math.floor(Math.random() * length)] = max;
  return array;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export type Signal<T> = (action?: React.SetStateAction<T>) => T;
export function createSignal<T>(
	state: T,
	setState: React.Dispatch<React.SetStateAction<T>>
): Signal<T> {
	return (action) => {
		if (action) setState(action);
		return state;
	};
}
