import { useEffect, useRef, useState } from 'react';
import './VideoPlayer.css'



import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';


const VideoPlayer = () => {

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );


    const customStyleMap = {
        HIGHLIGHT: { backgroundColor: 'red'},
        BOLD: { fontWeight: 900},
        FONT_SIZE_SMALL: { fontSize: '12px'},
        FONT_SIZE_MEDIUM: { fontSize: '16px'},
        FONT_SIZE_BIG: { fontSize: '24px'},
    }


    function handleBold(e) {
        e.preventDefault()
        e.target.classList.toggle('clicked')
        setEditorState( RichUtils.toggleInlineStyle( editorState, 'BOLD'))
    
    }

    function handleHighlight(e) {
        e.preventDefault()
        e.target.classList.toggle('clicked')
        setEditorState( RichUtils.toggleInlineStyle( editorState, 'HIGHLIGHT'))
    }

    useEffect( () => {
        console.log(editorState.getCurrentInlineStyle())
    }, [editorState])

    function handleFontSize(e) {

        const fontSize = e.target.value


        if (fontSize) setEditorState( RichUtils.toggleInlineStyle( editorState, fontSize))
    }


    return (
        <div className="VideoPlayer">
            <div className="VideoNote">
                <div className="VideoEditorWrapper">
                    <Editor
                        editorState={editorState}
                        customStyleMap={customStyleMap}
                        onChange={(editorState) => { setEditorState(editorState)}}
                    />
                </div>
                <div className="VideoNoteToolbar">
                    <select
                        onChange={ (e) => handleFontSize(e)}
                    >
                        <option value="FONT_SIZE_SMALL">S</option>
                        <option value="FONT_SIZE_MEDIUM">M</option>
                        <option value="FONT_SIZE_BIG">L</option>
                    </select>
                    <button
                        onMouseDown={ (e) => handleBold(e)}
                    >G</button>
                    <button
                        onMouseDown={ (e) => handleHighlight(e)}
                    >H</button>
                </div>
            </div>
            <div className="VideoSection">
                <iframe
                    src="https://www.youtube.com/embed/kQsHF7C-FUY"
                    title="I did a C++ University Assignment"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>

                <div className="VideoTitle">
                    Lorem ipsum dolor sit amet consectetur adipisicing.
                </div>
            </div>
        </div>
    );
}



export default VideoPlayer;
