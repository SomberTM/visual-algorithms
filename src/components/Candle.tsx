import { useSortingContext } from "@/context/Sorting";
import { cn } from "@/lib/utils";

interface CandleProps {
	height: number;
}

export default function Candle({
	height,
	...props
}: CandleProps & React.HTMLProps<HTMLDivElement>) {
	const sorting = useSortingContext();
	return (
    <div className="flex flex-col">
      <div
        {...props}
        className={cn("border border-slate-400", props.className)}
        style={{ ...props.style, width: sorting.candleWidth(), height }}
      />
      <p className="flex text-xs justify-center opacity-50">{height}</p>
    </div>
	);
}
