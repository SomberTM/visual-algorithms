import { SorterStore } from "../stores/SorterStore";

export async function bubbleSort(this: SorterStore) {
	let swapped;
	do {
		swapped = false;
		for (let i = 1; i < this.array.length; i++) {
			if (this.array[i - 1] > this.array[i]) {
				this.setGroups([[i - 1], [i]]);
				await this.swapAndWait(i - 1, i);
				swapped = true;
			}
		}
		if (!swapped) {
			// Just visual sugar for bubble sort to
			// "check" that the array is actually sorted
			for (let i = 0; i < this.array.length; i++) {
				this.setGroups([[i]]);
				await this.wait();
			}
			this.setGroups([]);
		}
	} while (swapped);
}
bubbleSort.displayName = "Bubble Sort";

export async function insertionSort(this: SorterStore) {
	for (let i = 1; i < this.array.length; i++) {
		for (let j = i; j > 0 && this.array[j - 1] > this.array[j]; j--) {
			this.setGroups([[j], [j - 1], [i]]);
			await this.swapAndWait(j, j - 1);
		}
	}
	this.setGroups([]);
}
insertionSort.displayName = "Insertion Sort";

export async function selectionSort(this: SorterStore) {
	for (let i = 0; i < this.array.length - 1; i++) {
		let minIndex = i;
		for (let j = i + 1; j < this.array.length; j++) {
			if (this.array[j] < this.array[minIndex]) {
				minIndex = j;
			}
			this.setGroups([
				[minIndex],
				[i],
				Array.from({ length: i }).map((_, idx) => idx),
			]);
		}
		if (minIndex != i) {
			await this.swapAndWait(i, minIndex);
		}
	}
	this.setGroups([]);
}
selectionSort.displayName = "Selection Sort";

export async function quicksort(this: SorterStore) {
	await recursiveQuicksort(this, 0, this.array.length - 1);
	this.setGroups([]);
}
quicksort.displayName = "Quicksort";

async function recursiveQuicksort(store: SorterStore, lo: number, hi: number) {
	if (lo >= hi || lo < 0) return;

	const p = await quicksortPartition(store, lo, hi);

	await recursiveQuicksort(store, lo, p - 1);
	await recursiveQuicksort(store, p + 1, hi);
}

async function quicksortPartition(store: SorterStore, lo: number, hi: number) {
	const pivot = store.array[hi];
	let i = lo - 1;

	for (let j = lo; j < hi; j++) {
		if (store.array[j] <= pivot) {
			i++;
			store.setGroups([
				[i],
				[j],
				Array.from({ length: Math.abs(j - i) }).map((_, idx) => idx + i + 1),
				[lo, hi],
			]);
			await store.swapAndWait(i, j);
		}
	}

	i++;
	store.setGroups([
		[i + 1],
		[hi - 1],
		Array.from({ length: Math.abs(hi - i) }).map((_, idx) => idx + i),
		[lo, hi],
	]);
	await store.swapAndWait(i, hi);
	return i;
}
