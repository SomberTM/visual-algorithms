import { action, makeObservable, observable } from "mobx";
import { randomArray, sleep } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { type CSSProperties } from "react";

type SortingPromise =
	| { reject: (value?: unknown) => void; resolve: (reason?: any) => void }
	| undefined;

export type SortingStatus = "Idle" | "Sorting" | "Finished";
export type SortingAlgorithm = (() => Promise<void>) & {
	displayName: string;
};

type BackgroundColor = Exclude<CSSProperties["backgroundColor"], undefined>;
type MyPartial<T> = { [P in keyof T]?: T[P] };
export type SortingGroups = MyPartial<Record<BackgroundColor, number[]>>;

export interface SortingMoment {
	readonly array: number[];
	readonly groups: SortingGroups;
	readonly totalSwaps: number;
	readonly totalComparisons: number;
}

export interface SortHistory {
	readonly moments: SortingMoment[];
	readonly totalSwaps: number;
	readonly totalComparisons: number;
	readonly speed: number;
}

const DEFAULT_MAX_CANDLE_HEIGHT = 300;
const DEFAULT_NUM_CANDLES = 50;
const DEFAULT_SORTING_STATUS: SortingStatus = "Idle";
const DEFAULT_CANDLE_WIDTH = 25;
const DEFAULT_SORTING_SPEED = 10;
const DEFAULT_GROUPS: SortingGroups = {};
const DEFAULT_SORT_TIME = 0;
const DEFAULT_SHOW_CANDLE_HEIGHT = true;

export class SorterStore {
	public readonly id: string;

	@observable array: number[];
	@observable history: SortHistory;
	@observable historyIndex: number;
	@observable status: SortingStatus;
	@observable groups: SortingGroups;
	@observable sortTime: number;
	@observable speed: number;
	@observable numCandles: number;
	@observable candleWidth: number;
	@observable maxCandleHeight: number;
	@observable showCandleHeight: boolean;

	constructor(public algorithm: SortingAlgorithm) {
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
		this.history = this.getIdleHistory();
		this.historyIndex = 0;
	}

	private getIdleHistory(): SortHistory {
		return {
			moments: [
				{
					array: [...this.array],
					groups: {},
					totalComparisons: 0,
					totalSwaps: 0,
				},
			],
			totalComparisons: 0,
			totalSwaps: 0,
			speed: this.speed,
		};
	}

	@action
	setArray(array: number[]) {
		this.array = array;
	}

	@action
	setStatus(status: SortingStatus) {
		if (status !== "Finished") this.setSortingHistoryIndex(0);

		this.status = status;
	}

	@action
	setGroups(groups: SortingGroups) {
		this.groups = groups;
	}

	@action
	setGroup(groupColor: BackgroundColor, indices: number[]) {
		this.groups[groupColor] = indices;
	}

	@action
	clearGroups() {
		this.groups = {};
	}

	@action
	setSortTime(sortTime: number) {
		this.sortTime = sortTime;
	}

	@action
	setSpeed(speed: number) {
		if (speed < 0) speed = 0;
		this.speed = speed;
	}

	@action
	setNumCandles(numCandles: number) {
		if (numCandles < 0) numCandles = 0;
		this.numCandles = numCandles;
	}

	@action
	setCandleWidth(candleWidth: number) {
		if (candleWidth < 0) candleWidth = 0;
		this.candleWidth = candleWidth;
	}

	@action
	setMaxCandleHeight(maxCandleHeight: number) {
		if (maxCandleHeight < 0) maxCandleHeight = 0;
		this.maxCandleHeight = maxCandleHeight;
	}

	@action
	setShowCandleHeight(showCandleHeight: boolean) {
		this.showCandleHeight = showCandleHeight;
	}

	@action
	setSortingHistoryIndex(index: number) {
		this.historyIndex = index;
	}

	@action
	captureHistory(action?: "swap" | "compare") {
		const lastMoment = this.history.moments.at(-1) as SortingMoment;
		const isActionSwap = action && action === "swap";
		const isActionCompare = action && action === "compare";
		this.history = {
			...this.history,
			moments: [
				...this.history.moments,
				{
					array: [...this.array],
					groups: { ...this.groups },
					totalSwaps: isActionSwap
						? lastMoment.totalSwaps + 1
						: lastMoment.totalSwaps,
					totalComparisons: isActionCompare
						? lastMoment.totalComparisons + 1
						: lastMoment.totalComparisons,
				},
			],
			totalSwaps: isActionSwap
				? this.history.totalSwaps + 1
				: this.history.totalComparisons,
			totalComparisons: isActionCompare
				? this.history.totalComparisons + 1
				: this.history.totalComparisons,
		};
	}

	@action
	swap(i: number, j: number) {
		this.captureHistory("swap");

		const temp = this.array[i];
		this.array[i] = this.array[j];
		this.array[j] = temp;
	}

	@action
	async swapAndWait(i: number, j: number, before = false) {
		if (before) await this.wait();
		this.swap(i, j);
		if (!before) await this.wait();
	}

	async wait() {
		await sleep(this.speed);
	}

	@action
	async sort() {
		this.history = this.getIdleHistory();
		this.setStatus("Sorting");
		const timeStart = performance.now();
		await this.algorithm.call(this);
		this.sortTime = performance.now() - timeStart;
		this.setStatus("Finished");
		this.captureHistory();
		this.setSortingHistoryIndex(this.history.moments.length - 1);
	}
}
