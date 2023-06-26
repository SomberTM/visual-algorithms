import RootStore from "../stores/RootStore";
import { RootStoreContext } from "./context/RootStore";

export function RootStoreProvider({ children }: React.PropsWithChildren) {
	return (
		<RootStoreContext.Provider value={new RootStore()}>
			{children}
		</RootStoreContext.Provider>
	);
}
