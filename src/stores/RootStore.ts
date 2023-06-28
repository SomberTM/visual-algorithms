import { observable } from "mobx";
import { SorterStore, SortingAlgorithm } from "./SorterStore";

class RootStore {
	@observable sortersById: { [key: string]: SorterStore };

	constructor() {
		this.sortersById = {};
	}

	createSorterStore(algorithm: SortingAlgorithm) {
		const store = new SorterStore(algorithm);
		this.sortersById[store.id] = store;
		return store;
	}

  get sorters(): SorterStore[] {
    return Object.values(this.sortersById);
  }
}

export default new RootStore();