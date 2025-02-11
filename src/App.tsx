import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Yield from './components/Yield/Yield'
import Swap from "./components/Swap/Swap"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<div className="h-screen w-screen flex-row flex">
			<div className="w-1/8 h-full text-lg font-bold">
				<Sidebar></Sidebar>
			</div>
			<div className="w-7/8 h-full">
				<BrowserRouter>
					<Routes>
						<Route path="/">

						</Route>
						<Route path="/yield" element={<Yield></Yield>}/>
						
							
						<Route path="/swap" element={<Swap/>}/>

					</Routes>
				</BrowserRouter>
			</div>
		</div>
  	)
}

export default App
