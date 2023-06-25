import { useEffect, useState } from "react";
import { useSortingContext } from "@/context/Sorting";
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

function SortButton() {
	const sorting = useSortingContext();

	async function handleSortClicked() {
		sorting.status("Sorting");
		const timeStart = performance.now();
		await sorting.algorithm.run.bind(sorting)();
		sorting.sortTime(performance.now() - timeStart);
		sorting.status("Finished");
	}

	return (
		<Button disabled={sorting.status() !== "Idle"} onClick={handleSortClicked}>
			Sort
		</Button>
	);
}

function CandleWidth() {
	const sorting = useSortingContext();

	return (
		<div className="flex items-center gap-1">
			<Label>Candle Width</Label>
			<Input
				type="number"
				className="max-w-[6rem]"
				value={sorting.candleWidth()}
				disabled={sorting.status() === "Sorting"}
				onChange={(event) => sorting.candleWidth(Number(event.target.value))}
			/>
		</div>
	);
}

function SortingStatus() {
	const sorting = useSortingContext();

	return (
		<p>
			Status:{" "}
			<span
				className={`font-bold ${
					sorting.status() === "Sorting" ? "text-red-500" : "text-green-600"
				}`}
			>
				{sorting.status()}
			</span>
		</p>
	);
}

function RandomizeArray() {
	const sorting = useSortingContext();

	function handleRandomizeArray() {
		sorting.array(randomArray(sorting.numCandles(), sorting.maxCandleHeight()));
		sorting.status("Idle");
	}

	return (
		<Button
			disabled={sorting.status() === "Sorting"}
			onClick={handleRandomizeArray}
		>
			Randomize Array
		</Button>
	);
}

function SortingSpeed() {
	const sorting = useSortingContext();

	return (
		<div className="flex items-center gap-1">
			<Label>Sorting Speed</Label>
			<Input
				type="number"
				className="max-w-[6rem]"
				value={sorting.speed()}
				disabled={sorting.status() === "Sorting"}
				onChange={(event) => sorting.speed(Number(event.target.value))}
			/>
		</div>
	);
}

function ShowAlgrotihm() {
	const sorting = useSortingContext();

	return (
		<p>
			Algorithm:{" "}
			<span className="font-bold text-yellow-300">
				{sorting.algorithm.displayName}
			</span>
		</p>
	);
}

function NumCandles() {
	const sorting = useSortingContext();

	function onNumCandlesChange(event: React.ChangeEvent<HTMLInputElement>) {
		const newNumCandles = Number(event.target.value);
		sorting.numCandles((oldCandles) => {
			if (newNumCandles < oldCandles) {
				sorting.array((oldArray) => {
					const newArray = [...oldArray];
					return newArray.slice(0, newNumCandles);
				});
			} else {
				sorting.status("Idle");
				sorting.array((oldArray) => {
					const newArray = [...oldArray];
					for (let i = 0; i < newNumCandles - oldCandles; i++)
						newArray.push(
							Math.floor(Math.random() * sorting.maxCandleHeight())
						);
					return newArray;
				});
			}

			return newNumCandles;
		});
	}

	return (
		<div className="flex items-center gap-1">
			<Label>Candles</Label>
			<Input
				type="number"
				className="max-w-[6rem]"
				value={sorting.numCandles()}
				disabled={sorting.status() === "Sorting"}
				onChange={onNumCandlesChange}
			/>
		</div>
	);
}

function MaxCandleHeight() {
	const sorting = useSortingContext();

	function onMaxCandleHeightChange(event: React.ChangeEvent<HTMLInputElement>) {
		const newMaxCandleHeight = Number(event.target.value);
		sorting.maxCandleHeight((oldMaxHeight) => {
			let deltaHeight = newMaxCandleHeight - oldMaxHeight;
			if (deltaHeight < 0) {
				deltaHeight = -deltaHeight;
				sorting.array((oldArray) => {
					const newArray = [...oldArray];
					for (let i = 0; i < newArray.length; i++) {
						if (newArray[i] - deltaHeight > newMaxCandleHeight) {
							newArray[i] -= deltaHeight;
						}
					}
					return newArray;
				});
			}

			return newMaxCandleHeight;
		});
	}

	return (
		<div className="flex items-center gap-1">
			<Label>Max Candle Height</Label>
			<Input
				type="number"
				className="max-w-[6rem]"
				value={sorting.maxCandleHeight()}
				disabled={sorting.status() === "Sorting"}
				onChange={onMaxCandleHeightChange}
			/>
		</div>
	);
}

function SortTime() {
	const sorting = useSortingContext();

	return (
		<p>
			Time:{" "}
      {sorting.status() === "Idle" && <span className="font-bold">Waiting</span>}
      {sorting.status() === "Sorting" && <span className="font-bold">Processing</span>}
			{sorting.status() === "Finished" && <span className="font-bold">{sorting.sortTime()}<span className="opacity-50">ms</span></span>}
		</p>
	);
}

function ShowCandleHeight() {
	const sorting = useSortingContext();

	return (
		<div className="flex items-center gap-1">
			<Label>Show Candle Height</Label>
			<Checkbox
				className="max-w-[6rem]"
				checked={sorting.showCandleHeight()}
				onCheckedChange={() => sorting.showCandleHeight((old) => !old)}
			/>
		</div>
	);
}

interface ControllsMenuProps {
	initialControlls: ControllElement[];
	onControllsChange: (controlls: ControllElement[]) => void;
}

function ControllsMenu({
	initialControlls,
	onControllsChange,
}: ControllsMenuProps) {
	const [checkedControls, setCheckedControlls] =
		useState<ControllElement[]>(initialControlls);

	useEffect(() => {
		onControllsChange(checkedControls);
	}, [checkedControls, onControllsChange]);

	function onCheckedControllChange(
		checked: boolean,
		controll: ControllElement
	) {
		if (checked)
			setCheckedControlls((oldControlls) => [...oldControlls, controll]);
		else
			setCheckedControlls((oldControlls) => {
				const newControlls = [...oldControlls];
				newControlls.splice(
					newControlls.findIndex((c) => c.name === controll.name),
					1
				);
				return newControlls;
			});
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
							checkedControls.findIndex((c) => c.name === controll.name) >= 0
						}
						onCheckedChange={(checked) =>
							onCheckedControllChange(checked, controll)
						}
					>
						{controllNameMap.get(controll)}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

type ControllElement = () => JSX.Element;

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
const allControlNames = allControls.map(({ name }) => name);

const controllNameMap = new Map([
	[SortButton, "Sort Button"],
	[SortingStatus, "Sorting Status"],
	[SortingSpeed, "Sorting Speed"],
	[RandomizeArray, "Randomize Array"],
	[CandleWidth, "Candle Width"],
	[NumCandles, "Num Candles"],
	[MaxCandleHeight, "Max Candle Height"],
	[ShowAlgrotihm, "Show Algorithm"],
	[SortTime, "Sort Time"],
	[ShowCandleHeight, "Show Candle Height"],
]);

export default function Controlls({ children }: React.PropsWithChildren) {
	if (!Array.isArray(children)) children = [children];
	const childrenArray: React.ReactNode[] = children as React.ReactNode[];
	const initialControlls = childrenArray
		.filter(
			(child: any) =>
				child["type"] && allControlNames.includes(child["type"]["name"])
		)
		.map((child: any) => child["type"]) as any;

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
					initialControlls={initialControlls}
					onControllsChange={setControlls}
				/>
			</div>
		</div>
	);
}

Controlls.SortButton = SortButton;
Controlls.SortingStatus = SortingStatus;
Controlls.SortingSpeed = SortingSpeed;
Controlls.RandomizeArray = RandomizeArray;
Controlls.CandleWidth = CandleWidth;
Controlls.NumCandles = NumCandles;
Controlls.MaxCandleHeight = MaxCandleHeight;
Controlls.ShowAlgorithm = ShowAlgrotihm;
Controlls.ShowCandleHeight = ShowCandleHeight;
