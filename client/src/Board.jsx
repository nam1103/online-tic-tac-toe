import { useContext, useEffect, useState } from "react";
import { GameContext } from "./GameContext";

export default function Board() {
	const { currentRoomInfo, makeMove, userSocketId, rematch } =
		useContext(GameContext);
	const [chosenPos, setChosenPos] = useState(null);
	const [potentialChoosePos, setPotentialChoosePos] = useState(null);
	const [myScore, setMyScore] = useState(null);
	const [opponentScore, setOpponentScore] = useState(null);

	function handleMakeMove() {
		if (!currentRoomInfo.status) {
			if (currentRoomInfo.board[chosenPos] !== null) return;
			if (Object.keys(currentRoomInfo.members).length <= 1) return;
			if (userSocketId !== currentRoomInfo.playerTurn) return;
			makeMove(chosenPos);
		} else {
			rematch();
		}
		setChosenPos(null);
	}

	useEffect(() => {
		setMyScore(null);
		setOpponentScore(null);
		if (!currentRoomInfo?.members) return;
		if (!currentRoomInfo) return;
		Object.keys(currentRoomInfo.members).forEach((userId) => {
			if (userId === userSocketId) {
				setMyScore(currentRoomInfo.members[userId].score);
			} else {
				setOpponentScore(currentRoomInfo.members[userId].score);
			}
		});
	}, [currentRoomInfo]);

	return (
		<div className="flex flex-col items-center gap-4">
			{currentRoomInfo?.members &&
			Object.keys(currentRoomInfo.members).length >= 2 ? (
				<div className="flex gap-3 flex-col items-center">
					{myScore !== null && opponentScore !== null ? (
						<div className="flex items-center gap-4 font-extralight">
							<span className="text-4xl text-gray-600">{myScore}</span>
							<span className="text-4xl"> - </span>
							<span className="text-4xl text-gray-600 ">{opponentScore}</span>
						</div>
					) : (
						""
					)}

					<div className="flex items-center gap-2">
						<span className="font-bold text-2xl text-gray-600">
							{currentRoomInfo && currentRoomInfo?.status !== null
								? currentRoomInfo.status === "Tie"
									? "Tie"
									: currentRoomInfo.members[currentRoomInfo.playerWin].name
								: `${
										currentRoomInfo.members[currentRoomInfo.playerTurn] &&
										currentRoomInfo.members[currentRoomInfo.playerTurn].name
								  }`}
						</span>
						<span className="text-2xl font-light">
							{currentRoomInfo?.status !== null ? "Won" : "'s Turn"}
						</span>
					</div>
				</div>
			) : (
				<span className="text-xl font-extralight text-gray-600">
					Waiting for player...
				</span>
			)}

			<div className="grid grid-cols-3 gap-5 w-fit">
				{currentRoomInfo &&
					currentRoomInfo.board.map((cell, index) => {
						return (
							<div
								key={index}
								onMouseOver={() => {
									if (currentRoomInfo?.status) return;
									setPotentialChoosePos(index);
								}}
								onMouseLeave={() => {
									if (currentRoomInfo?.status) return;
									setPotentialChoosePos(null);
								}}
								className={`hover:bg-blue-400 ${
									currentRoomInfo &&
									currentRoomInfo.winningPos &&
									currentRoomInfo.winningPos.includes(index)
										? currentRoomInfo.playerWin === userSocketId
											? "bg-green-300"
											: "bg-red-300"
										: chosenPos === index
										? "bg-green-300"
										: ""
								} transition-all h-20 w-20 shadow-lg rounded-lg flex justify-center items-center text-gray-700 bg-[#ABDBEC]`}
								onClick={() => {
									if (currentRoomInfo.board[index] !== null) return;
									if (currentRoomInfo.playerTurn !== userSocketId) return;
									if (Object.keys(currentRoomInfo.members).length <= 1) return;
									if (currentRoomInfo.status) return;
									setChosenPos(index);
								}}
							>
								{cell !== null ? (
									cell === 0 ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="50"
											height="50"
											fill="currentColor"
											className="bi bi-x-lg"
											viewBox="0 0 16 16"
										>
											<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="40"
											height="40"
											fill="currentColor"
											className="bi bi-circle-fill"
											viewBox="0 0 16 16"
										>
											<circle cx="8" cy="8" r="8" />
										</svg>
									)
								) : chosenPos === index ? (
									currentRoomInfo.turn === 0 ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="50"
											height="50"
											fill="currentColor"
											className="bi bi-x-lg opacity-80"
											viewBox="0 0 16 16"
										>
											<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="40"
											height="40"
											fill="currentColor"
											className="bi bi-circle-fill opacity-80"
											viewBox="0 0 16 16"
										>
											<circle cx="8" cy="8" r="8" />
										</svg>
									)
								) : index === potentialChoosePos &&
								  currentRoomInfo.playerTurn === userSocketId ? (
									currentRoomInfo.turn === 0 ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="50"
											height="50"
											fill="currentColor"
											className="bi bi-x-lg opacity-10"
											viewBox="0 0 16 16"
										>
											<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="40"
											height="40"
											fill="currentColor"
											className="bi bi-circle-fill opacity-50"
											viewBox="0 0 16 16"
										>
											<circle cx="8" cy="8" r="8" />
										</svg>
									)
								) : (
									""
								)}
							</div>
						);
					})}
			</div>

			<button
				onClick={handleMakeMove}
				className={`text-gray-700 ${
					currentRoomInfo && currentRoomInfo.status
						? "bg-blue-300"
						: chosenPos === null
						? "bg-gray-400"
						: "bg-green-400"
				} text-lg p-2 px-4 rounded-3xl hover:px-10 shadow-lg hover:text-gray-200 transition-all hover:opacity-80`}
			>
				{`${
					currentRoomInfo && currentRoomInfo.status ? "Rematch" : "Make Move"
				}`}
			</button>
		</div>
	);
}
