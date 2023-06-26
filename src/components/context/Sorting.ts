import { createContext, useContext } from "react";
import { useRootStore } from "./RootStore";

export const SorterIdContext = createContext<string | null>(null);
export function useSorter() {
	const rootStore = useRootStore();
	const sorterId = useContext(SorterIdContext);
	if (!sorterId)
		throw new Error(
			"This hook can only be called within children of the `Sorting` component"
		);
	return rootStore.sortersById[sorterId];
}
