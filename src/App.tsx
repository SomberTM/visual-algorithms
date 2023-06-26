import Sorting from "@/components/Sorting";
import {
	NumCandles,
	RandomizeArray,
	ShowAlgrotihm,
	SortButton,
	SortTime,
	SortingStatus,
} from "./components/Controlls";
import {
	bubbleSort,
	insertionSort,
	quicksort,
	selectionSort,
} from "@/lib/algorithms";

const algorithms = [bubbleSort, insertionSort, selectionSort, quicksort];

function App() {
	return (
		<main className="p-2 flex flex-col gap-4 min-h-[100dvh] bg-background">
			{algorithms.map((algorithm, idx) => (
				<Sorting algorithm={algorithm} key={idx}>
					<Sorting.Controlls>
						<NumCandles />
						<RandomizeArray />
						<SortButton />
						<SortingStatus />
						<ShowAlgrotihm />
						<SortTime />
					</Sorting.Controlls>
					<Sorting.Visualizer />
				</Sorting>
			))}
		</main>
	);
}

export default App;
