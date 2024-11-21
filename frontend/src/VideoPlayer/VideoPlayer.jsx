import { useState } from 'react';
import './VideoPlayer.css'



import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';


const VideoPlayer = () => {

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
      );


    return (
        <div className="VideoPlayer">
            <div className="VideoNote">
                <Editor editorState={editorState} onChange={setEditorState} />
            </div>
            <div className="VideoSection">
                <iframe
                    src="https://www.youtube.com/embed/kQsHF7C-FUY"
                    title="I did a C++ University Assignment"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}



export default VideoPlayer;
