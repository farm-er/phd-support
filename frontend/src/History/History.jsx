import { useEffect, useState } from 'react';
import './History.css'

import { GetHistory, GetActivities } from '../../wailsjs/go/database/Db'


const HistoryAct = ( {activity}) => {
    return (
        <div className="HistoryAct">
            <div className="actTitle">
                {activity.Title}
            </div>
            <div className="actCat">
                {activity.Type}
            </div>
            <div className="actTime">
                {activity.Time}
            </div>
            <div className="actDuration">
                {activity.Duration} h
            </div>
        </div>
    );
}


const History = () => {

    const [ data, setData] = useState([])

    useEffect( () => {

        GetHistory().then(
            (res) => {
                
                let newData = []

                const fetchData = async () => {
                    for (let i=0; i<res.length; i++) {
                        try {
                            const activities = await GetActivities( res[i].Id)
    
                            newData.push( {id: res[i].Id, day: res[i].Day, activities: activities})
                        } catch(e) {
                            console.log(e)
                        }finally {
                            setData(newData)
                        }
                        
                    }
                } 

                fetchData();
                
            }
        ).catch( (e) => console.log("history: ", e))

        

    }, [])

    const [ search, setSearch] = useState('')

    const [ filter, setFilter] = useState('')


    const [ filteredData, setFilteredData] = useState(data)


    useEffect( () => {

        let filtered = [ ...data]

        if (filter) {
            filtered = filtered.map(( day) => ({
                ...day,
                activities: day.activities.filter( ( act) => 
                    act.Type === filter
                ),
            }));
        }

        if (search) {
            filtered = filtered.map((day) => ({
                ...day,
                activities: day.activities.filter((act) =>
                    act.Title.toLowerCase().includes(search.toLowerCase())
                ),
            }));
        }

        setFilteredData( filtered)

    }, [ search, filter, data])


    return (
        <div className="History">
            <div className="historyHeader">
                <div className="searchBox">
                    <i className='bx bx-search'></i>
                    <input
                        type="text"
                        placeholder='search by name ...'
                        onChange={ (e) => {
                            setSearch( e.target.value)
                        }}
                    />
                </div>
                <select
                    name=""
                    id=""
                    onChange={ (e) => {
                        setFilter( e.target.value)
                    }}
                >
                    <option value="">--</option>
                    <option value="reading">reading</option>
                    <option value="watching">watching</option>
                    <option value="writing">writing</option>
                </select>
            </div>
            <div className="historyBody">
                {
                    filteredData.map( ( day, i) => {
                        if ( day.activities.length == 0) return
                        
                        let dayDuration = 0

                        for (let i = 0; i<day.activities.length; i++) {
                            dayDuration+=day.activities[i].Duration
                        }

                        return (
                            <div className="HistoryDay" key={i}>
                                <div className="DayInfo">
                                    <h3>{day.day}</h3>
                                    <h3>{dayDuration.toPrecision(2)} h</h3>
                                </div>
                                <div className="DayBody">
                                    {
                                        day.activities.map( ( act, j) => {
                                            return (
                                                <HistoryAct
                                                    key={j}
                                                    activity={act}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );

}



export default History;





