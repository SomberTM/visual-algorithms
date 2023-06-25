import Sorting from "@/components/Sorting";
import { bubbleSort, insertionSort, quicksort, selectionSort } from "@/lib/algorithms";

function App() {
	return (
		<main className="p-2 flex flex-col gap-4 min-h-[100dvh] bg-background">
			<Sorting algorithm={{ run: bubbleSort, displayName: "Bubble Sort" }}>
				<Sorting.Controlls>
          <Sorting.Controlls.NumCandles />
          <Sorting.Controlls.RandomizeArray />
					<Sorting.Controlls.SortButton />
          <Sorting.Controlls.SortingStatus />
          <Sorting.Controlls.ShowAlgorithm />
				</Sorting.Controlls>
				<Sorting.Visualizer />
			</Sorting>
			<Sorting algorithm={{ run: insertionSort, displayName: "Insertion Sort" }}>
				<Sorting.Controlls>
          <Sorting.Controlls.NumCandles />
          <Sorting.Controlls.RandomizeArray />
					<Sorting.Controlls.SortButton />
          <Sorting.Controlls.SortingStatus />
          <Sorting.Controlls.ShowAlgorithm />
				</Sorting.Controlls>
				<Sorting.Visualizer />
			</Sorting>
      <Sorting algorithm={{ run: selectionSort, displayName: "Selection Sort" }}>
				<Sorting.Controlls>
          <Sorting.Controlls.NumCandles />
          <Sorting.Controlls.RandomizeArray />
					<Sorting.Controlls.SortButton />
          <Sorting.Controlls.SortingStatus />
          <Sorting.Controlls.ShowAlgorithm />
				</Sorting.Controlls>
				<Sorting.Visualizer />
			</Sorting>
      <Sorting algorithm={{ run: quicksort, displayName: "Quicksort (Lomuto)" }}>
				<Sorting.Controlls>
          <Sorting.Controlls.NumCandles />
          <Sorting.Controlls.RandomizeArray />
					<Sorting.Controlls.SortButton />
          <Sorting.Controlls.SortingStatus />
          <Sorting.Controlls.ShowAlgorithm />
				</Sorting.Controlls>
				<Sorting.Visualizer />
			</Sorting>
		</main>
	);
}

export default App;
