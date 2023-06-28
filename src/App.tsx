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
	mergeSort,
	quickSort,
	selectionSort,
} from "@/lib/algorithms";
import { SorterStore } from "./stores/SorterStore";
import RootStore from "./stores/RootStore";

const algorithms = [bubbleSort, insertionSort, selectionSort, quickSort, mergeSort];
const sorters = algorithms.map((algorithm) => new SorterStore(algorithm));
sorters.forEach((sorter) => RootStore.sortersById[sorter.id] = sorter);

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
					</Sorting.Controlls>
					<Sorting.Visualizer />
				</Sorting>
			))}
		</main>
	);
}

export default App;
