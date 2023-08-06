import { useContext, useEffect, useState } from "react";
import { GameContext } from "./GameContext";
import { useNavigate } from "react-router-dom";
import GameChat from "./GameChat";
import Board from "./Board";

export default function Match() {
	const { currentRoomInfo, isRegister, isPlay, userSocketId, leaveRoom } =
		useContext(GameContext);
	const [OpponentInfo, setOpponentInfo] = useState(null);
	const [UserInfo, setUserInfo] = useState(null);
	const navigate = useNavigate();

	function handleLeaveRoom() {
		leaveRoom();
	}

	useEffect(() => {
		if (!isRegister) return navigate("/");
	}, []);

	useEffect(() => {
		if (isPlay) return;
		return navigate("/rooms");
	}, [isPlay]);

	useEffect(() => {
		if (!currentRoomInfo) return;

		setOpponentInfo(null);
		Object.keys(currentRoomInfo.members).forEach((socketId) => {
			if (socketId == userSocketId) {
				setUserInfo(currentRoomInfo.members[socketId]);
			} else {
				setOpponentInfo(currentRoomInfo.members[socketId]);
			}
		});
	}, [currentRoomInfo]);

	return (
		<div className="h-screen bg-[#C8E7F2] flex flex-col gap-10 justify-center items-center lg:px-32 md:px-10">
			<div className="flex w-full flex-col h-3/4 max-w-3xl rounded-3xl shadow-2xl">
				<div className="px-14 w-full rounded-tr-2xl rounded-tl-2xl h-12 bg-gray-700 text-white font-bold text-3xl flex justify-between items-center">
					{currentRoomInfo && UserInfo && <span>{UserInfo.name}</span>}
					<span className="font-light text-xl">VS</span>
					{currentRoomInfo && OpponentInfo ? (
						<span>{OpponentInfo.name}</span>
					) : (
						<span>...</span>
					)}
				</div>
				<div className="flex flex-grow overflow-y-scroll gap-6">
					<div className="w-2/3 rounded-b-2xl bg-white flex justify-center items-center">
						<Board />
					</div>
					<GameChat />
				</div>
			</div>
			<button
				onClick={handleLeaveRoom}
				className="w-1/2 shadow-xl hover:bg-red-500 hover:text-gray-300 text-gray-800 transition-all font-light text-2xl bg-red-400 py-3 rounded-full"
			>
				Leave Room
			</button>
		</div>
	);
}
