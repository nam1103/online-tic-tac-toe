import { useContext, useState } from "react";
import { GameContext } from "./GameContext";

export default function LobbyChat() {
	const [message, setMessage] = useState("");
	const { sendLobbyMessage, messages, userSocketId } = useContext(GameContext);
	function handleSubmit(event) {
		event.preventDefault();
		sendLobbyMessage(message);
		setMessage("");
	}

	return (
		<div className="flex flex-col h-full bg-[#C8E7F2] overflow-y-scroll gap-10">
			<div className="shadow-2xl overflow-y-scroll max-w-full overflow-hidden flex flex-col p-5 flex-grow gap-5 bg-white">
				{messages &&
					messages.map((message, index) => {
						return message.notification ? (
							<div
								key={index}
								className="text-sm font-bold text-gray-600 self-center"
							>
								{message.text}
							</div>
						) : (
							<div
								key={index}
								className={`max-w-full flex flex-col px-4 py-2 rounded-2xl items-center shadow-lg ${
									message.userId === userSocketId
										? "self-end bg-green-300"
										: "self-start bg-blue-300"
								}`}
							>
								<span className="text-gray-600 font-bold">{message.name}</span>
								<p className="max-w-full text-lg text-gray-700 font-light overflow-auto">
									{message.text}
								</p>
							</div>
						);
					})}
			</div>
			<form
				onSubmit={handleSubmit}
				className="shadow-2xl flex py-5 px-10 items-center bg-white text-gray-700"
			>
				<input
					type="text"
					value={message}
					onBlur={() => setTimeout(() => setMessage(""), 100)}
					onChange={(event) => {
						if (event.target.value.length >= 50) return;
						setMessage(event.target.value);
					}}
					placeholder="type your message here..."
					className="shadow-lg flex-grow py-1 rounded-l-full border-2 border-blue-300 text-lg px-5 outline-none"
				/>
				<button className="hover:bg-blue-300 transition-all text-center bg-[#C8E7F2] shadow-lg ml-0 border-2 border-blue border-l-0 border-blue-300 text-lg py-1 pr-5 pl-3 rounded-r-full">
					Send
				</button>
			</form>
		</div>
	);
}
