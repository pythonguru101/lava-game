import React, {
	createContext,
	useState,
	useContext,
	Dispatch,
	SetStateAction,
	useEffect,
} from "react";

export interface IGameProviderProps {
	children: React.ReactNode;
}

export type IGrid = string[][];

// Interface for game context
export interface IGameState {
	grid: IGrid | null;
	setGrid: Dispatch<SetStateAction<IGrid | null>>;
	gridState: string[];
	setGridState: Dispatch<SetStateAction<string[]>>;
	playerXPos: number;
	setPlayerXPos: Dispatch<SetStateAction<number>>;
	playerYPos: number;
	setPlayerYPos: Dispatch<SetStateAction<number>>;
	playerHealth: number;
	setPlayerHealth: Dispatch<SetStateAction<number>>;
	playerMoves: number;
	setPlayerMoves: Dispatch<SetStateAction<number>>;
	resetGame: () => void;
	moveRight: () => void;
	moveLeft: () => void;
	moveUp: () => void;
	moveDown: () => void;
}

// Create game context
const GameContext = createContext<null | IGameState>(null);

// Create game context provider
export const GameContextProvider = ({ children }: IGameProviderProps) => {
	const [grid, setGrid] = useState<IGrid | null>(null);
	const [gridState, setGridState] = useState<string[]>([
		"Blank",
		"Speeder",
		"Lava",
		"Mud",
	]);
	const [playerXPos, setPlayerXPos] = useState<number>(0);
	const [playerYPos, setPlayerYPos] = useState<number>(0);
	const [playerHealth, setPlayerHealth] = useState<number>(20);
	const [playerMoves, setPlayerMoves] = useState<number>(45);

	// Set 2d grids
	useEffect(() => {
		setGrid(create2DArray(10, 10, gridState));
	}, []);

	// Reset game in any position
	const resetGame = (): void => {
		setPlayerXPos(0);
		setPlayerYPos(0);
		setPlayerHealth(20);
		setPlayerMoves(45);
	};

	// When player move down
	const moveDown = (): void => {
		if (playerXPos !== 9) {
			if (playerHealth > 0 && playerMoves > 0) {
				setPlayerXPos(playerXPos + 1);
				reducePoint(
					playerHealth,
					playerMoves,
					playerXPos + 1,
					playerYPos
				);
			}
		}
	};

	// When player move up
	const moveUp = (): void => {
		if (playerXPos !== 0) {
			if (playerHealth > 0 && playerMoves > 0) {
				setPlayerXPos(playerXPos - 1);
				reducePoint(
					playerHealth,
					playerMoves,
					playerXPos - 1,
					playerYPos
				);
			}
		}
	};

	// When player move left
	const moveLeft = (): void => {
		if (playerYPos !== 0) {
			if (playerHealth > 0 && playerMoves > 0) {
				setPlayerYPos(playerYPos - 1);
				reducePoint(
					playerHealth,
					playerMoves,
					playerXPos,
					playerYPos - 1
				);
			}
		}
	};

	// When player move right
	const moveRight = (): void => {
		if (playerYPos !== 9) {
			if (playerHealth > 0 && playerMoves > 0) {
				setPlayerYPos(playerYPos + 1);
				reducePoint(
					playerHealth,
					playerMoves,
					playerXPos,
					playerYPos + 1
				);
			}
		}
	};

	// Point reduction logic
	// If blank: moves: -1, health: 0
	// If speeder: moves: 0, health: -2
	// If lava: moves: -2, health: -5
	// If mud: moves: -1, health: -2
	const reducePoint = (
		health: number,
		moves: number,
		x: number,
		y: number
	) => {
		if (grid && grid[x][y] === "Blank") {
			setPlayerMoves(moves - 1);
		} else if (grid && grid[x][y] === "Speeder") {
			setPlayerHealth(health - 2);
		} else if (grid && grid[x][y] === "Lava") {
			setPlayerHealth(health - 5);
			setPlayerMoves(moves - 2);
		} else if (grid && grid[x][y] === "Mud") {
			setPlayerHealth(health - 2);
			setPlayerMoves(moves - 1);
		}
	};

	return (
		<GameContext.Provider
			value={{
				grid,
				setGrid,
				gridState,
				setGridState,
				playerXPos,
				setPlayerXPos,
				playerYPos,
				setPlayerYPos,
				playerHealth,
				setPlayerHealth,
				playerMoves,
				setPlayerMoves,
				resetGame,
				moveRight,
				moveLeft,
				moveUp,
				moveDown,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

// Hook for using game context
export const useGame = () => {
	const gameContext = useContext(GameContext);

	if (!gameContext)
		throw new Error("You need to use this context inside a provider.");

	return gameContext;
};

// Helper function for creating 2d grids
const create2DArray = (
	rows: number,
	columns: number,
	filler: string[]
): string[][] => {
	const arr: string[][] = [];

	for (let i = 0; i < rows; i++) {
		arr[i] = [];

		for (let j = 0; j < columns; j++) {
			if ((i === 0 && j === 0) || (i === rows - 1 && j === rows - 1)) {
				arr[i][j] = "Blank";
			} else {
				arr[i][j] = filler[Math.floor(Math.random() * filler.length)];
			}
		}
	}

	return arr;
};
