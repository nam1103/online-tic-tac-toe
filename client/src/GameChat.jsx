import { useContext, useState } from "react";
import { GameContext } from "./GameContext";

export default function GameChat() {
	const [message, setMessage] = useState("");
	const { sendRoomMessage, userSocketId, currentRoomInfo } =
		useContext(GameContext);

	function handleSubmit(event) {
		event.preventDefault();
		if (!message) return;
		sendRoomMessage({ message, senderId: userSocketId });
		setMessage("");
	}
	return (
		<div className="flex flex-col w-1/2 h-full gap-6">
			<div className="flex-grow flex p-3 flex-col gap-5 overflow-y-scroll bg-white rounded-br-2xl rounded-bl-2xl">
				{currentRoomInfo &&
					currentRoomInfo.messages.map((message, index) => {
						return (
							<div
								className={`w-fit px-4 py-2 rounded-3xl text-lg text-gray-700 shadow-lg ${
									message.senderId == userSocketId
										? "bg-green-300 self-end"
										: "bg-blue-200 self-start"
								}`}
								key={index}
							>
								{message.message}
							</div>
						);
					})}
			</div>

			<form
				onSubmit={handleSubmit}
				className="flex items-center w-full justify-center p-5 bg-white  rounded-2xl"
			>
				<div className="rounded-lg shadow-lg">
					<input
						value={message}
						onChange={(event) => setMessage(event.target.value)}
						type="text"
						className="text-gray-700 outline-none px-3 py-1 border rounded-bl-lg rounded-tl-lg border-blue-400"
					/>
					<button className="bg-[#BCF4F5] p-1 px-2 text-gray-700 border-blue-400 rounded-br-lg rounded-tr-lg border hover:bg-blue-400 transition-all">
						Send
					</button>
				</div>
			</form>
		</div>
	);
}
