import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Yield from './components/Yield/Yield'
import Swap from "./components/Swap/Swap"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bridge from './components/Bridge/Bridge';
import { AllTools } from './tools/AllTools';
import { Testing } from './tools/Testing';

function App() {
	return (
		<BrowserRouter>
			<div className="h-screen w-screen flex-row flex">
				<div className="w-1/8 h-full text-lg font-bold">
					<Sidebar></Sidebar>
				</div>
				<div className="w-7/8 h-full">
						<Routes>
							<Route path="/">

							</Route>
							<Route path="/yield" element={<Yield></Yield>}/>
							
								
							<Route path="/swap" element={<Swap/>}/>
							<Route path="/bridge" element={<Bridge/>}></Route>
							<Route path="/alltools" element={<AllTools/>}></Route>
							<Route path="/test" element={<Testing/>}></Route>
						</Routes>
				</div>
			</div>
		</BrowserRouter>
  	)
}

export default App
