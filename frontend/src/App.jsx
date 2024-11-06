import { useEffect, useState} from 'react';
import './App.css';
import Dashboard from './Dashboard/Dashboard';
import Workshop from './Workshop/Workshop';
import History from './History/History';
import Tasks from './Tasks/Tasks';

function App() {


    const [index, setIndex] = useState(0)

    const content = [
        <Dashboard gotoTasks={gotoTasks}/>,
        <Workshop/>,
        <History/>,
        <Tasks Return={returnToDash}/>
    ]

    function gotoTasks() {
        setIndex(3);
    }

    function returnToDash() {
        setIndex(0)
    }

    useEffect( () => {

    }, [])

    return (
        <div id="App">
            <div className="aside">
                <button className="bt-aside" onClick={ (e) => { e.preventDefault(); document.querySelector('#App').classList.toggle('open')}}><i className='bx bx-chevrons-right'></i></button>

                <nav>
                    <ul>
                        <li onClick={(e) => setIndex(0)}>
                            <i className='bx bx-tachometer'></i>
                            <span>Aperçu</span>
                        </li>
                        <li onClick={(e) => setIndex(1)}>
                            <i className='bx bxs-file-doc'></i>
                            <span>Production</span>
                        </li>
                        <li onClick={(e) => setIndex(2)}>
                            <i className='bx bx-history'></i>
                            <span>Historique</span>
                        </li>
                    </ul>
                </nav>

            </div>

            {(content[index])}

        </div>
    )
}



export default App
