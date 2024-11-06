import './Tasks.css';





const Tasks = ({Return}) => {

    return (
        <div className="Tasks">

            <div className="tasksHeader">
                <button onClick={() => Return()}><i class='bx bx-chevron-left'></i></button>
                <h3>Taches</h3>
            </div>

            <div className="tasksBody">

                <div className="list">
                    <div className="listHeader">
                        <h5>TODO</h5>
                        <i class='bx bx-plus' ></i>
                    </div>
                    <div className="listData">
                        <p>3</p> <p>6h</p>
                    </div>
                    <div className="listBody">

                    </div>
                </div>

                <div className="list">
                    <div className="listHeader">
                        <h5>IN PROGRESS</h5>
                        <i class='bx bx-plus' ></i>
                    </div>
                    <div className="listData">
                        <p>3</p> <p>6h</p>
                    </div>
                    <div className="listBody">

                    </div>
                </div>

                <div className="list">
                    <div className="listHeader">
                        <h5>DONE</h5>
                        <i class='bx bx-plus' ></i>
                    </div>
                    <div className="listData">
                        <p>3</p> <p>6h</p>
                    </div>
                    <div className="listBody">

                    </div>
                </div>

                <div className="list">
                    <div className="listHeader">
                        <h5>ON HOLD</h5>
                        <i class='bx bx-plus' ></i>
                    </div>
                    <div className="listData">
                        <p>3</p> <p>6h</p>
                    </div>
                    <div className="listBody">

                    </div>
                </div>

            </div>

        </div>
    );

}



export default Tasks;

