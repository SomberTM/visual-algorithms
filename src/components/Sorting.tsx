import Visualizer from "./Visualizer";
import Controlls from "./Controlls";
import { SorterIdContext } from "@/context/Sorting";
import { SorterStore } from "../stores/SorterStore";


export default function Sorting({
	children,
	sorter,
}: React.PropsWithChildren<{ sorter: SorterStore }>) {
	return (
		<SorterIdContext.Provider value={sorter.id}>
			{children}
		</SorterIdContext.Provider>
	);
}

Sorting.Visualizer = Visualizer;
Sorting.Controlls = Controlls;
