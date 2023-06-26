import { cn } from "@/lib/utils";
import { useSorter } from "@/context/Sorting";
import { observer } from "mobx-react-lite";

interface CandleProps {
	height: number;
}

const Candle = observer(
	({ height, ...props }: CandleProps & React.HTMLProps<HTMLDivElement>) => {
		const sorting = useSorter();
		return (
			<div className="flex flex-col">
				<div
					{...props}
					className={cn("border border-slate-400", props.className)}
					style={{ ...props.style, width: sorting.candleWidth, height }}
				/>
				{sorting.showCandleHeight && (
					<p className="flex text-xs justify-center opacity-50">{height}</p>
				)}
			</div>
		);
	}
);

export default Candle;
