import { useEffect, useState } from 'react';
import './Tasks.css';

import { GetTasks, AddTask, UpdateTaskList } from '../../wailsjs/go/database/Db';



const Task = ({ moveTask, stopMoving, styleChoice, xy, task, i }) => {


    const [ moving, setMoving] = useState( false)


    const list = task.List === 'todo' ? 0 
            : task.List === 'inProgress' ? 1 
            : task.List === 'done' ? 2 
            : task.List === 'hold' ? 3 
            : -1

    return (
        <div
            className="Task"
            style={{width:styleChoice&&'200px', position:styleChoice?'fixed':'static',top:xy.y,left:xy.x}}
            onMouseDown={() => { setMoving( true);moveTask( list, i)}}
            onMouseUp={(e) => { console.log("shiiit");if (moving===false) return;stopMoving(e);setMoving( false)}}
        >
            <div className="TaskColor"></div>
            <div className="TaskBody">
                <div className="TaskCreated">
                    <i className='bx bxs-calendar'></i>
                    <h5>{task.Created}</h5>
                </div>
                <div className="TaskFor">
                    <i className='bx bxs-calendar'></i>
                    <h5>{task.For}</h5>
                </div>
                <div className="TaskTitle">
                    <i className='bx bx-edit-alt' ></i>
                    <h5>{task.Title}</h5>
                </div>
            </div>
        </div>
    )
}

const AddTaskComp = ({ show, close, listId, addTask}) => {


    const [ title, setTitle] = useState('')

    const [ body, setBody] = useState('')

    // FOR WILL REPRESENT THE NUMBER OF HOURS FOR THE TASK
    const [ For, setFor] = useState(0)


    function clearFields() {
        setFor( 0)
        setTitle('')
        setBody('')
        close()
    }


    const list = listId===0?'todo':listId===1?'inProgress':listId===2?'done':listId===3?'hold':''



    return (
        <>
            <div className="bg" onClick={(e) => {e.stopPropagation(); clearFields();}} style={{display:show?'block':'none'}}></div>
            <div className="AddTask" style={{ width:show?'500px':'0', opacity:show?1:0}}>

                    <h4>Titre</h4>
                    <div className="AddTaskTitle">
                        <input 
                            type="text"
                            value={title}
                            onChange={ (e) => setTitle( e.target.value)}
                        />
                    </div>
                    <h4>Duree:</h4>
                    <div className="AddTaskFor">
                        <input 
                            type="number"
                            value={For}
                            onChange={ (e) => setFor( e.target.value)}
                        />
                    </div>

                    <h4>Description:</h4>
                    <div className="AddTaskBody">
                        <textarea 
                            type="text"
                            value={body}
                            onChange={ (e) => setBody( e.target.value)}
                        />
                    </div>

                <button onClick={() => {addTask( list, title, body, parseInt(For)); clearFields()}}> Ajouter </button>
            </div>  
        </>
    );
}



const Tasks = ({Return}) => {

    const [ data, setData] = useState({
        todo: [],
        inProgress: [],
        done: [],
        hold: [],
    })

    useEffect( () => {

        let newData = {
            todo: [],
            inProgress: [],
            done: [],
            hold: [],
        }

        GetTasks().then(
            (res) => {
                res.forEach( ( task) => {
                    switch (task.List) {
                        case "todo":
                            newData.todo.push( task)
                            break;
                        case "inProgress":
                            newData.inProgress.push( task)
                            break;
                        case "done":
                            newData.done.push( task)
                            break;
                        case "hold":
                            newData.hold.push( task)
                            break;
                    }
                })

                setData( newData)
            }
        )

    }, [])
    



    const [xy,setXY] = useState({x:0,y:0})
    const [dragged,setDragged] = useState({
        s: false,
        i: 0,
        j: 0,
    })


    // getting mouse position and giving it to the moved task 
    function handleMouse(e) {
        const x = e.clientX; // X-coordinate within the viewport
        const y = e.clientY; // Y-coordinate within the viewport
        setXY({x:x-20,y:y-20})
    }

    // when the user holds the task 
    function moveTask( i, j) {
        setDragged(prev => ({s: true, i: i, j: j}))        
        document.addEventListener('mousemove', handleMouse);
    }

    // removes the task from the corresponding list and returns it
    // using i
    function getTask() {

        switch (dragged.i) {
            case 0:
                const t = data.todo[dragged.j]
                setData( prev => ({
                    ...prev,
                    todo: prev.todo.filter( ( _, j) => j !== dragged.j ),
                }))
                return t
            case 1:
                const t1 = data.inProgress[dragged.j]
                setData( prev => ({
                    ...prev,
                    inProgress: prev.inProgress.filter( ( _, j) => j !== dragged.j ), 
                }))
                return t1
            case 2:
                const t2 = data.done[dragged.j]
                setData( prev => ({
                    ...prev,
                    done: prev.done.filter( ( _, j) => j !== dragged.j ),
                }))
                return t2
            case 3:
                const t3 = data.hold[dragged.j]
                setData( prev => ({
                    ...prev,
                    hold: prev.hold.filter( ( _, j) => j !== dragged.j ),
                }))
                return t3
        }

    }


    // when the user drops the task
    function stopMoving( e) {

        console.log( "shit")
        e.stopPropagation()


        // check if it's going to get deleted

        const lists = document.querySelectorAll('.listBody')


        for( let i=0; i<4; i++) {

            const listRect = lists[i].getBoundingClientRect();

            if (
                e.clientX >= listRect.left &&
                e.clientX <= listRect.right &&
                e.clientY >= listRect.top &&
                e.clientY <= listRect.bottom
            ){

                const destination = i===0?'todo':i===1?'inProgress':i===2?'done':i===3?'hold':''
                const t = getTask()
                UpdateTaskList( t.Id, destination).then(
                    ( res) => {
                        if (res !== null) {console.log( res);return;} 
                        t.List = destination
                        setData( prev => ({
                            ...prev,
                            [destination]: [ t, ...prev[destination]],
                        }))
                    }
                )

                // break from the loop
                break;
            }
        }


        document.removeEventListener('mousemove', handleMouse)
        setDragged({s: false, i: 0, j: 0})
        setXY({x:0,y:0})
    }



    const [ addTask, setAddTask] = useState(false)

    function closeAddTask() {
        setAddTask( false)
    }

    function addTaskFunc( list, title, body, For) {
        // add it to the database

        AddTask( list, title, For, body).then( (res) => {

            setData( prev => {

                let newData = { ...prev}
                
                switch (list) {
                    case "todo":
                        newData.todo = [ res, ...newData.todo]
                        break;
                    case "inProgress":
                        newData.todo = [ res, ...newData.todo]
                        break;
                    case "done":
                        newData.todo = [ res, ...newData.todo]
                        break;
                    case "hold":
                        newData.todo = [ res, ...newData.todo]
                        break;
                }
                return newData;
            })
        })

        // on success we add it to the local state

        // THIS FUNCTION DOESN'T UPDATE THE FROM DATABASE IT JUST ASSUMES THAT THE TODO WAS ADDED SUCCESSFULLY THEREFOR WE ADD IT DIRECTLY
    }

    return (
        <div className="Tasks">
            <div className="TasksDeleteArea" style={{display:dragged.s?'flex':'none'}}>
                <i className='bx bxs-trash'></i>
            </div>
            <AddTaskComp
                show={addTask}
                close={closeAddTask}
                listId={dragged.i}
                addTask={addTaskFunc}
            />
            <div className="tasksHeader">
                <button onClick={() => Return()}><i className='bx bx-chevron-left'></i></button>
                <h3>Taches</h3>
            </div>

            <div className="tasksBody">

                <div className="list">
                    <div className="listHeader">
                        <h5>TODO</h5>
                        <i className='bx bx-plus' onClick={()=> setAddTask(true)}></i>
                    </div>
                    <div className="listData">
                        <p>{data.todo.length}</p> <p>6h</p>
                    </div>
                    <div className="listBody">
                        {
                                data.todo.map( ( t, i) => {
                                    const styleChoice = dragged.s && dragged.i == 0 && dragged.j == i
                                    return (
                                        <Task
                                            key={i}
                                            moveTask={moveTask}
                                            stopMoving={stopMoving}
                                            styleChoice={styleChoice}
                                            xy={xy}
                                            task={t}
                                            i={i}
                                        />
                                    )
                                }) 
                        }
                    </div>
                </div>

                <div className="list">
                    <div className="listHeader">
                        <h5>IN PROGRESS</h5>
                        <i className='bx bx-plus' onClick={()=> setAddTask(true)}></i>
                    </div>
                    <div className="listData">
                        <p>{data.inProgress.length}</p> <p>6h</p>
                    </div>
                    <div className="listBody">
                        {
                                data.inProgress.map( ( t, i) => {
                                    const styleChoice = dragged.s && dragged.i == 1 && dragged.j == i
                                    return (
                                        <Task
                                            key={i}
                                            moveTask={moveTask}
                                            stopMoving={stopMoving}
                                            styleChoice={styleChoice}
                                            xy={xy}
                                            task={t}
                                            i={i}
                                        />
                                    )
                                }) 
                        }
                    </div>
                </div>

                <div className="list">
                    <div className="listHeader">
                        <h5>DONE</h5>
                        <i className='bx bx-plus' onClick={()=> setAddTask(true)}></i>
                    </div>
                    <div className="listData">
                        <p>{data.done.length}</p> <p>6h</p>
                    </div>
                    <div className="listBody">
                        {
                                data.done.map( ( t, i) => {
                                    const styleChoice = dragged.s && dragged.i == 2 && dragged.j == i
                                    return (
                                        <Task
                                            key={i}
                                            moveTask={moveTask}
                                            stopMoving={stopMoving}
                                            styleChoice={styleChoice}
                                            xy={xy}
                                            task={t}
                                            i={i}
                                        />
                                    )
                                }) 
                        }
                    </div>
                </div>

                <div className="list">
                    <div className="listHeader">
                        <h5>HOLD</h5>
                        <i className='bx bx-plus' onClick={()=> setAddTask(true)}></i>
                    </div>
                    <div className="listData">
                        <p>{data.hold.length}</p> <p>6h</p>
                    </div>
                    <div className="listBody">
                        {
                                data.hold.map( ( t, i) => {
                                    const styleChoice = dragged.s && dragged.i == 3 && dragged.j == i
                                    return (
                                        <Task
                                            key={i}
                                            moveTask={moveTask}
                                            stopMoving={stopMoving}
                                            styleChoice={styleChoice}
                                            xy={xy}
                                            task={t}
                                            i={i}
                                        />
                                    )
                                }) 
                        }
                    </div>
                </div>

            </div>

        </div>
    );

}



export default Tasks;

