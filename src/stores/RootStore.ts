import { SorterStore, SortingAlgorithm } from "./SorterStore";

export default class RootStore {
	public sortersById: { [key: string]: SorterStore };

	constructor() {
		this.sortersById = {};
	}

	createSorterStore(algorithm: SortingAlgorithm) {
		const store = new SorterStore(this, algorithm);
		this.sortersById[store.id] = store;
		return store;
	}
}
