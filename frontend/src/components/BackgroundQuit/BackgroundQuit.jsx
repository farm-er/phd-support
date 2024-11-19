




const BackgroundQuit = ( {onClose}) => {

    return (
        <div
            onClick={(e) => {e.stopPropagation(); onClose();}} 
            style={{
                position:'fixed',
                left:0,
                top:0,
                width:'100vw',
                height:'100vh',
                backgroundColor:'rgba(0, 0, 0, 0.34)',
                filter:'blur(10px)',
                zIndex:10,
            }}
            
        ></div>
    )

}


export default BackgroundQuit;


