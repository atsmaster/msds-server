import { Box, Divider, IconButton, MenuItem, Select, Typography } from '@mui/material';
import React, { Component,useContext } from 'react';
import { FileData,FileThumbnail } from '../../data/TeamCtgrData'
import HomeSliderView from './HomeSliderView'
import { GlobalDataStore } from '../../context/GlobalDataStoreContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Home(props) {
    const [global, setGlobal] = useContext(GlobalDataStore)
    const last = [...Object.values(global)].pop();
    const imgs = FileThumbnail.rootToMake(last)
    const location = useLocation();

    // useEffect(()=>{
    //     console.log(global)
    // },[location])
    
    if (!global.department&&!global.group){
        return <></>
    } 
    return <React.Fragment>
        <HomeSliderView children={imgs}></HomeSliderView>
    </React.Fragment>
}



