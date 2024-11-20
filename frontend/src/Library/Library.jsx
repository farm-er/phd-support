
import { useEffect, useState } from 'react';
import './Library.css'

import { GetTopics, GetTopicFiles, AddTopic, DeleteTopic, AddFileToTopic, DeleteFileFromTopic } from '../../wailsjs/go/database/Db'
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

    const [ type, setType] = useState('pdf')


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
                setSelected( 0)
            }
        )

    }

    const deleteTopicFunc = ( topicName, topicId, topicIndex) => {

        DeleteTopic( topicName, topicId).then(
            () => {
                setTopics( prev => {
                    const t = [...prev]

                    return t.filter( (_, i) => i !== topicIndex)
                })
            }
        ).catch( (e) => console.log(e))

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

                // BUG: MADE BY SOHAIB

                // const topicsCopy = [...topics]

                // var selectedTopic = topicsCopy[selected]
            
                // selectedTopic.files.push(file)

                // setTopics(topicsCopy)

                setTopics( prev => {
                    const topicsCopy = [...prev]

                    let selectedTopic = topicsCopy[selected]
                
                    selectedTopic = {
                        ...selectedTopic,
                        files:  [ file, ...selectedTopic.files],
                    }

                    topicsCopy[selected] = selectedTopic

                    return topicsCopy
                })
            }
        ).catch( (e) => console.log(e))
    }


    const deleteFileFunc = ( fileName, fileType, fileId, fileIndex) => {

        DeleteFileFromTopic(  topics[selected].Title, fileName, fileType, fileId).then(
            () => {
                setTopics( prev => {
                    const topicsCopy = [...prev]

                    let selectedTopic = topicsCopy[selected]
                
                    selectedTopic = {
                        ...selectedTopic,
                        files:  selectedTopic.files.filter( (_, i) => i !== fileIndex) ,
                    }

                    topicsCopy[selected] = selectedTopic

                    return topicsCopy
                })
            }
        ).catch( (e) => console.log(e))

    }


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
                    ):selected!==null&&(
                        <button
                            onClick={openAddFile}
                        >
                            Add file
                        </button>
                    )
                }
                {
                    selected!==null&&(
                        <button
                            onClick={ () => deleteTopicFunc( topics[selected].Title, topics[selected].Id, selected)}
                        >
                            delete Topic
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


                                if (search !== "") {
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
                                                        ):f.Type === 'doc' || f.Type === 'docx'?(
                                                            <i className='bx bxs-file-doc'></i>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                    <h5>{f.Title}</h5>  
                                                </div>
                                                <div className="fileMetadata">
                                                    <h5>{f.LastUpdate}</h5>
                                                </div>
                                                <div className="fileDelete">
                                                    <i class='bx bx-trash' ></i>
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
                                                ):f.Type === 'doc' || f.Type === 'docx'?(
                                                    <i className='bx bxs-file-doc'></i>
                                                ):(
                                                    <></>
                                                )
                                            }
                                            <h5>{f.Title}</h5>  
                                        </div>
                                        <div className="fileMetadata">
                                            <h5>{f.LastUpdate}</h5>
                                        </div>
                                        <div className="fileDelete"
                                            onClick={() => deleteFileFunc( f.Title, f.Type, f.Id, i)}
                                        >
                                            <i className='bx bx-trash' ></i>
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


