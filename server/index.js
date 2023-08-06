const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

function addMessage(data) {
	messages.push(data);
	if (messages.length >= 150) {
		messages.shift();
	}
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const players = {};
const rooms = {};
const messages = [];

io.on("connection", (socket) => {
	socket.on("add-player", ({ name }) => {
		players[socket.id] = { name };
		socket.emit("update-room", rooms);
		socket.emit("getId", socket.id);
		addMessage({
			text: `Player ${players[socket.id].name} joined`,
			notification: true,
		});
		io.emit("get-messages", messages);
	});

	socket.on("create-room", (roomInfo) => {
		rooms[roomInfo.roomName] = {
			name: roomInfo.roomName,
			mode: roomInfo.mode,
			password: roomInfo.roomPassword,
			members: {},
			messages: [],
			board: Array(9).fill(null),
			turn: 0,
			playerTurn: null,
			status: null,
			winningPos: null,
			playerWin: null,
			previousPlayerIndexTurn: 0,
		};
		rooms[roomInfo.roomName].members[socket.id] = {
			...players[socket.id],
			score: 0,
		};
		rooms[roomInfo.roomName].playerTurn = Object.keys(
			rooms[roomInfo.roomName].members
		)[rooms[roomInfo.roomName].previousPlayerIndexTurn];

		socket.join(roomInfo.roomName);
		io.in(roomInfo.roomName).emit(
			"update-current-room",
			rooms[roomInfo.roomName]
		);
		io.emit("update-room", rooms);

		addMessage({
			text: `Player ${players[socket.id].name} created Room ${
				roomInfo.roomName
			}`,
			notification: true,
		});

		io.emit("get-messages", messages);
	});

	socket.on("join-room", (roomName) => {
		rooms[roomName].members[socket.id] = { ...players[socket.id], score: 0 };
		socket.join(roomName);
		io.in(roomName).emit("update-current-room", rooms[roomName]);
		io.emit("update-room", rooms);
		addMessage({
			text: `Player ${players[socket.id].name} joined Room ${roomName}`,
			notification: true,
		});
		io.emit("get-messages", messages);
	});

	socket.on("rematch", (roomName) => {
		rooms[roomName].board = Array(9).fill(null);
		if (rooms[roomName].previousPlayerIndexTurn === 0) {
			rooms[roomName].previousPlayerIndexTurn = 1;
		} else {
			rooms[roomName].previousPlayerIndexTurn = 0;
		}
		rooms[roomName].playerTurn = Object.keys(rooms[roomName].members)[
			rooms[roomName].previousPlayerIndexTurn
		];
		rooms[roomName].status = null;
		rooms[roomName].turn = 0;
		rooms[roomName].playerWin = null;
		rooms[roomName].winningPos = null;

		io.in(roomName).emit("update-current-room", rooms[roomName]);
	});

	socket.on("make-move", (moveData) => {
		rooms[moveData.roomName].board[moveData.pos] =
			rooms[moveData.roomName].turn;

		function checkWinning() {
			const pos = rooms[moveData.roomName].board;
			for (let overlapsed = 0; overlapsed <= 2; overlapsed++) {
				if (
					pos[0 + overlapsed] === pos[3 + overlapsed] &&
					pos[3 + overlapsed] === pos[6 + overlapsed] &&
					pos[0 + overlapsed] !== null
				) {
					return [0 + overlapsed, 3 + overlapsed, 6 + overlapsed];
				}

				if (
					pos[0 + overlapsed * 3] === pos[1 + overlapsed * 3] &&
					pos[1 + overlapsed * 3] === pos[2 + overlapsed * 3] &&
					pos[0 + overlapsed * 3] !== null
				) {
					return [0 + overlapsed * 3, 1 + overlapsed * 3, 2 + overlapsed * 3];
				}
			}

			if (pos[0] === pos[4] && pos[4] === pos[8] && pos[0] !== null) {
				return [0, 4, 8];
			}

			if (pos[2] === pos[4] && pos[4] === pos[6] && pos[2] !== null) {
				return [2, 4, 6];
			}
			return null;
		}

		if (!rooms[moveData.roomName].board.includes(null)) {
			rooms[moveData.roomName].status = "Tie";
		} else {
			const winningPos = checkWinning();
			if (winningPos) {
				rooms[moveData.roomName].status = "Win";
				rooms[moveData.roomName].winningPos = winningPos;
				rooms[moveData.roomName].playerWin =
					rooms[moveData.roomName].playerTurn;
				rooms[moveData.roomName].members[rooms[moveData.roomName].playerTurn]
					.score++;
			}
		}

		if (rooms[moveData.roomName].turn) {
			rooms[moveData.roomName].turn = 0;
		} else {
			rooms[moveData.roomName].turn = 1;
		}

		rooms[moveData.roomName].playerTurn =
			rooms[moveData.roomName].playerTurn ===
			Object.keys(rooms[moveData.roomName].members)[0]
				? Object.keys(rooms[moveData.roomName].members)[1]
				: Object.keys(rooms[moveData.roomName].members)[0];

		io.in(moveData.roomName).emit(
			"update-current-room",
			rooms[moveData.roomName]
		);
	});

	socket.on("send-room-message", (messageData) => {
		rooms[messageData.roomName].messages.push({
			message: messageData.message,
			senderId: messageData.senderId,
		});

		if (rooms[messageData.roomName].messages.length >= 30) {
			rooms[messageData.roomName].messages.shift();
		}

		io.in(messageData.roomName).emit(
			"update-current-room",
			rooms[messageData.roomName]
		);
	});

	socket.on("leave-room", (roomName) => {
		addMessage({
			text: `Player ${players[socket.id].name} left Room ${roomName}`,
			notification: true,
		});
		delete rooms[roomName].members[socket.id];
		rooms[roomName].board = Array(9).fill(null);
		rooms[roomName].playerTurn = Object.keys(rooms[roomName].members)[0];
		rooms[roomName].turn = 0;
		rooms[roomName].winningPos = null;
		rooms[roomName].status = null;
		rooms[roomName].playerWin = null;
		rooms[roomName].winningPos = null;

		socket.leave(roomName);
		io.in(roomName).emit("update-current-room", rooms[roomName]);
		if (Object.keys(rooms[roomName].members) <= 0) {
			addMessage({
				text: `Room ${roomName} closed`,
				notification: true,
			});
			delete rooms[roomName];
		}

		io.emit("update-room", rooms);
		io.emit("get-messages", messages);
	});

	socket.on("send-message", (messageData) => {
		addMessage({ ...messageData, userId: socket.id, notification: false });
		io.emit("get-messages", messages);
	});

	socket.on("leave", () => {
		addMessage({
			text: `Player ${players[socket.id].name} left`,
			notification: true,
		});
		delete players[socket.id];
		io.emit("get-messages", messages);
	});

	socket.on("disconnect", () => {
		if (players[socket.id]) {
			addMessage({
				text: `Player ${players[socket.id].name} left`,
				notification: true,
			});
			let run = true;
			for (const roomName in rooms) {
				if (!run) break;
				for (const socketId in rooms[roomName].members) {
					if (!(socketId === socket.id)) continue;
					delete rooms[roomName].members[socketId];
					rooms[roomName].board = Array(9).fill(null);
					rooms[roomName].playerTurn = Object.keys(rooms[roomName].members)[0];
					rooms[roomName].status = null;
					rooms[roomName].playerWin = null;
					rooms[roomName].turn = 0;
					rooms[roomName].winningPos = null;
					io.in(roomName).emit("update-current-room", rooms[roomName]);
					if (Object.keys(rooms[roomName].members).length <= 0) {
						addMessage({
							text: `Room ${roomName} closed`,
							notification: true,
						});
						delete rooms[roomName];
					}
					run = false;
					break;
				}
			}

			delete players[socket.id];

			io.emit("update-room", rooms);
			io.emit("get-messages", messages);
		}
	});
});

server.listen(3000);
