import { useAutoAnimate } from "@formkit/auto-animate/react";
import Candle from "./Candle";
import { useSorter } from "./context/Sorting";
import { observer } from "mobx-react-lite";

interface VisualizerProps {
	width?: number;
	height?: number;
}

const groupColors = ["red", "green", "yellow", "blue", "purple", "white"];

const Visualizer = observer(({ width, height }: VisualizerProps) => {
	const sorting = useSorter();
	const [parent] = useAutoAnimate();

	if (height) sorting.maxCandleHeight = height;

	return (
		<div
			style={{
				width,
				height: sorting.maxCandleHeight,
			}}
			className="mx-4 mt-2 flex gap-1 items-end"
			ref={parent}
		>
			{sorting.array.map((value, idx) => {
				const candleColor = groupColors.at(
					sorting.groups.findIndex((group) =>
						group.some((index) => index === idx)
					)
				);
				return (
					<Candle
						key={idx}
						height={value}
						style={{
							backgroundColor: candleColor,
						}}
					/>
				);
			})}
		</div>
	);
});

export default Visualizer;
