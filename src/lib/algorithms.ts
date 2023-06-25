import { SortingContext } from "@/context/Sorting";
import { sleep, swap } from "./utils";

export async function bubbleSort(this: SortingContext) {
	const localArray = [...this.array()];
	// eslint-disable-next-line no-constant-condition
	while (true) {
		let swapped = false;
		for (let i = 1; i < localArray.length; i++) {
			if (localArray[i - 1] > localArray[i]) {
				this.groups([[i - 1], [i]]);
				this.array([...swap(localArray, i - 1, i)]);
				swapped = true;
				await sleep(this.speed());
			}
		}
		if (!swapped) {
			// Just visual sugar for bubble sort to
			// "check" that the array is actually sorted
			for (let i = 0; i < localArray.length; i++) {
				this.groups([[i]]);
				await sleep(10);
			}
			this.groups([]);
			break;
		}
	}
}

export async function insertionSort(this: SortingContext) {
	const localArray = [...this.array()];
	for (let i = 1; i < localArray.length; i++) {
		for (let j = i; j > 0 && localArray[j - 1] > localArray[j]; j--) {
			this.groups([[j], [j - 1], [i]]);
			this.array([...swap(localArray, j, j - 1)]);
			await sleep(this.speed());
		}
	}
	this.groups([]);
}

export async function selectionSort(this: SortingContext) {
	const localArray = [...this.array()];
	for (let i = 0; i < localArray.length - 1; i++) {
		let minIndex = i;
		for (let j = i + 1; j < localArray.length; j++) {
			if (localArray[j] < localArray[minIndex]) {
				minIndex = j;
			}
			this.groups([[minIndex], [i], Array.from({length: i}).map((_, idx) => idx)]);
		}
		if (minIndex != i) {
			this.array([...swap(localArray, i, minIndex)]);
			await sleep(this.speed());
		}
	}
	this.groups([]);
}
