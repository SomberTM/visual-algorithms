/* eslint-disable react-hooks/exhaustive-deps */
import { useSortingContext } from "@/context/Sorting";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Candle from "./Candle";

interface VisualizerProps {
	width?: number;
	height?: number;
}

export default function Visualizer({ width, height }: VisualizerProps) {
	const sorting = useSortingContext();
	const [parent] = useAutoAnimate();

  sorting.maxCandleHeight(height);

	return (
		<div style={{ width, height: sorting.maxCandleHeight() }} className="mx-4 mt-2 flex gap-1 items-end" ref={parent}>
			{sorting.array().map((value, idx) => (
				<Candle
					key={idx}
					height={value}
				/>
			))}
		</div>
	);
}
