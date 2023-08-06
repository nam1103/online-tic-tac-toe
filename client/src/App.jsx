import { BrowserRouter, Routes, Route } from "react-router-dom";
import JoinRoom from "./JoinRoom";
import Match from "./Match";
import { GameContextProvider } from "./GameContext";
import Register from "./Register";

function App() {
	return (
		<BrowserRouter>
			<GameContextProvider>
				<Routes>
					<Route path="/" element={<Register />} />
					<Route path="/rooms" element={<JoinRoom />} />
					<Route path="/match" element={<Match />} />
				</Routes>
			</GameContextProvider>
		</BrowserRouter>
	);
}

export default App;
