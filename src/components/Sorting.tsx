import Visualizer from "./Visualizer";
import Controlls from "./Controlls";
import { SorterIdContext } from "@/context/Sorting";
import { useRootStore } from "@/context/RootStore";
import { SortingAlgorithm } from "../stores/SorterStore";

export default function Sorting({
	children,
	algorithm,
}: React.PropsWithChildren<{ algorithm: SortingAlgorithm }>) {
	const rootStore = useRootStore();

	return (
		<SorterIdContext.Provider value={rootStore.createSorterStore(algorithm).id}>
			{children}
		</SorterIdContext.Provider>
	);
}

Sorting.Visualizer = Visualizer;
Sorting.Controlls = Controlls;
