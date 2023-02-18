import React, { ReactElement, useCallback, useEffect, useState } from "react";
import "./GameBoard.css";
import { useGame } from "../context/GameContextProvider";
import speeder from "../assets/arrow.png";
import lava from "../assets/lava.png";
import mud from "../assets/mud.jpg";
import useKeyPress from "../hooks/useKeyPress";

const GameBoard = () => {
	const game = useGame();
	const [board, setBoard] = useState<ReactElement[]>();
	const [result, setResult] = useState("Game is running.");

	const buildBoard = (grids: string[][]): ReactElement[] => {
		const boardUI: ReactElement[] = [];

		for (let vAxis = 0; vAxis < grids?.length; vAxis++) {
			for (let hAxis = 0; hAxis < grids[vAxis].length; hAxis++) {
				if (grids[vAxis][hAxis] === "Blank") {
					boardUI.push(<span className="tile blackTile"></span>);
				} else if (grids[vAxis][hAxis] === "Speeder") {
					boardUI.push(
						<span className="tile">
							<img src={speeder} alt="" className="tile" />
						</span>
					);
				} else if (grids[vAxis][hAxis] === "Lava") {
					boardUI.push(
						<span className="tile">
							<img src={lava} alt="" className="tile" />
						</span>
					);
				} else if (grids[vAxis][hAxis] === "Mud") {
					boardUI.push(
						<span className="tile">
							<img src={mud} alt="" className="tile" />
						</span>
					);
				}
			}
		}
		return boardUI;
	};

	useEffect(() => {
		if (game.grid) {
			const boardUI: ReactElement[] = buildBoard(game.grid);
			setBoard(boardUI);
		}
	}, [game.grid]);

	useEffect(() => {
		if (game.grid) {
			const gridIndex = game.playerXPos * 10 + game.playerYPos;
			const newBoard: ReactElement[] = buildBoard(game.grid);
			newBoard.splice(
				gridIndex,
				1,
				<span className="tile redTile"></span>
			);
			setBoard(newBoard);
		}
	}, [game.grid, game.playerXPos, game.playerYPos]);

	useEffect(() => {
		if (game.playerXPos === 9 && game.playerYPos === 9) {
			setResult("Congratulation you have won the game!");
		}

		if (game.playerHealth <= 0 || game.playerMoves <= 0) {
			setResult("Sorry you have lost!")
			alert("Sorry you have lost!")
		}
	}, [game.playerXPos, game.playerYPos, game.playerHealth, game.playerMoves]);

	useKeyPress((key) => {
		if (key === "ArrowRight") game.moveRight();
		else if (key === "ArrowLeft") game.moveLeft();
		else if (key === "ArrowUp") game.moveUp();
		else if (key === "ArrowDown") game.moveDown();
	});

	return (
		<>
			<div>
				<p>X pos: {game.playerYPos}</p>
				<p>Y pos: {game.playerXPos}</p>
				<p>
					Grid:{" "}
					{game.grid && game.grid[game.playerXPos][game.playerYPos]}
				</p>
				<p>Player health left: {game.playerHealth}</p>
				<p>Player moves left: {game.playerMoves}</p>
				<p>{result}</p>
				<button onClick={game.moveLeft}>Move left</button>
				<button onClick={game.moveRight}>Move right</button>
				<button onClick={game.moveUp}>Move up</button>
				<button onClick={game.moveDown}>Move down</button>
				<button onClick={game.resetGame}>Reset game</button>
			</div>
			<div className="lavaBoard">{board}</div>
		</>
	);
};

export default GameBoard;
