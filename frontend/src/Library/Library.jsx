
import { useState } from 'react';
import './Library.css'




const Library = () => {

    const topics = [
        {
            title: "topic1",
            files: [
                {
                    name: "fichier_1.txt",
                    lastUpdate: "11/10/2024-18:48",
                },
                {
                    name: "fichier_1.pdf",
                    lastUpdate: "11/10/2024-18:48",
                },
                {
                    name: "file.pdf",
                    lastUpdate: "11/10/2024-18:48",
                },
            ],
        },
        {
            title: "topic1",
            files: [],
        },
        {
            title: "topic1",
            files: [],
        },
        {
            title: "topic1",
            files: [],
        },{
            title: "topic1",
            files: [],
        },
        {
            title: "topic1",
            files: [],
        },
    ]

    const [ selected, setSelected] = useState(null)

    const [ search, setSearch] = useState("")


    return (
        <div className="Library">
            <div className="LibraryTopics">
                {
                    topics.map( ( top, i) => {
                        return (
                            <div className="Topic"
                                style={{backgroundColor:i===selected&&'red'}}
                                onClick={ () => setSelected( i)}
                                key={i}
                            >
                                {top.title}
                            </div>
                        )
                    })
                }
            </div>
            <div className="LibraryHeader">
                <input
                    type="text"
                    placeholder='search by name ...'
                    onChange={ (e) => {
                        setSearch( e.target.value.toLowerCase())
                    }}
                />
            </div>
            <div className="LibraryBody">
                {
                    selected !== null&&(
                        topics[selected].files.length === 0?(
                            <div className="">
                                No files available
                            </div>
                        ):(
                            topics[selected].files.map( ( f, i) => {

                                if ( search !== "") {
                                    if ( f.name.toLowerCase().includes( search)) {
                                        return(
                                            <div className="File"
                                                key={i}
                                            >
                                                <div className="fileName">
                                                    {
                                                        f.name.includes('.txt')?(
                                                            <i className='bx bxs-file-txt'></i>
                                                        ):f.name.includes('.pdf')?(
                                                            <i className='bx bxs-file-pdf'></i>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                    <h5>{f.name}</h5>  
                                                </div>
                                                <div className="fileMetadata">
                                                    <h5>{f.lastUpdate}</h5>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return
                                    }
                                }

                                return(
                                    <div className="File"
                                        key={i}
                                    >
                                        <div className="fileName">
                                            {
                                                f.name.includes('.txt')?(
                                                    <i className='bx bxs-file-txt'></i>
                                                ):f.name.includes('.pdf')?(
                                                    <i className='bx bxs-file-pdf'></i>
                                                ):(
                                                    <></>
                                                )
                                            }
                                            <h5>{f.name}</h5>  
                                        </div>
                                        <div className="fileMetadata">
                                            <h5>{f.lastUpdate}</h5>
                                        </div>
                                    </div>
                                )
                            })
                        )
                        
                    )
                }
            </div>
        </div>
    ); 
}






export default Library;


