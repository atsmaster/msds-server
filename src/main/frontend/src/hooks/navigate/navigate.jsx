
import React, { useRoutes } from 'react-router-dom';

import Home from '../../components/home/Home'
import PdfViewer from '../../components/viewer/PdfViewer'
import PdfMainViewer from '../../components/viewer/PdfMainViewer'
import SearchView from '../../components/search/SearchView'

const Path = [
    { path: '/', element: <Home />, name: "HOME" },
    { path: '/search', element: <SearchView />, name: "SearchView" },
    { path: '/pdf', element: <PdfMainViewer />, name: "PdfViewer" },
    { path: '*', element: <Home />, name: "HOME" },
]

const MyRoutes = () => {
    const routerHook = useRoutes(Path);
    return routerHook
}


export default MyRoutes