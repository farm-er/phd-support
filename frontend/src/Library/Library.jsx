
import { useEffect, useState } from 'react';
import './Library.css'

import { GetTopics, GetTopicFiles, AddTopic, DeleteTopic, AddFileToTopic, DeleteFileFromTopic, AddVideo, GetTopicVideos, DeleteVideo } from '../../wailsjs/go/database/Db'
import BackgroundQuit from '../components/BackgroundQuit/BackgroundQuit';
import { useNavigate } from 'react-router-dom';




const FileComp = ({ f, deleteFileFunc, deleteVideoFunc, openVideoPlayer, openPdfPlayer, i}) => {


    function deleteRessource(e) {
        e.preventDefault()
        e.stopPropagation()

        if (f.Type === 'video') {
            deleteVideoFunc( f.Id, i)
        }else {
            deleteFileFunc( f.Title, f.Type, f.Id, i)
        }

    }


    function openPlayer() {

        switch (f.Type) {
            case 'video':
                openVideoPlayer( f)
                break;

            case 'pdf':
                openPdfPlayer( f)
                break;
        
            case 'doc', 'docx':
                
                break;
            default:
                break;
        }

    }

    return (
        <div className="File"
            onClick={openPlayer}
        >
            <div className="fileName">
                {
                    f.Type === 'pdf'?(
                        <img src="src/assets/icons/pdf.svg" alt="" />
                    ):f.Type === 'doc' || f.Type === 'docx'?(
                        <img src="src/assets/icons/word.svg" alt="" />
                    ):f.Type === 'video'&&(
                        <img src="src/assets/icons/video.svg" alt="" />
                    )
                }
                <h5>{f.Title}</h5>  
            </div>
            <div className="fileMetadata">
                <h5>{f.LastUpdate}</h5>
            </div>
            <div className="fileDelete"
                onClick={deleteRessource}
            >
                <img src="src/assets/icons/trash.svg" alt="" />
            </div>
        </div>
    );
    
}

const AddTopicForm = ({ close, addTopic}) => {

    const [ title, setTitle] = useState('')


    

    return (
        <div className="AddTopicForm">
            <div className="AddTopicName">
                <input 
                    type="text"
                    placeholder='name ...'
                    value={title}
                    onChange={(e) => setTitle( e.target.value)}
                />
            </div>
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


const AddFileForm =  ({ close, addFile, addVideo}) => {


    const [ title, setTitle] = useState('')
    
    const [ link, setLink] = useState('')

    const [ type, setType] = useState('pdf')


    function clearFields() {
        setLink('')
        setTitle('')
    }

    function addFileVideo() {
        if ( type === 'video' ) {
            addVideo( title, link);
        }else {
            addFile( title, type);
        }
        clearFields();
        close();
    }


    return(
        <>
            <BackgroundQuit
                onClose={close}
            />
            <div className="AddFileForm">


                <div className="FileFormTitle">
                    <label htmlFor="">Nom {type==='video'?'de la video':'du fichier'}: </label>
                    <input 
                        type="text"
                        placeholder='title...'
                        value={title}
                        onChange={ (e) => setTitle( e.target.value)}
                    />
                </div>
            
                {
                    type==='video'&&(
                        <div className="FileFormLink">
                            <label htmlFor="">Lien de la video: </label>
                            <input 
                                type="text"
                                placeholder='link...'
                                value={link}
                                onChange={ (e) => setLink( e.target.value)}
                            />
                        </div>
                    )
                }

                <div className="FileFormType">
                    <select
                        value={type}
                        onChange={ (e) => {
                            setType( e.target.value)
                        }}
                    >
                        <option value="pdf">pdf</option>
                        <option value="doc">doc</option>
                        <option value="docx">docx</option>
                        <option value="video">video</option>
                    </select>
                </div>


                <div className="FileFormAction">
                    <button
                        onClick={addFileVideo}
                    >
                        ADD
                    </button>
                    <button
                        onClick={clearFields}
                    >
                        CLEAR
                    </button>
                </div>

            </div>
        </>
        
    );

}


const Library = () => {

    const navigate = useNavigate()


    function openVideoPlayer( video) {
        navigate( '/videoplayer', { state: video})
    }

    function openPdfPlayer( pdfFile) {
        navigate( '/pdfplayer', { state: pdfFile})
    }

    const [ topics, setTopics] = useState([])

    const getTopics = async () => {

        // TODO: try and fetch for data concurrently
        try {
            const tops = await GetTopics();

            const contentPromises = tops.map( 
                async ( topic) => {
                    const [ files, videos] = await Promise.all(
                        [
                            GetTopicFiles( topic.Id),
                            GetTopicVideos( topic.Id)
                        ]
                    )

                    return {
                        ...topic,
                        files: [
                            ...( files || []),
                            ...(videos?.map( video => ({...video, Type: 'video'})) || [] )
                        ],
                    }
                }
            )


            const topicsWithContent = await Promise.all( contentPromises) 
            
            // for (let i=0; i<tops.length; i++) {
            //     const files = await GetTopicFiles( tops[i].Id)
            //     const vids = await GetTopicVideos(tops[i].Id);

            //     tops[i].files = [files] || []

            //     vids.forEach(video => {
            //         top[i].files = [...top[i].files, {...video, Type: 'video'}]
            //     });

            // }
            
            setTopics( topicsWithContent)
        
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


    const addVideoFunc = ( title, link) => {

        AddVideo( topics[selected].Id, title, link).then(
            ( video ) => {

                setTopics( prev => {
                    const topicsCopy = [...prev]

                    let selectedTopic = topicsCopy[selected]
                
                    selectedTopic = {
                        ...selectedTopic,
                        files:  [ {...video, Type: 'video'}, ...selectedTopic.files],
                    }

                    topicsCopy[selected] = selectedTopic

                    return topicsCopy
                })

            }
        )

    }


    const deleteVideoFunc = ( videoId, videoIndex) => {

        DeleteVideo( videoId).then(
            () => {
                setTopics( prev => {
                    const topicsCopy = [...prev]

                    let selectedTopic = topicsCopy[selected]
                
                    selectedTopic = {
                        ...selectedTopic,
                        files:  selectedTopic.files.filter( (_, i) => i !== videoIndex) ,
                    }

                    topicsCopy[selected] = selectedTopic

                    return topicsCopy
                })
            }
        )

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
                                style={{backgroundColor:i===selected&&'var(--bg-color)', border:i===selected&&'1px solid #fff', borderRight:i===selected&&'none'}}
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
                    addFile&&(
                        <AddFileForm
                            close={closeAddFile}
                            addFile={addFileFunc}
                            addVideo={addVideoFunc}
                        />
                    )
                }
                {
                     selected!==null&&(
                        <button
                            className='HeaderButtons'
                            onClick={openAddFile}
                        >
                            Add file
                        </button>
                    )
                }
                {
                    selected!==null&&(
                        <button
                            className='HeaderButtons'
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
                        topics[selected]?.files.length === 0?(
                            <div className="NoFiles">
                                <h2>No files available</h2>
                            </div>
                        ):(
                            topics[selected].files.map( ( f, i) => {

                                if (search !== "") {
                                    if ( f.Title.toLowerCase().includes( search)) {
                                        return(
                                            <FileComp
                                                key={i}
                                                i={i}
                                                f={f}
                                                deleteFileFunc={deleteFileFunc}
                                                openVideoPlayer={openVideoPlayer}
                                                openPdfPlayer={openPdfPlayer}
                                                deleteVideoFunc={deleteVideoFunc}
                                            />
                                        )
                                    } else {
                                        return
                                    }
                                }

                                return(
                                    <FileComp
                                        key={i}
                                        i={i}
                                        f={f}
                                        deleteFileFunc={deleteFileFunc}
                                        openVideoPlayer={openVideoPlayer}
                                        openPdfPlayer={openPdfPlayer}
                                        deleteVideoFunc={deleteVideoFunc}
                                    />
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


