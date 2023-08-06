import { useContext, useEffect, useState } from "react";
import { GameContext } from "./GameContext";
import { useNavigate } from "react-router-dom";
import LobbyChat from "./LobbyChat";

export default function JoinRoom() {
	const { isRegister, name, createRoom, rooms, joinRoom, isPlay, leaveGame } =
		useContext(GameContext);
	const [isCreateRoom, setIsCreateRoom] = useState(false);
	const [isEnterRoomPassword, setIsEnterRoomPassword] = useState(false);
	const [roomPassword, setRoomPassword] = useState("");
	const [potentialJoinRoom, setPotentialJoinRoom] = useState(null);
	const [isChatting, setIsChatting] = useState(false);

	const [roomInfo, setRoomInfo] = useState({
		mode: "private",
		roomPassword: "",
		roomName: "",
	});
	const navigate = useNavigate();

	function handleCreateRoom(event) {
		event.preventDefault();
		setIsCreateRoom(false);
		createRoom(roomInfo);
		setRoomInfo({
			mode: "private",
			roomPassword: "",
			roomName: "",
		});
	}

	function handleJoinRoom(name) {
		if (rooms[name].mode === "public") {
			joinRoom(name);
		} else {
			setPotentialJoinRoom(name);
			setIsEnterRoomPassword(true);
		}
	}
	function handleJoinPrivateRoom(event) {
		event.preventDefault();
		if (roomPassword === rooms[potentialJoinRoom].password) {
			joinRoom(potentialJoinRoom);
			setRoomPassword("");
		}
	}

	function handleLeaveGame() {
		leaveGame();
	}

	useEffect(() => {
		if (!isRegister) navigate("/");
	}, [isRegister]);

	useEffect(() => {
		if (!isPlay) return;
		return navigate("/match");
	}, [isPlay]);

	return (
		<div className="h-screen bg-[#C8E7F2] flex flex-col gap-7 justify-center items-center">
			<div className="w-2/3 h-3/4 max-w-xl flex flex-col shadow-2xl rounded-2xl">
				<div className="w-full p-3 bg-gray-600 rounded-tr-2xl rounded-tl-2xl flex justify-around">
					<span className="font-bold text-lg text-white">{name}</span>
					<button
						className="text-sm bg-green-500 text-white rounded-full px-2 hover:bg-blue-500 transition-all"
						onClick={() => {
							setIsCreateRoom(!isCreateRoom);
							setIsEnterRoomPassword(false);
						}}
					>
						Create Room
					</button>
				</div>
				<div
					className={`flex flex-col flex-grow ${
						isCreateRoom && "justify-center items-center"
					} bg-white rounded-br-2xl rounded-bl-2xl overflow-y-scroll`}
				>
					{isCreateRoom ? (
						<form
							onSubmit={handleCreateRoom}
							className="w-3/4 p-6 rounded-2xl bg-blue-300 flex flex-col items-center gap-5 shadow-lg"
						>
							<input
								value={roomInfo.roomName}
								onChange={(event) =>
									setRoomInfo({ ...roomInfo, roomName: event.target.value })
								}
								type="text"
								placeholder="Room Name"
								className="text-center rounded-lg shadow-lg p-2 outline-none w-full "
							/>
							<div className="flex rounded-lg shadow-lg w-full">
								<button
									type="button"
									className={`text-sm w-24 rounded-bl-lg rounded-tl-lg ${
										roomInfo.mode === "private"
											? "bg-gray-200 font-bold"
											: "bg-green-200"
									}`}
									onClick={() =>
										setRoomInfo({
											...roomInfo,
											mode: `${
												roomInfo.mode === "private" ? "public" : "private"
											}`,
										})
									}
								>
									{roomInfo.mode}
								</button>
								<input
									value={roomInfo.roomPassword}
									onChange={(event) =>
										setRoomInfo({
											...roomInfo,
											roomPassword: event.target.value,
										})
									}
									type="text"
									placeholder="Room Password"
									disabled={roomInfo.mode === "public"}
									className="text-center rounded-tr-lg rounded-br-lg p-2 outline-none w-full"
								/>
							</div>

							<button
								className="px-8 py-2 bg-green-200 rounded-lg shadow-lg"
								type="submit"
							>
								Create
							</button>
							<button
								className="p-2 bg-gray-100 rounded-lg shadow-lg"
								type="button"
								onClick={() => setIsCreateRoom(false)}
							>
								Cancel
							</button>
						</form>
					) : isEnterRoomPassword ? (
						<div className="h-full flex flex-col justify-center items-center gap-10 bg-white">
							<span className="text-5xl font-extralight text-gray-600">
								{potentialJoinRoom && potentialJoinRoom}
							</span>
							<form
								onSubmit={handleJoinPrivateRoom}
								className="shadow-2xl p-14 rounded-2xl bg-blue-300 flex gap-5 flex-col justify-center items-center"
							>
								<input
									value={roomPassword}
									type="password"
									onChange={(event) => setRoomPassword(event.target.value)}
									className="shadow-lg text-center rounded-lg p-3 outline-none"
									placeholder="password"
								/>
								<button
									className="shadow-lg bg-green-200 text-2xl text-gray-700 rounded-full px-14 hover:px-20 transition-all py-2"
									type="submit"
								>
									Join
								</button>
								<button
									type="button"
									onClick={() => {
										setIsEnterRoomPassword(false);
										setRoomPassword("");
									}}
									className="bg-red-400 px-4 py-2 hover:bg-red-500 transition-all text-gray-800 hover:text-gray-200  rounded-full shadow-lg"
								>
									Cancel
								</button>
							</form>
						</div>
					) : isChatting ? (
						<LobbyChat />
					) : (
						<div className="h-full flex flex-col gap-6">
							{rooms !== null &&
								Object.keys(rooms).map((name, index) => {
									return (
										<div
											className="p-4 bg-[#ABDBEC] flex items-center shadow-lg gap-10 hover:bg-blue-500 hover:text-white transition-all"
											key={index}
										>
											<div className="flex-grow flex justify-between">
												<span className="text-gray-500 text-lg font-bold">
													{name}
												</span>
												<span
													className={`text-sm italic ${
														rooms[name].members.length >= 2 && "text-red-500"
													}`}
												>
													{Object.keys(rooms[name].members).length}/2
												</span>
											</div>
											<button
												className={`text-sm ${
													Object.keys(rooms[name].members).length >= 2
														? "bg-blue-900 text-white"
														: "bg-green-400"
												} p-2 px-5 rounded-full shadow-lg hover:px-8 transition-all`}
												onClick={() => handleJoinRoom(name)}
											>
												{Object.keys(rooms[name].members).length >= 2
													? "Spectate"
													: "Play"}
											</button>
										</div>
									);
								})}
						</div>
					)}
				</div>
			</div>
			<div className="flex rounded-full shadow-lg text-gray-600">
				<button
					onClick={() => {
						setIsChatting(!isChatting);
					}}
					className="bg-green-300 hover:pl-32 hover:bg-green-500  hover:text-gray-500 transition-all text-2xl px-14 py-3 rounded-l-full"
				>
					{isChatting ? "Rooms" : "Chat"}
				</button>
				<button
					onClick={handleLeaveGame}
					className="bg-red-300 hover:pr-32 hover:text-gray-300 hover:bg-red-500 transition-all text-2xl px-12 py-3 rounded-r-full"
				>
					Leave
				</button>
			</div>
		</div>
	);
}
