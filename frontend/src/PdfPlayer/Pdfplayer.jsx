
import './PdfPlayer.css'

import { useEffect, useRef, useState } from 'react';

import { pdfjs, Document, Page } from 'react-pdf';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';



pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();
  
const options = {
cMapUrl: '/cmaps/',
standardFontDataUrl: '/standard_fonts/',
};

const PdfPlayer = () => {


    const [ numPages, setNumPages] = useState()

    const [ scale, setScale] = useState(1)

    const [ pageWidth, setPageWidth] = useState(800)

    function changeWidth() {
        const elm = document.querySelector('.PdfPlayerContent')
        if (elm) setPageWidth( elm.offsetWidth-40)
    }

    useEffect(() => {

        const elm = document.querySelector('.PdfPlayerContent')

        const resizeObserver = new ResizeObserver(changeWidth)

        if (elm) resizeObserver.observe(elm)
    
        return () => {
            if (elm) resizeObserver.unobserve(elm);
        };
    }, []);

    function onDocumentLoadSuccess( nextNumPages) {
        setNumPages( nextNumPages._pdfInfo.numPages)
    }



    return (
        <div className="PdfPlayer">

            <div className="PdfPlayerContent">
                <Document file={'src/PdfPlayer/compte_rendu_2.pdf'} options={options} onLoadSuccess={onDocumentLoadSuccess} >

                {
                    Array.from( new Array( numPages), ( _, i) => (
                        <Page
                            key={`page_${i + 1}`}
                            pageNumber={i+1}
                            scale={scale}
                            width={pageWidth}
                            renderTextLayer={false} // Optional: Disable text layer
                            renderAnnotationLayer={false} // Optional: Disable annotations
                        />
                    ))
                }
                </Document>
            </div>

            
        </div>
    );
}





export default PdfPlayer;
