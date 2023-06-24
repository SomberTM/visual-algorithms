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

function SortButton() {
	const sorting = useSortingContext();

	async function handleSortClicked() {
		sorting.status("Sorting");
		await sorting.algorithm(sorting.array, sorting.speed());
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
		sorting.array(randomArray(sorting.numCandles(), sorting.maxCandleHeight()))
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
			Algorithm: <span className="font-bold text-yellow-300">{sorting.algorithm.name}</span>
		</p>
	);
}

function NumCandles() {
  const sorting = useSortingContext();

  function onNumCandlesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newNumCandles = Number(event.target.value)
    sorting.numCandles((oldCandles) => {
      if (newNumCandles < oldCandles) {
        sorting.array((oldArray) => {
          const newArray = [...oldArray];
          return newArray.slice(0, newNumCandles);
        })
      } else {
        sorting.array((oldArray) => {
          const newArray = [...oldArray];
          for (let i = 0; i < newNumCandles - oldCandles; i++)
            newArray.push(Math.floor(Math.random() * sorting.maxCandleHeight()))
          return newArray
        })
      }

      return newNumCandles;
    })
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
    const newMaxCandleHeight = Number(event.target.value)
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
        })
      }

      return newMaxCandleHeight;
    })
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
						{controll.name}
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
];
const allControlNames = allControls.map(({ name }) => name);

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
		<div className="flex justify-between p-4 items-center border rounded-lg">
			<div className="flex gap-4 items-center">
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
