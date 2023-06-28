import { runInAction } from "mobx";
import { SorterStore } from "../stores/SorterStore";

export async function bubbleSort(this: SorterStore) {
	let swapped;
	do {
		swapped = false;
		for (let i = 1; i < this.array.length; i++) {
			if (this.comparegt(i - 1, i)) {
				this.setGroups({
					red: [i - 1],
					green: [i],
				});
				await this.swapAndWait(i - 1, i);
				swapped = true;
			}
		}
		this.clearGroups();
		if (!swapped) {
			// Just visual sugar for bubble sort to
			// "check" that the array is actually sorted
			for (let i = 0; i < this.array.length; i++) {
				this.setGroup("red", [i]);
				await this.wait();
			}
			this.clearGroups();
		}
	} while (swapped);
}
bubbleSort.displayName = "Bubble Sort";

export async function insertionSort(this: SorterStore) {
	for (let i = 1; i < this.array.length; i++) {
		for (let j = i; j > 0 && this.comparegt(j - 1, j); j--) {
			this.setGroups({
				red: [j],
				green: [j - 1],
				yellow: [i],
			});
			await this.swapAndWait(j, j - 1);
		}
	}
	this.clearGroups();
}
insertionSort.displayName = "Insertion Sort";

export async function selectionSort(this: SorterStore) {
	for (let i = 0; i < this.array.length - 1; i++) {
		let minIndex = i;
		for (let j = i + 1; j < this.array.length; j++) {
			if (this.comparelt(j, minIndex)) {
				minIndex = j;
			}
			this.setGroups({
				red: [minIndex],
				green: [i],
				yellow: Array.from({ length: i }).map((_, idx) => idx),
			});
		}
		if (minIndex != i) {
			await this.swapAndWait(i, minIndex);
		}
	}
	this.clearGroups();
}
selectionSort.displayName = "Selection Sort";

export async function quickSort(this: SorterStore) {
	await recursiveQuicksort.call(this, 0, this.array.length - 1);
	this.clearGroups();
}
quickSort.displayName = "Quicksort (Lomuto)";

async function recursiveQuicksort(this: SorterStore, lo: number, hi: number) {
	if (lo >= hi || lo < 0) return;

	const p = await quicksortPartition.call(this, lo, hi);

	await recursiveQuicksort.call(this, lo, p - 1);
	await recursiveQuicksort.call(this, p + 1, hi);
}

async function quicksortPartition(this: SorterStore, lo: number, hi: number) {
	// const pivot = this.array[hi];
	let i = lo - 1;

	for (let j = lo; j < hi; j++) {
		if (this.comparelte(j, hi)) {
			i++;
			this.setGroups({
				red: [i],
				green: [j],
				yellow: Array.from({ length: Math.abs(j - i - 1) }).map(
					(_, idx) => idx + i + 1
				),
				blue: [lo, hi],
			});
			await this.swapAndWait(i, j);
		}
	}

	i++;
	this.setGroups({
		red: [i],
		green: [hi - 1],
		yellow: Array.from({ length: Math.abs(hi - i - 1) }).map(
			(_, idx) => idx + i + 1
		),
		blue: [lo, hi],
	});
	await this.swapAndWait(i, hi);
	return i;
}

export async function mergeSort(this: SorterStore) {
	await mergeSortSplit.call(this, this.array, 0, this.numCandles, [
		...this.array,
	]);
	this.clearGroups();
}
mergeSort.displayName = "Merge Sort (Top Down)";

async function mergeSortSplit(
	this: SorterStore,
	B: number[],
	begin: number,
	end: number,
	A: number[]
) {
	if (end - begin <= 1) return;

	const middle = Math.floor((end + begin) / 2);

	await mergeSortSplit.call(this, A, begin, middle, B);
	await mergeSortSplit.call(this, A, middle, end, B);

	await merge.call(this, B, begin, middle, end, A);
}

async function merge(
	this: SorterStore,
	B: number[],
	begin: number,
	middle: number,
	end: number,
	A: number[]
) {
	let i = begin;
	let j = middle;

	this.setGroup(
		"yellow",
		Array.from({ length: middle - begin }).map((_, idx) => idx + begin)
	);
	this.setGroup(
		"orange",
		Array.from({ length: end - middle }).map((_, idx) => idx + middle)
	);

	for (let k = begin; k < end; k++) {
    if (i < middle && j < end) this.comparelte(i, j);
		if (i < middle && (j >= end || A[i] <= A[j])) {
			this.setGroup("red", [k]);
			this.captureHistory("swap");
			runInAction(() => (B[k] = A[i]));
			i++;
			await this.wait();
		} else {
			this.setGroup("red", [k]);
			this.captureHistory("swap");
			runInAction(() => (B[k] = A[j]));
			j++;
			await this.wait();
		}
	}
}

export async function heapsort(this: SorterStore) {
	await heapify.call(this);

	let end = this.array.length - 1;
	while (end > 0) {
		this.setGroup("red", [end]);
		this.setGroup("green", [0]);
		await this.swapAndWait(end, 0);
		end--;
		await siftDown.call(this, 0, end);
	}

	this.clearGroups();
}
heapsort.displayName = "Heap Sort";

function parent(i: number) {
	return Math.floor((i - 1) / 2);
}
function leftChild(i: number) {
	return 2 * i + 1;
}

async function heapify(this: SorterStore) {
	let start = parent(this.array.length - 1);
	while (start >= 0) {
		await siftDown.call(this, start, this.array.length - 1);
		start--;
	}
}

async function siftDown(this: SorterStore, start: number, end: number) {
	let root = start;

	while (leftChild(root) <= end) {
		const child = leftChild(root);
		let swap = root;

		if (this.comparelt(swap, child)) swap = child;
		if (child + 1 <= end && this.comparelt(swap, child + 1))
			swap = child + 1;
		if (swap == root) return;
		else {
			this.setGroup("red", [root]);
			this.setGroup("green", [swap]);
			await this.swapAndWait(root, swap);
			root = swap;
		}
	}
}
