import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const GameContext = createContext();

export function GameContextProvider({ children }) {
	const [socket, setSocket] = useState(null);
	const [isRegister, setIsRegister] = useState(false);
	const [isPlay, setIsPlay] = useState(false);
	const [userSocketId, setUserSocketId] = useState(null);
	const [name, setName] = useState(null);
	const [rooms, setRooms] = useState(null);
	const [messages, setMessages] = useState(null);
	const [currentRoomInfo, setCurrentRoomInfo] = useState(null);

	useEffect(() => {
		const newSocket = io("https://online-tic-tac-toe-socket.onrender.com");

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!socket) return;
		socket.on("update-room", (roomData) => {
			setRooms(roomData);
		});

		socket.on("getId", (id) => {
			setUserSocketId(id);
		});

		socket.on("update-current-room", (newRoomData) => {
			setCurrentRoomInfo(newRoomData);
			console.log("received");
		});

		socket.on("get-messages", (messagesData) => {
			setMessages(messagesData);
		});

		return () => {
			socket.off("update-room");
			socket.off("getId");
			socket.off("update-current-room");
			socket.off("get-messages");
		};
	}, [socket]);

	function addUser(name) {
		socket.emit("add-player", { name });
		setName(name);
		setIsRegister(true);
	}

	function createRoom(roomInfo) {
		socket.emit("create-room", roomInfo);
		setIsPlay(true);
	}

	function joinRoom(roomName) {
		socket.emit("join-room", roomName);
		setIsPlay(true);
	}

	function sendRoomMessage(message) {
		socket.emit("send-room-message", {
			...message,
			roomName: currentRoomInfo.name,
		});
	}

	function makeMove(pos) {
		socket.emit("make-move", { pos, roomName: currentRoomInfo.name });
	}

	function leaveRoom() {
		socket.emit("leave-room", currentRoomInfo.name);
		setCurrentRoomInfo(null);
		setIsPlay(false);
	}

	function rematch() {
		socket.emit("rematch", currentRoomInfo.name);
	}

	function sendLobbyMessage(newMessage) {
		socket.emit("send-message", { text: newMessage, name });
	}

	function leaveGame() {
		socket.emit("leave");
		setIsRegister(false);
		setName(null);
		setUserSocketId(null);
	}

	return (
		<GameContext.Provider
			value={{
				rematch,
				addUser,
				name,
				isRegister,
				createRoom,
				rooms,
				joinRoom,
				currentRoomInfo,
				userSocketId,
				sendRoomMessage,
				isPlay,
				makeMove,
				leaveRoom,
				messages,
				sendLobbyMessage,
				leaveGame,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}
