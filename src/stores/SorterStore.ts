import { action, makeObservable, observable } from "mobx";
import RootStore from "./RootStore";
import { randomArray, sleep } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export type SortingStatus = "Idle" | "Sorting" | "Finished";
export type SortingGroups = Array<Array<number>>;
export type SortingAlgorithm = (() => Promise<void> | void) & {
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

	@observable history: Array<Array<number>>;
	@observable array: number[];
	@observable status: SortingStatus;
	@observable groups: SortingGroups;
	@observable sortTime: number;
	@observable speed: number;
	@observable numCandles: number;
	@observable candleWidth: number;
	@observable maxCandleHeight: number;
	@observable showCandleHeight: boolean;

	constructor(public rootStore: RootStore, public algorithm: SortingAlgorithm) {
		makeObservable(this);

		this.id = uuidv4();
		this.history = [];
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
	setArray(array: number[]) {
		this.array = array;
	}

	@action
	setStatus(status: SortingStatus) {
		this.status = status;
	}

	@action
	setGroups(groups: SortingGroups) {
		this.groups = groups;
	}

	@action
	setSortTime(sortTime: number) {
		this.sortTime = sortTime;
	}

	@action
	setSpeed(speed: number) {
		this.speed = speed;
	}

	@action
	setNumCandles(numCandles: number) {
		this.numCandles = numCandles;
	}

	@action
	setCandleWidth(candleWidth: number) {
		this.candleWidth = candleWidth;
	}

	@action
	setMaxCandleHeight(maxCandleHeight: number) {
		this.maxCandleHeight = maxCandleHeight;
	}

	@action
	setShowCandleHeight(showCandleHeight: boolean) {
		this.showCandleHeight = showCandleHeight;
	}

	@action
	swap(i: number, j: number) {
		this.history.push([...this.array]);
		const temp = this.array[i];
		this.array[i] = this.array[j];
		this.array[j] = temp;
	}

	@action
	async swapAndWait(i: number, j: number, before = false) {
		if (before) await this.wait();
		this.history.push([...this.array]);
		this.swap(i, j);
		if (!before) await this.wait();
	}

	async wait() {
		await sleep(this.speed);
	}
}
