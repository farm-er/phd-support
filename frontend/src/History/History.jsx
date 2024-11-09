import { useEffect, useState } from 'react';
import './History.css'



const HistoryAct = ( {activity}) => {
    return (
        <div className="HistoryAct">
            <div className="actTitle">
                {activity.title}
            </div>
            <div className="actDuration">
                {activity.duration}
            </div>
            <div className="actCat">
                {activity.category}
            </div>
        </div>
    );
}


const History = () => {

    const data = [
        {
            time: "11-10-2024",
            duration: 2.5,
            activities: [
                {
                    category: "reading",
                    duration: 1,
                    title: "La psychologie des foules",
                    link: ""
                },
                {
                    category: "reading",
                    duration: 1,
                    title: "La psychologie des foules",
                    link: ""
                },
                {
                    category: "writing",
                    duration: 1,
                    title: "La psychologie des foules",
                    link: ""
                },
                {
                    category: "writing",
                    duration: 1,
                    title: "La psychologie des foules",
                    link: ""
                },
            ]
        },
        {
            time: "12-10-2024",
            duration: 2.5,
            activities: [
                {
                    category: "reading",
                    duration: 1,
                    title: "La psychologie des foules",
                    link: ""
                },
                {
                    category: "reading",
                    duration: 1,
                    title: "La psychologie des foules",
                    link: ""
                },
                {
                    category: "watching",
                    duration: 1,
                    title: "La psychologie des foules",
                    link: ""
                },
                {
                    category: "watching",
                    duration: 1,
                    title: "La psychologie des foules",
                    link: ""
                },
            ]
        }
    ]



    const [ search, setSearch] = useState('')

    const [ filter, setFilter] = useState('')


    const [ filteredData, setFilteredData] = useState(data)


    useEffect( () => {

        if ( filter === "") {
            setFilteredData( data)
        }else {
            setFilteredData( prev => {
                return data.map( ( day) => {
                    return {
                        ...day,
                        activities: day.activities.filter( ( act) => act.category === filter)
                    }
                })
            })
        }

        setFilteredData( prev => {
            return prev.map( ( day) => {
                return {
                    ...day,
                    activities: day.activities.filter( ( act) => act.title.toLowerCase().includes( search.toLowerCase()) )
                }
            })
        })

    }, [ filter])


    useEffect( () => {

        setFilteredData( prev => {
            return data.map( ( day) => {
                return {
                    ...day,
                    activities: day.activities.filter( ( act) => act.title.toLowerCase().includes( search.toLowerCase()) )
                }
            })
        })

        if ( filter === "") return

        setFilteredData( prev => {
            return prev.map( ( day) => {
                return {
                    ...day,
                    activities: day.activities.filter( ( act) => act.category === filter)
                }
            })
        })

    }, [ search])

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
                        return (
                            <div className="HistoryDay" key={i}>
                                <div className="DayInfo">
                                    <h3>{day.time}</h3>
                                    <h3>{day.duration} h</h3>
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





