import Sorting from "@/components/Sorting";
import {
	NumCandles,
	RandomizeArray,
	ShowAlgrotihm,
	ShowStatistics,
	SortButton,
	SortTime,
	SortingStatus,
} from "./components/Controlls";
import {
	bubbleSort,
	heapsort,
	insertionSort,
	mergeSort,
	quickSort,
	selectionSort,
	shellSort,
} from "@/lib/algorithms";
import { SorterStore } from "./stores/SorterStore";
import RootStore from "./stores/RootStore";

const algorithms = [
	bubbleSort,
	insertionSort,
	selectionSort,
	quickSort,
	mergeSort,
	heapsort,
	shellSort,
];
const sorters = algorithms.map((algorithm) => new SorterStore(algorithm));
sorters.forEach((sorter) => (RootStore.sortersById[sorter.id] = sorter));

function App() {
	return (
		<main className="p-2 flex flex-col gap-4 min-h-[100dvh] bg-background">
			{sorters.map((sorter, idx) => (
				<Sorting sorter={sorter} key={idx}>
					<Sorting.Controlls>
						<NumCandles />
						<RandomizeArray />
						<SortButton />
						<SortingStatus />
						<ShowAlgrotihm />
						<SortTime />
						<ShowStatistics />
					</Sorting.Controlls>
					<Sorting.Visualizer />
				</Sorting>
			))}
		</main>
	);
}

export default App;
