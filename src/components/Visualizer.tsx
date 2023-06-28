import { useAutoAnimate } from "@formkit/auto-animate/react";
import Candle from "./Candle";
import { useSorter } from "./context/Sorting";
import { observer } from "mobx-react-lite";

interface VisualizerProps {
	width?: number;
	height?: number;
}

// const groupColors = ["red", "green", "yellow", "blue", "purple", "white"];
const DEFAULT_CANDLE_COLOR = "white";

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
			{(sorting.status !== "Finished" ? sorting.array : sorting.history.moments[sorting.historyIndex].array).map((value, idx) => {
        let candleColor = DEFAULT_CANDLE_COLOR;
        const groups = sorting.status !== "Finished" ? sorting.groups : sorting.history.moments[sorting.historyIndex].groups;
        for (const [color, indices] of Object.entries(groups)) {
          if (indices?.some((indice) => indice === idx)) {
            candleColor = color;
            break;
          }
        }

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
