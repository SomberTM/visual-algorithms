import { action, makeObservable, observable } from "mobx";
import RootStore from "./RootStore";
import { randomArray, sleep } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export type SortingStatus = "Idle" | "Sorting" | "Finished";
export type SortingGroups = Array<Array<number>>;
export type SortingAlgorithm = () => Promise<void> | void;
export type SortingAlgorithmInfo = {
	run: SortingAlgorithm;
	displayName: string;
};

const DEFAULT_MAX_CANDLE_HEIGHT = 300;
const DEFAULT_NUM_CANDLES = 50;
const DEFAULT_SORTING_STATUS: SortingStatus = "Idle";
const DEFAULT_CANDLE_WIDTH = 25;
const DEFAULT_SORTING_SPEED = 10;
const DEFAULT_GROUPS: SortingGroups = [];
const DEFAULT_SORT_TIME = 0;
const DEFAULT_SHOW_CANDLE_HEIGHT = true;

export class SorterStore {
	public readonly id: string;

	@observable array: number[];
	@observable status: SortingStatus;
	@observable groups: SortingGroups;
	@observable sortTime: number;
	@observable speed: number;
	@observable numCandles: number;
	@observable candleWidth: number;
	@observable maxCandleHeight: number;
	@observable showCandleHeight: boolean;

	constructor(
		public rootStore: RootStore,
		public algorithm: SortingAlgorithmInfo
	) {
		makeObservable(this);

		this.id = uuidv4();
		this.array = randomArray(DEFAULT_NUM_CANDLES, DEFAULT_MAX_CANDLE_HEIGHT);
		this.status = DEFAULT_SORTING_STATUS;
		this.groups = DEFAULT_GROUPS;
		this.sortTime = DEFAULT_SORT_TIME;
		this.speed = DEFAULT_SORTING_SPEED;
		this.numCandles = DEFAULT_NUM_CANDLES;
		this.candleWidth = DEFAULT_CANDLE_WIDTH;
		this.maxCandleHeight = DEFAULT_MAX_CANDLE_HEIGHT;
		this.showCandleHeight = DEFAULT_SHOW_CANDLE_HEIGHT;
	}

	@action
	swap(i: number, j: number) {
		const temp = this.array[i];
		this.array[i] = this.array[j];
		this.array[j] = temp;
	}

	@action
	async swapAndWait(i: number, j: number, before = false) {
		if (before) await sleep(this.speed);
		this.swap(i, j);
		if (!before) await sleep(this.speed);
	}
}
