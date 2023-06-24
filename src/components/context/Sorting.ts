import { Signal } from "@/lib/utils";
import { createContext, useContext } from "react";

export type SortingStatus = "Idle" | "Sorting" | "Finished";
export type SortingAlgorithm = (array: Signal<number[]>, speed?: number) => Promise<void>;

export interface SortingContext {
	array: Signal<number[]>;
	candleWidth: Signal<number>;
	status: Signal<SortingStatus>;
	speed: Signal<number>;
  numCandles: Signal<number>;
  maxCandleHeight: Signal<number>;
  algorithm: SortingAlgorithm;
}

export const SortingContext = createContext<SortingContext | null>(null);
export const useSortingContext = (): SortingContext => {
	const context = useContext(SortingContext);
	if (!context)
		throw new Error(
			"This hook can only be called within children of the `Sorting` component"
		);
	return context as SortingContext;
};
