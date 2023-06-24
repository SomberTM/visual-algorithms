import { createSignal, randomArray } from "@/lib/utils";
import {
	SortingAlgorithm,
	SortingContext,
	SortingStatus,
} from "@/context/Sorting";
import { useState } from "react";
import Visualizer from "./Visualizer";
import Controlls from "./Controlls";

const DEFAULT_MAX_CANDLE_HEIGHT = 300;
const DEFAULT_NUM_CANDLES = 50;
const DEFAULT_CANDLE_WIDTH = 25;
const DEFAULT_SORTING_SPEED = 10;

export default function Sorting({
	children,
	algorithm,
}: React.PropsWithChildren<{ algorithm: SortingAlgorithm }>) {
	const [array, setArray] = useState<number[]>(
		randomArray(DEFAULT_NUM_CANDLES, DEFAULT_MAX_CANDLE_HEIGHT)
	);
	const [candleWidth, setCandleWidth] = useState<number>(DEFAULT_CANDLE_WIDTH);
	const [status, setStatus] = useState<SortingStatus>("Idle");
	const [speed, setSpeed] = useState<number>(DEFAULT_SORTING_SPEED);
	const [numCandles, setNumCandles] = useState<number>(DEFAULT_NUM_CANDLES);
	const [maxCandleHeight, setMaxCandleHeight] = useState<number>(
		DEFAULT_MAX_CANDLE_HEIGHT
	);

	return (
		<SortingContext.Provider
			value={{
				array: createSignal(array, setArray),
				candleWidth: createSignal(candleWidth, setCandleWidth),
				status: createSignal(status, setStatus),
				speed: createSignal(speed, setSpeed),
				numCandles: createSignal(numCandles, setNumCandles),
				maxCandleHeight: createSignal(maxCandleHeight, setMaxCandleHeight),
				algorithm,
			}}
		>
			{children}
		</SortingContext.Provider>
	);
}

Sorting.Visualizer = Visualizer;
Sorting.Controlls = Controlls;
