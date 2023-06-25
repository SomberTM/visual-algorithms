import { SortingContext } from "@/context/Sorting";
import { Signal, sleep, swap } from "@/lib/utils";

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

export async function quicksort(this: SortingContext) {
  await recursiveQuicksort(this, [...this.array()], 0, this.array().length - 1);
  this.groups([])
}

async function recursiveQuicksort(context: SortingContext, array: number[], lo: number, hi: number) {
  if (lo >= hi || lo < 0) return;

  const p = await quicksortPartition(context, array, lo, hi);

  await recursiveQuicksort(context, array, lo, p - 1);
  await recursiveQuicksort(context, array, p + 1, hi);
}

async function quicksortPartition(context: SortingContext, array: number[], lo: number, hi: number) {
  const pivot = array[hi];
  let i = lo - 1;

  for (let j = lo; j < hi; j++) {
    if (array[j] <= pivot) {
      i++;
      context.groups([[i], [j], Array.from({length: Math.abs(j - i)}).map((_, idx) => idx + i + 1), [lo, hi]])
      context.array([...swap(array, i, j)]);
      await sleep(context.speed());
    }
  }

  i++;
  context.groups([[i + 1], [hi - 1], Array.from({length: Math.abs(hi - i)}).map((_, idx) => idx + i), [lo, hi]])
  context.array([...swap(array, i, hi)]);
  await sleep(context.speed());
  return i;
}