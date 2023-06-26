import { createContext, useContext } from "react";
import RootStore from "../../stores/RootStore";

export const RootStoreContext = createContext<RootStore | null>(null);

export function useRootStore() {
	const context = useContext(RootStoreContext);
	if (!context)
		throw new Error(
			"This hook can only be called within children of the `RootStoreProvider` component"
		);
	return context as RootStore;
}
