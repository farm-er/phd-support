import { forwardRef, useEffect, useState } from 'react';
import './Tasks.css';

import { GetTasks, AddTask, UpdateTaskList, RemoveTask } from '../../wailsjs/go/database/Db';
import BackgroundQuit from '../components/BackgroundQuit/BackgroundQuit';


const Task = ({ moveTask, stopMoving, styleChoice, xy, task, i }) => {


    const [ open, setOpen] = useState( false)


    const [ moving, setMoving] = useState( false)



    return (
        <>
        
        <div
            className={`Task ${open&&'open'}`}
            style={{width:styleChoice&&'200px', position:styleChoice?'fixed':'static',top:xy.y,left:xy.x}}

        >
            
            <div className="TaskColor"></div>
            <div className="TaskContent">
                <div className="TaskHeader"
                    onMouseDown={() => { setMoving( true);moveTask( task.List === 'todo' ? 0 
                        : task.List === 'inprogress' ? 1 
                        : task.List === 'done' ? 2 
                        : task.List === 'hold' ? 3 
                        : -1, i)}}
                    onMouseUp={(e) => { if (moving===false) return;stopMoving(e);setMoving( false)}}
                >
                    <h5>{task.Title}</h5>
                    <div className="TaskExpand"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={ (e) => {
                            e.stopPropagation()
                            setOpen( prev => !prev)
                        }}
                    >
                        <img src="/src/assets/icons/taskExpand.svg" alt="" />
                    </div>
                </div>
                {
                    open&&(
                        <div className="TaskBody">
                            <div className="TaskFor">
                                <img src="src/assets/icons/calendar.svg" alt="" />
                                {/* // TODO: update task from the root component: TASKS */}
                                <input type="date" onChange={(e) => setTask( prev => ({...prev, For: e.target.value}))} value={task.For}/>
                            </div>
                        </div>
                    )
                }
            </div>
            
            
            
        </div>
        </>
    )
}


const AddTaskComp = ({ show, close, listId, addTask}) => {


    const [ title, setTitle] = useState('')

    const [ body, setBody] = useState('')

    // FOR WILL REPRESENT THE NUMBER OF HOURS FOR THE TASK
    const [ For, setFor] = useState('')


    function clearFields() {
        setFor( '')
        setTitle('')
        setBody('')
        close()
    }


    const list = listId===0?'todo':listId===1?'inprogress':listId===2?'done':listId===3?'hold':''



    return (
        <>
            {
                show&&(
                    <BackgroundQuit
                        onClose={clearFields}
                    />
                )
            }
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
                            type="date"
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

                <button onClick={() => {addTask( list, title, body, For); clearFields()}}> Ajouter </button>
            </div>  
        </>
    );
}



const Tasks = ({Return}) => {

    const [ data, setData] = useState({
        todo: [],
        inprogress: [],
        done: [],
        hold: [],
    })

    useEffect( () => {

        let newData = {
            todo: [],
            inprogress: [],
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
                        case "inprogress":
                            newData.inprogress.push( task)
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
        ).catch( (e) => console.log( e))

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
        setXY({x:x-20,y:y-50})
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
                const t1 = data.inprogress[dragged.j]
                setData( prev => ({
                    ...prev,
                    inprogress: prev.inprogress.filter( ( _, j) => j !== dragged.j ), 
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

        e.stopPropagation()

        const del = document.querySelector('.TasksDeleteArea').getBoundingClientRect();
        
        if (
            e.clientX >= del.left &&
            e.clientX <= del.right &&
            e.clientY >= del.top &&
            e.clientY <= del.bottom
        ){
            
            const t = getTask()

            // delete the task 
            console.log( "removing: ", t)
            RemoveTask( t.Id).catch( (e)=>console.log("Tasks: ", e))
        }else {
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

                    const destination = i===0?'todo':i===1?'inprogress':i===2?'done':i===3?'hold':''
                    const t = getTask()

                    // just move it to the top
                    if (i==dragged.i) {
                        t.List = destination
                        setData( prev => ({
                            ...prev,
                            [destination]: [ t, ...prev[destination]],
                        }))
                        break
                    }

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
        }

        document.removeEventListener('mousemove', handleMouse)
        setDragged({s: false, i: 0, j: 0})
        setXY({x:0,y:0})
    }



    const [ addTask, setAddTask] = useState({show: false, listId: 0})

    function closeAddTask() {
        setAddTask( prev => ({ show: false, listId: 0}))
    }

    function addTaskFunc( list, title, body, For) {
        // add it to the database

        AddTask( list, title, For, body).then( (res) => {

            setData( prev => {

                let newData = { ...prev}
                
                console.log( res)
                console.log( list, title, For, body)
                
                switch (list) {
                    case "todo":
                        newData.todo = [ res, ...newData.todo]
                        break;
                    case "inprogress":
                        newData.inprogress = [ res, ...newData.inprogress]
                        break;
                    case "done":
                        newData.done = [ res, ...newData.done]
                        break;
                    case "hold":
                        newData.hold = [ res, ...newData.hold]
                        break;
                }

                console.log( newData)
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
                show={addTask.show}
                close={closeAddTask}
                listId={addTask.listId}
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
                        <div className="OpenAddTask"
                            onClick={ () => setAddTask({show: true, listId: 0})}
                        >
                            <img src="src/assets/icons/add.svg" alt="" />
                        </div>
                    </div>
                    <div className="listData">
                        <p>{data.todo.length}</p> <p></p>
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
                        <div className="OpenAddTask"
                            onClick={ () => setAddTask({show: true, listId: 1})}
                        >
                            <img src="src/assets/icons/add.svg" alt="" />
                        </div>
                    </div>
                    <div className="listData">
                        <p>{data.inprogress.length}</p> <p>6h</p>
                    </div>
                    <div className="listBody">
                        {
                                data.inprogress.map( ( t, i) => {
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
                        <div className="OpenAddTask"
                            onClick={ () => setAddTask({show: true, listId: 2})}
                        >
                            <img src="src/assets/icons/add.svg" alt="" />
                        </div>
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
                        <div className="OpenAddTask"
                            onClick={ () => setAddTask({show: true, listId: 3})}
                        >
                            <img src="src/assets/icons/add.svg" alt="" />
                        </div>
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

