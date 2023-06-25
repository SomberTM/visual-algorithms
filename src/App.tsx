import Sorting from "@/components/Sorting";
import { Signal, swap } from "@/lib/utils";

async function bubbleSort(array: Signal<number[]>, speed = 100) {
	const localArray = [...array()];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let swapped = false;
    for (let i = 1; i < localArray.length; i++) {
      if (localArray[i - 1] > localArray[i]) {
        array([...swap(localArray, i - 1, i)])
        swapped = true;
        await new Promise((resolve) => setTimeout(resolve, speed));
      }
    }
    if (!swapped) break;
  }
}

function App() {
	return (
		<main className="p-2 flex flex-col gap-4 min-h-[100dvh] bg-background">
			<Sorting algorithm={{ run: bubbleSort, displayName: "Bubble Sort" }}>
				<Sorting.Controlls>
          <Sorting.Controlls.NumCandles />
          <Sorting.Controlls.MaxCandleHeight />
          <Sorting.Controlls.CandleWidth />
          <Sorting.Controlls.SortingSpeed />
          <Sorting.Controlls.RandomizeArray />
					<Sorting.Controlls.SortButton />
          <Sorting.Controlls.SortingStatus />
				</Sorting.Controlls>
				<Sorting.Visualizer />
			</Sorting>
			<Sorting algorithm={{ run: bubbleSort, displayName: "Bubble Sort" }}>
				<Sorting.Controlls>
					<Sorting.Controlls.SortButton />
				</Sorting.Controlls>
				<Sorting.Visualizer />
			</Sorting>
		</main>
	);
}

export default App;
