import { useRef, useState } from 'react';
import './Tasks.css';





const Tasks = ({Return}) => {


    const [ data, setData] = useState({
        todo: [
            {

            },
            {

            }
        ],
        inProgress: [
            {
                
            },
            {

            }
        ],
        done: [
            {

            },
            {

            }
        ],
        hold: [
            {

            },
            {

            }
        ],
    })


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
        e.stopPropagation()

        const lists = document.querySelectorAll('.listBody')


        for( let i=0; i<4; i++) {

            const listRect = lists[i].getBoundingClientRect();

            if (
                e.clientX >= listRect.left &&
                e.clientX <= listRect.right &&
                e.clientY >= listRect.top &&
                e.clientY <= listRect.bottom
            ){
                if (dragged.i == i) break;
                switch (i) {
                    case 0:
                        // take the task from the sender list to the receiver list
                        const t = getTask()
                        setData( prev => ({
                            ...prev,
                            todo: [ t, ...prev.todo],
                        }))
                        break;
                    case 1:
                        const t1 = getTask()
                        setData( prev => ({
                            ...prev,
                            inProgress: [ t1, ...prev.inProgress],
                        }))
                        break;
                    case 2:
                        const t2 = getTask()
                        setData( prev => ({
                            ...prev,
                            done: [ t2, ...prev.done],
                        }))
                        break;
                    case 3:
                        const t3 = getTask()
                        setData( prev => ({
                            ...prev,
                            hold: [ t3, ...prev.hold],
                        }))
                        break;
                }
                break;
            }
        }


        document.removeEventListener('mousemove', handleMouse)
        setDragged({s: false, i: 0, j: 0})
        setXY({x:0,y:0})
    }


    return (
        <div className="Tasks">

            <div className="tasksHeader">
                <button onClick={() => Return()}><i className='bx bx-chevron-left'></i></button>
                <h3>Taches</h3>
            </div>

            <div className="tasksBody">

                <div className="list">
                    <div className="listHeader">
                        <h5>TODO</h5>
                        <i className='bx bx-plus' ></i>
                    </div>
                    <div className="listData">
                        <p>3</p> <p>6h</p>
                    </div>
                    <div className="listBody">
                        {
                                data.todo.map( ( _, i) => {
                                    const styleChoice = dragged.s && dragged.i == 0 && dragged.j == i
                                    return (
                                        <div
                                            className="task"
                                            key={i}
                                            style={{width:styleChoice?'120px':'98%', height:'100px', backgroundColor:'red', margin:'5px',position:styleChoice?'fixed':'static',top:xy.y,left:xy.x}}
                                            onMouseDown={() => moveTask( 0, i)}
                                            onMouseUp={(e) => stopMoving(e)}
                                        >
                                            {i}
                                        </div>
                                    )
                                }) 
                        }
                    </div>
                </div>

                <div className="list">
                    <div className="listHeader">
                        <h5>IN PROGRESS</h5>
                        <i className='bx bx-plus' ></i>
                    </div>
                    <div className="listData">
                        <p>3</p> <p>6h</p>
                    </div>
                    <div className="listBody">
                        {
                                data.inProgress.map( ( _, i) => {
                                    const styleChoice = dragged.s && dragged.i == 1 && dragged.j == i
                                    return (
                                        <div
                                            className="task"
                                            key={i}
                                            style={{width:styleChoice?'120px':'98%', height:'100px', backgroundColor:'red', margin:'5px',position:styleChoice?'fixed':'static',top:xy.y,left:xy.x}}
                                            onMouseDown={() => moveTask( 1, i)}
                                            onMouseUp={(e) => stopMoving(e)}
                                        >
                                            {i}
                                        </div>
                                    )
                                }) 
                        }
                    </div>
                </div>

                <div className="list">
                    <div className="listHeader">
                        <h5>DONE</h5>
                        <i className='bx bx-plus' ></i>
                    </div>
                    <div className="listData">
                        <p>3</p> <p>6h</p>
                    </div>
                    <div className="listBody">
                        {
                                data.done.map( ( _, i) => {
                                    const styleChoice = dragged.s && dragged.i == 2 && dragged.j == i
                                    return (
                                        <div
                                            className="task"
                                            key={i}
                                            style={{width:styleChoice?'120px':'98%', height:'100px', backgroundColor:'red', margin:'5px',position:styleChoice?'fixed':'static',top:xy.y,left:xy.x}}
                                            onMouseDown={() => moveTask( 2, i)}
                                            onMouseUp={(e) => stopMoving(e)}
                                        >
                                            {i}
                                        </div>
                                    )
                                }) 
                        }
                    </div>
                </div>

                <div className="list">
                    <div className="listHeader">
                        <h5>HOLD</h5>
                        <i className='bx bx-plus' ></i>
                    </div>
                    <div className="listData">
                        <p>3</p> <p>6h</p>
                    </div>
                    <div className="listBody">
                        {
                                data.hold.map( ( _, i) => {
                                    const styleChoice = dragged.s && dragged.i == 3 && dragged.j == i
                                    return (
                                        <div
                                            className="task"
                                            key={i}
                                            style={{width:styleChoice?'120px':'98%', height:'100px', backgroundColor:'red', margin:'5px',position:styleChoice?'fixed':'static',top:xy.y,left:xy.x}}
                                            onMouseDown={() => moveTask( 3, i)}
                                            onMouseUp={(e) => stopMoving(e)}
                                        >
                                            {i}
                                        </div>
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

