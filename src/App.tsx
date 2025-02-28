import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Yield from './components/Yield/Yield'
import Swap from "./components/Swap/Swap"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bridge from './components/Bridge/Bridge';
import { AllTools } from './tools/AllTools';
import { Testing } from './tools/Testing';
import {DataProvider} from './context/DataContext';
import { StrictMode } from 'react';
import { ControlProvider } from './context/ControlContext';
import { AgentProvider } from './context/AgentContext';
import FullChat from './components/Chat/FullChat';
import MiniChat from './components/Chat/MiniChat';
import { ToastContainer, Bounce } from 'react-toastify';
import Portfolio from "./components/Portfolio/Portfolio";

function IntegrateMiniChat({element}: {element: JSX.Element}) {
	return (
		<div className="h-screen w-full flex flex-col">
			<div className='flex-1 h-1'>
				{element}
			</div>
			<div className='flex flex-col items-center w-full p-6'>
				<MiniChat></MiniChat>
			</div>
		</div>
	)
}

function App() {
	return (
		<StrictMode>
			<ControlProvider>
			<DataProvider>
				<AgentProvider>
			<BrowserRouter>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				transition={Bounce}
			/>
				<div className="h-screen w-screen flex-row flex">
					<div className="w-1/6 h-full text-lg font-bold">
						<Sidebar></Sidebar>
					</div>
					<div className="w-5/6 h-full">
							<Routes>
								<Route path="/" element={<FullChat></FullChat>}>
									
								</Route>
								<Route path="/yield" element={<IntegrateMiniChat element={<Yield/>}/>}/>	
								<Route path="/swap" element={<IntegrateMiniChat element={<Swap/>}/>} />
								<Route path="/bridge"element={<IntegrateMiniChat element={<Bridge/>}/>}></Route>
								<Route path="/alltools" element={<AllTools/>}></Route>
								<Route path="/portfolio"element={<IntegrateMiniChat element={<Portfolio/>}/>}></Route>
								<Route path="/test" element={<Testing/>}></Route>
							</Routes>
								
					</div>
				</div>
			</BrowserRouter>
				</AgentProvider>
			</DataProvider>
			</ControlProvider>
		</StrictMode>
  	)
}

export default App
