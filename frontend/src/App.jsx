import { useEffect, useState} from 'react';
import './App.css';
import Dashboard from './Dashboard/Dashboard';
import Workshop from './Workshop/Workshop';
import History from './History/History';
import Tasks from './Tasks/Tasks';
import Library from './Library/Library';
import BackgroundQuit from './components/BackgroundQuit/BackgroundQuit';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import VideoPlayer from './VideoPlayer/VideoPlayer';



const MainLayout = () => {

    const [index, setIndex] = useState(0)

    const content = [
        <Dashboard gotoTasks={gotoTasks}/>,
        <Workshop/>,
        <History/>,
        <Tasks Return={returnToDash}/>,
        <Library/>,
    ]

    function gotoTasks() {
        setIndex(3);
    }

    function returnToDash() {
        setIndex(0)
    }

    function toggleAside() {
        document.querySelector('.aside').classList.toggle('open')
        setShow( prev => !prev)
    }

    useEffect( () => {

    }, [])

    const [ show, setShow] = useState( false)

    return (
        <div id="App">
            {
                show&&(
                    <BackgroundQuit
                        onClose={toggleAside}
                    />
                )
            }
            <div className="aside">
                <button className="bt-aside" onClick={toggleAside}><img src="src/assets/icons/expand.svg" alt="" /></button>

                <nav>
                    <ul>
                        <li onClick={(e) => setIndex(0)} className={index===0?'active':undefined}>
                            <img src="src/assets/icons/dashboard.svg" alt="" /> 
                            <span>Aperçu</span>
                        </li>
                        <li onClick={(e) => setIndex(1)} className={index===1?'active':undefined}>
                            <img src="src/assets/icons/dashboard.svg" alt="" />
                            <span>Production</span>
                        </li>
                        <li onClick={(e) => setIndex(4)} className={index===4?'active':undefined}>
                            <img src="src/assets/icons/library.svg" alt="" />
                            <span>Bibliotheque</span>
                        </li>
                        <li onClick={(e) => setIndex(2)} className={index===2?'active':undefined}>
                        <img src="src/assets/icons/history.svg" alt="" />
                            <span>Historique</span>
                        </li>
                        
                    </ul>
                </nav>

            </div>

            {(content[index])}

        </div>
    );

}




function App() {


    

    return (

        <BrowserRouter>
            <Routes>

                <Route  path='/' element={<MainLayout/>} />

                <Route  path='/videoplayer' element={<VideoPlayer/>} />

            </Routes>
        </BrowserRouter>

    )
}



export default App
