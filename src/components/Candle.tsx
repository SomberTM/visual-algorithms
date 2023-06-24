import { useSortingContext } from "@/context/Sorting";

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
        className="bg-white border border-slate-400"
        style={{ width: sorting.candleWidth(), height }}
      />
      <p className="flex text-xs justify-center opacity-50">{height}</p>
    </div>
	);
}
