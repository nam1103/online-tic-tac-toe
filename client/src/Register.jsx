import { useContext, useEffect, useState } from "react";
import { GameContext } from "./GameContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
	const [name, setName] = useState("");
	const { addUser, isRegister } = useContext(GameContext);
	const navigate = useNavigate();

	function handleSubmit(event) {
		event.preventDefault();
		if (!name) return;
		addUser(name);
	}

	useEffect(() => {
		if (isRegister) {
			navigate("/rooms");
		}
	}, [isRegister]);

	return (
		<div className="h-screen bg-[#C8E7F2] flex justify-center items-center">
			<div className="w-1/2 h-1/2 max-w-xl min-w-300 bg-white rounded-full shadow-2xl flex justify-center items-center">
				<form
					action=""
					className="flex flex-col gap-3 items-center"
					onSubmit={handleSubmit}
				>
					<input
						value={name}
						onChange={(event) => setName(event.target.value)}
						type="text"
						placeholder="username"
						className="focus:border-blue-500 focus:text-blue-700 transition-all block shadow-lg p-3 border-2 rounded-full border-blue-200 outline-none text-center text-blue-400"
					/>
					<button className="bg-blue-200 w-1/2 rounded-2xl py-1 shadow-lg text-white hover:bg-blue-500 hover:text-blue-200 transition-all">
						Play
					</button>
				</form>
			</div>
		</div>
	);
}
