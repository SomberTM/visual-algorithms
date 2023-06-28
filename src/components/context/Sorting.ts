import { createContext, useContext } from "react";
import RootStore from "../../stores/RootStore";

export const SorterIdContext = createContext<string | null>(null);
export function useSorter() {
	const sorterId = useContext(SorterIdContext);
	if (!sorterId)
		throw new Error(
			"This hook can only be called within children of the `Sorting` component"
		);
	return RootStore.sortersById[sorterId];
}
