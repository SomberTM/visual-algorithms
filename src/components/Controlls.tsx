import { useState } from "react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { randomArray } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { useSorter } from "./context/Sorting";
import { observer } from "mobx-react-lite";

export const SortButton = observer(() => {
	const sorting = useSorter();

	async function handleSortClicked() {
		sorting.status = "Sorting";
		const timeStart = performance.now();
		await sorting.algorithm.run.bind(sorting)();
		sorting.sortTime = performance.now() - timeStart;
		sorting.status = "Finished";
	}

	return (
		<Button disabled={sorting.status !== "Idle"} onClick={handleSortClicked}>
			Sort
		</Button>
	);
});
SortButton.displayName = "Sort Button";

export const CandleWidth = observer(() => {
	const sorting = useSorter();

	return (
		<div className="flex items-center gap-1">
			<Label>Candle Width</Label>
			<Input
				type="number"
				className="max-w-[6rem]"
				value={sorting.candleWidth}
				disabled={sorting.status === "Sorting"}
				onChange={(event) => (sorting.candleWidth = Number(event.target.value))}
			/>
		</div>
	);
});
CandleWidth.displayName = "Candle Width";

export const SortingStatus = observer(() => {
	const sorting = useSorter();

	return (
		<p>
			Status:{" "}
			<span
				className={`font-bold ${
					sorting.status === "Sorting" ? "text-red-500" : "text-green-600"
				}`}
			>
				{sorting.status}
			</span>
		</p>
	);
});
SortingStatus.displayName = "Sorting Status";

export const RandomizeArray = observer(() => {
	const sorting = useSorter();

	function handleRandomizeArray() {
		sorting.array = randomArray(sorting.numCandles, sorting.maxCandleHeight);
		sorting.status = "Idle";
	}

	return (
		<Button
			disabled={sorting.status === "Sorting"}
			onClick={handleRandomizeArray}
		>
			Randomize Array
		</Button>
	);
});
RandomizeArray.displayName = "Randomize Array";

export const SortingSpeed = observer(() => {
	const sorting = useSorter();

	return (
		<div className="flex items-center gap-1">
			<Label>Sorting Speed</Label>
			<Input
				type="number"
				className="max-w-[6rem]"
				value={sorting.speed}
				disabled={sorting.status === "Sorting"}
				onChange={(event) => (sorting.speed = Number(event.target.value))}
			/>
		</div>
	);
});
SortingSpeed.displayName = "Sorting Speed";

export const ShowAlgrotihm = observer(() => {
	const sorting = useSorter();

	return (
		<p>
			Algorithm:{" "}
			<span className="font-bold text-yellow-300">
				{sorting.algorithm.displayName}
			</span>
		</p>
	);
});
ShowAlgrotihm.displayName = "Show Algorithm";

export const NumCandles = observer(() => {
	const sorting = useSorter();

	function onNumCandlesChange(event: React.ChangeEvent<HTMLInputElement>) {
		const newNumCandles = Number(event.target.value);
		if (newNumCandles < sorting.numCandles) {
			sorting.array = sorting.array.slice(0, newNumCandles);
		} else {
			sorting.status = "Idle";
			for (let i = 0; i < newNumCandles - sorting.numCandles; i++)
				sorting.array.push(Math.floor(Math.random() * sorting.maxCandleHeight));
		}

		sorting.numCandles = newNumCandles;
	}

	return (
		<div className="flex items-center gap-1">
			<Label>Candles</Label>
			<Input
				type="number"
				className="max-w-[6rem]"
				value={sorting.numCandles}
				disabled={sorting.status === "Sorting"}
				onChange={onNumCandlesChange}
			/>
		</div>
	);
});
NumCandles.displayName = "Num Candles";

export const MaxCandleHeight = observer(() => {
	const sorting = useSorter();

	function onMaxCandleHeightChange(event: React.ChangeEvent<HTMLInputElement>) {
		const newMaxCandleHeight = Number(event.target.value);
		let deltaHeight = newMaxCandleHeight - sorting.maxCandleHeight;
		if (deltaHeight < 0) {
			deltaHeight = -deltaHeight;
			for (let i = 0; i < sorting.array.length; i++) {
				if (sorting.array[i] - deltaHeight > newMaxCandleHeight)
					sorting.array[i] -= deltaHeight;
			}
		}

		sorting.maxCandleHeight = newMaxCandleHeight;
	}

	return (
		<div className="flex items-center gap-1">
			<Label>Max Candle Height</Label>
			<Input
				type="number"
				className="max-w-[6rem]"
				value={sorting.maxCandleHeight}
				disabled={sorting.status === "Sorting"}
				onChange={onMaxCandleHeightChange}
			/>
		</div>
	);
});
MaxCandleHeight.displayName = "Max Candle Height";

export const SortTime = observer(() => {
	const sorting = useSorter();

	return (
		<p>
			Time:{" "}
			{sorting.status === "Idle" && <span className="font-bold">Waiting</span>}
			{sorting.status === "Sorting" && (
				<span className="font-bold">Processing</span>
			)}
			{sorting.status === "Finished" && (
				<span className="font-bold">
					{sorting.sortTime}
					<span className="opacity-50">ms</span>
				</span>
			)}
		</p>
	);
});
SortTime.displayName = "Sort Time";

export const ShowCandleHeight = observer(() => {
	const sorting = useSorter();

	return (
		<div className="flex items-center gap-1">
			<Label>Show Candle Height</Label>
			<Checkbox
				className="max-w-[6rem]"
				checked={sorting.showCandleHeight}
				onCheckedChange={() =>
					(sorting.showCandleHeight = !sorting.showCandleHeight)
				}
			/>
		</div>
	);
});
ShowCandleHeight.displayName = "Show Candle Height";

interface ControllsMenuProps {
	initialControlls: ControllElement[];
	onControllsChange: (controlls: ControllElement[]) => void;
}

function ControllsMenu({
	initialControlls,
	onControllsChange,
}: ControllsMenuProps) {
	function onCheckedControllChange(
		checked: boolean,
		controll: ControllElement
	) {
		if (checked) onControllsChange([...initialControlls, controll]);
		else {
			const newControlls = [...initialControlls];
			newControlls.splice(
				newControlls.findIndex((c) => c.displayName === controll.displayName),
				1
			);
			onControllsChange(newControlls);
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>Manage Controlls</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Controlls</DropdownMenuLabel>
				{allControls.map((controll, idx) => (
					<DropdownMenuCheckboxItem
						key={idx}
						checked={
							initialControlls.findIndex((c) => {
								return c.displayName === controll.displayName;
							}) >= 0
						}
						onCheckedChange={(checked) =>
							onCheckedControllChange(checked, controll)
						}
					>
						{controll.displayName}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

type ControllElement = (() => JSX.Element) & {
	displayName: string;
};

const allControls = [
	SortButton,
	SortingStatus,
	SortingSpeed,
	RandomizeArray,
	CandleWidth,
	NumCandles,
	MaxCandleHeight,
	ShowAlgrotihm,
	SortTime,
	ShowCandleHeight,
];
const allControlNames = allControls.map(({ displayName }) => displayName);

const Controlls = observer(({ children }: React.PropsWithChildren) => {
	let initialControlls: ControllElement[] = [];
	if (children) {
		if (!Array.isArray(children)) children = [children];
		const childrenArray: React.ReactNode[] = children as React.ReactNode[];
		initialControlls = childrenArray
			.filter(
				(child: any) =>
					child["type"] &&
					allControlNames.includes(child["type"]["displayName"])
			)
			.map((child: any) => child["type"]) as ControllElement[];
	}

	const [controlls, setControlls] =
		useState<ControllElement[]>(initialControlls);

	return (
		<div className="flex lg:flex-row flex-col lg:justify-between p-4 items-center border rounded-lg">
			<div className="flex md:flex-row flex-col gap-2 md:gap-4 items-center">
				{controlls.map((Controll, idx) => (
					<Controll key={idx} />
				))}
			</div>
			<div className="rounded-lg border px-4 py-2">
				<ControllsMenu
					initialControlls={controlls}
					onControllsChange={setControlls}
				/>
			</div>
		</div>
	);
});

export default Controlls;
