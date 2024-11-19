
import { useEffect, useState } from 'react';
import './Library.css'

import { GetTopics, GetTopicFiles, AddTopic, AddFileToTopic } from '../../wailsjs/go/database/Db'
import BackgroundQuit from '../components/BackgroundQuit/BackgroundQuit';



const AddTopicForm = ({ close, addTopic}) => {

    const [ title, setTitle] = useState('')


    

    return (
        <div className="AddTopicForm">
            <input 
                type="text"
                placeholder='name ...'
                value={title}
                onChange={(e) => setTitle( e.target.value)}
            />
            <div className="AddTopicFormAction">
                <button
                    onClick={() => { addTopic( title); close()}}
                >
                    Add
                </button>
                <button
                    onClick={close}
                >
                    Cancel
                </button>
            </div>
        </div>
    );

}


const AddFileForm =  ({ close, addFile}) => {


    const [ title, setTitle] = useState('')

    const [ type, setType] = useState('')


    return(
        <>
            <BackgroundQuit
                onClose={close}
            />
            <div className="AddFilePage">
            
                <input 
                    type="text"
                    placeholder='title...'
                    value={title}
                    onChange={ (e) => setTitle( e.target.value)}
                />

                <select
                    value={type}
                    onChange={ (e) => {
                        setType( e.target.value)
                    }}
                >
                    <option value="pdf">pdf</option>
                    <option value="txt">txt</option>
                    <option value="doc">doc</option>
                    <option value="docx">docx</option>
                </select>

                <button
                    onClick={ () => { addFile( title, type);close();}}
                >
                    ADD
                </button>

            </div>
        </>
        
    );

}


const Library = () => {

    const [ topics, setTopics] = useState([])

    const getTopics = async () => {

        // TODO: try and fetch for data concurrently
        try {
            const tops = await GetTopics();
            
            for (let i=0; i<tops.length; i++) {
                const files = await GetTopicFiles( tops[i].Id)
                tops[i].files = files || []
            }
            
            setTopics( tops)
        
        } catch (e) {
            console.log(e)
        }
        
    }


    useEffect( () => {

        getTopics();

    }, [])

    const [ selected, setSelected] = useState(null)

    const [ search, setSearch] = useState("")

    const [ addTopic, setAddTopic] = useState( false)

    const closeAddTopic = () => {
        setAddTopic( false)
    }

    const addTopicFunc = (title) => {

        AddTopic( title).then(
            (res) => {
                res.files = []
                setTopics( prev => [ res, ...prev])
            }
        )

    }

    const [ addFile, setAddFile] = useState( false)


    const openAddFile = () => {
        if ( selected === null ) return

        setAddFile( true)
    }

    const closeAddFile = () => {
        setAddFile( false)
    }

    const addFileFunc = ( title, type) => {

        AddFileToTopic( topics[selected].Id, title, type).then(
            (file) => {

                console.log("i ran")
                console.log(file)
                setTopics( prev => {
                    const topicsCopy = [...prev]

                    const selectedTopic = topicsCopy[selected]
                
                    selectedTopic.files = [...selectedTopic.files, file]

                    return topicsCopy
                })
            }
        ).catch( (e) => console.log(e))
    }

    // TODO: add file functionality

    return (
        <div className="Library">
            <div className="LibraryTopics">
                {
                    addTopic?(
                        <AddTopicForm
                            close={closeAddTopic}
                            addTopic={addTopicFunc}
                        />
                    ):(
                        <div className="AddTopic"
                            onClick={() => setAddTopic(true)}
                        >
                            +
                        </div>
                    )
                }
                {
                    topics.map( ( top, i) => {
                        return (
                            <div className="Topic"
                                style={{backgroundColor:i===selected&&'red'}}
                                onClick={ () => setSelected( i)}
                                key={i}
                            >
                                {top.Title}
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
                {
                    addFile?(
                        <AddFileForm
                            close={closeAddFile}
                            addFile={addFileFunc}
                        />
                    ):(
                        <button
                            onClick={openAddFile}
                        >
                            Add file
                        </button>
                    )
                }
            </div>
            <div className="LibraryBody">
                {
                    selected !== null&&(
                        topics[selected].files.length === 0?(
                            <div className="NoFiles">
                                <h2>No files available</h2>
                            </div>
                        ):(
                            topics[selected].files.map( ( f, i) => {

                                if (search) {
                                    if ( f.Title.toLowerCase().includes( search)) {
                                        return(
                                            <div className="File"
                                                key={i}
                                            >
                                                <div className="fileName">
                                                    {
                                                        f.Type === 'txt'?(
                                                            <i className='bx bxs-file-txt'></i>
                                                        ):f.Type === 'pdf'?(
                                                            <i className='bx bxs-file-pdf'></i>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                    <h5>{f.Title}</h5>  
                                                </div>
                                                <div className="fileMetadata">
                                                    <h5>{f.LastUpdate}</h5>
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
                                                f.Type === 'txt'?(
                                                    <i className='bx bxs-file-txt'></i>
                                                ):f.Type === 'pdf'?(
                                                    <i className='bx bxs-file-pdf'></i>
                                                ):(
                                                    <></>
                                                )
                                            }
                                            <h5>{f.Title}</h5>  
                                        </div>
                                        <div className="fileMetadata">
                                            <h5>{f.LastUpdate}</h5>
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


