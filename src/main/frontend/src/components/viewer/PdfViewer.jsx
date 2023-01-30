
import React, { Component, useState, useEffect, useReducer, useImperativeHandle } from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Link as RouterLink, LinkProps as RouterLinkProps, useNavigate, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getDocument, GlobalWorkerOptions, InvalidPDFException, MissingPDFException, UnexpectedResponseException ,AnnotationMode, version } from 'pdfjs-dist'
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer'

// import * as ff from 'pdfjs-dist/types/web/ui_utils'
import { useRef } from 'react';

import '../../assets/css/pdfviewer.css'
import sample from '../../assets/pdf/Get_Started_With_Smallpdf.pdf'
import sample_bigfile from '../../assets/pdf/sample_bigfile.pdf'
import sample1 from '../../assets/pdf/자료예제들/폴더1/1부서1그룹/1. ARCALOY 439.pdf'
import sample2 from '../../assets/pdf/자료예제들/폴더1/1부서1그룹/4. CR-13.pdf'
import sample3 from '../../assets/pdf/자료예제들/폴더1/1부서1그룹/8. 톨루엔.pdf'

import { Box, Button, Divider, IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import useWindowDimensions from '../../hooks/useWindowDemension.js'

const option = {
    USE_ONLY_CSS_ZOOM: true,
    TEXT_LAYER_MODE: 0,
    MAX_IMAGE_SIZE: 1024 * 1024,
    DEFAULT_SCALE_DELTA: 1.1,
    MIN_SCALE: 0.25,
    MAX_SCALE: 10.0,
    DEFAULT_SCALE_VALUE: "auto",
}

const Pdfviewer = React.forwardRef((props, ref) => {

    const { page , path } = props;

    const eventBus = useRef(new pdfjsViewer.EventBus())
    const linkService = useRef(new pdfjsViewer.PDFLinkService({
        eventBus: eventBus.current,
    }));
    const l10n = useRef(pdfjsViewer.NullL10n)

    const pdfLoadingTask = useRef(null)
    const pdfDocument = useRef(null)
    const pdfHistory = useRef(null)
    const viewerContainer = useRef(null);
    const viewer = useRef(null);
    const pdfViewer = useRef(null)

    let isChanged = false

    if(!GlobalWorkerOptions.workerSrc){
        // GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.2.146/pdf.worker.min.js"
        GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"
    }
    /**
     * React.forwardRef 종속을 가진 hook
     */
    useImperativeHandle(ref, () => ({
        onPrev: () => {
            console.log('prev')
            pdfViewer.current.currentPageNumber-=2
        },
        onNext: () => {
            console.log('onNext')
            pdfViewer.current.currentPageNumber+=2
        }
    }));

    useEffect(() => {
        if (!path){
            return;
        }
        if (!isChanged){
            pdfViewer.current = new pdfjsViewer.PDFViewer({
                container: viewerContainer.current,
                eventBus: eventBus.current,
                linkService: linkService.current,
                l10n: l10n.current,
                useOnlyCssZoom: true,
                textLayerMode: 0,
                annotationMode: AnnotationMode.ENABLE_FORMS,
                useOnlyCssZoom: true
            })
            open({ url: sample1 })
            isChanged = true;
        }

        return mclose();
    },[path]);


    eventBus.current.on("pagesinit", function () {
        pdfViewer.current.currentScaleValue = option.DEFAULT_SCALE_VALUE;
    });
    eventBus.current.on("pagechanging", function (evt) {
        const page = evt.pageNumber;

    }, true);


    function open(params) {
        console.log('open')
        if (pdfLoadingTask.current) {
            return close().then(() => {
                return open(params);
            })
        }

        const loadingTask = getDocument({
            url: params.url,
            maxImageSize: option.MAX_IMAGE_SIZE,
            // cMapUrl: option.CMAP_URL,
            // cMapPacked: option.CMAP_PACKED,
        });
        loadingTask.onProgress = function (progressData) {
            const level = progressData.loaded / progressData.total;
            const percent = Math.round(level * 100);
            // console.log(percent)
        };
        pdfViewer.current.spreadMode = pdfjsViewer.SpreadMode.ODD;
        pdfViewer.current.scrollMode = pdfjsViewer.ScrollMode.PAGE;

        return loadingTask.promise.then(doc => {
            console.log("[pdfDocument]", doc)
            pdfDocument.current = doc;
            pdfViewer.current.setDocument(doc);
            linkService.current.setDocument(doc);
            pdfHistory.current.initialize({
                fingerprint: doc.fingerprints[0],
            });
        }).catch(exception => {
            console.error("[exception]", exception)
            if (exception instanceof InvalidPDFException) {
                l10n.current.get("invalid_file_error", null, "Invalid or corrupted PDF file.");
            } else if (exception instanceof MissingPDFException) {

            } else if (exception instanceof UnexpectedResponseException) {

            } else {

            }
        })
    }

    function close() {
        console.log("CLOSE")
        if (!pdfLoadingTask.current) {
            return Promise.resolve()
        }
        const promise = pdfLoadingTask.current.destroy();
        pdfLoadingTask.current = null;
        if (pdfDocument.current) {
            pdfDocument.current = null
            pdfViewer.current.setDocument(null)
            linkService.current.setDocument(null)

            if (pdfHistory.current) {
                pdfHistory.current.reset();
            }
        }
        return promise;
    }

    function mclose(){
        close();
    }



    return <div ref={viewerContainer} id="viewerContainer" >
                <div ref={viewer} id="viewer" className="pdfViewer"></div>
           </div>
})
export default Pdfviewer;
// export default function PdfViewer(props) {
//     console.log(props)
//     const { page } = props;
//     // const [mPage,setPage] = useState(0);
//     // const { height, width } = useWindowDimensions();
//     // const [number, dispatch] = useReducer(pageReducer, 0);

//     const eventBus = useRef(new pdfjsViewer.EventBus())
//     const linkService = useRef(new pdfjsViewer.PDFLinkService({
//         eventBus: eventBus.current,
//     }));
//     const l10n = useRef(pdfjsViewer.NullL10n)

//     const pdfLoadingTask = useRef(null)
//     const pdfDocument = useRef(null)
//     const pdfHistory = useRef(null)
//     const viewerContainer = useRef(null);
//     const viewer = useRef(null);
//     const pdfViewer = useRef(null)

//     let isChanged = false

//     if(!GlobalWorkerOptions.workerSrc){
//         GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.2.146/pdf.worker.min.js"
//     }
//     useImperativeHandle(ref, () => ({
//         onPrev: () => {
//           console.log('onIncreased')
//         },
//         onNext: () => {
//             console.log('onDecreased')
//         }
//     }));

//     useEffect(() => {
//         if (!isChanged){
//             pdfViewer.current = new pdfjsViewer.PDFViewer({
//                 container: viewerContainer.current,
//                 eventBus: eventBus.current,
//                 linkService: linkService.current,
//                 l10n: l10n.current,
//                 useOnlyCssZoom: true,
//                 textLayerMode: 0,
//                 annotationMode: AnnotationMode.ENABLE_FORMS,
//                 useOnlyCssZoom: true
//             })
//             open({ url: sample1 })
//         }
//         isChanged = true;


//         return mclose();
//     },[]);


//     eventBus.current.on("pagesinit", function () {
//         pdfViewer.current.currentScaleValue = option.DEFAULT_SCALE_VALUE;
//     });
//     eventBus.current.on("pagechanging", function (evt) {
//         const page = evt.pageNumber;

//     }, true);


//     function open(params) {
//         console.log('open')
//         if (pdfLoadingTask.current) {
//             return close().then(() => {
//                 return open(params);
//             })
//         }

//         const loadingTask = getDocument({
//             url: params.url,
//             maxImageSize: option.MAX_IMAGE_SIZE,
//             // cMapUrl: option.CMAP_URL,
//             // cMapPacked: option.CMAP_PACKED,
//         });
//         loadingTask.onProgress = function (progressData) {
//             const level = progressData.loaded / progressData.total;
//             const percent = Math.round(level * 100);
//             // console.log(percent)
//         };
//         pdfViewer.current.spreadMode = pdfjsViewer.SpreadMode.ODD;
//         pdfViewer.current.scrollMode = pdfjsViewer.ScrollMode.PAGE;

//         return loadingTask.promise.then(doc => {
//             console.log("[pdfDocument]", doc)
//             pdfDocument.current = doc;
//             pdfViewer.current.setDocument(doc);
//             linkService.current.setDocument(doc);
//             pdfHistory.current.initialize({
//                 fingerprint: doc.fingerprints[0],
//             });
//         }).catch(exception => {
//             console.error("[exception]", exception)
//             if (exception instanceof InvalidPDFException) {
//                 l10n.current.get("invalid_file_error", null, "Invalid or corrupted PDF file.");
//             } else if (exception instanceof MissingPDFException) {

//             } else if (exception instanceof UnexpectedResponseException) {

//             } else {

//             }
//         })
//     }

//     function close() {
//         console.log("CLOSE")
//         if (!pdfLoadingTask.current) {
//             return Promise.resolve()
//         }
//         const promise = pdfLoadingTask.current.destroy();
//         pdfLoadingTask.current = null;
//         if (pdfDocument.current) {
//             pdfDocument.current = null
//             pdfViewer.current.setDocument(null)
//             linkService.current.setDocument(null)

//             if (pdfHistory.current) {
//                 pdfHistory.current.reset();
//             }
//         }
//         return promise;
//     }

//     function mclose(){
//         close();
//     }

//     function Increase(){
//         pdfViewer.current.currentPageNumber+=2
//     }

//     function Decrease(){
//         pdfViewer.current.currentPageNumber-=2
//     }

//     return <div ref={viewerContainer} id="viewerContainer" >
//                 <div ref={viewer} id="viewer" className="pdfViewer"></div>
//            </div>
// }



