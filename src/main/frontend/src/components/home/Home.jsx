import { Box, Divider, IconButton, MenuItem, Select, Typography } from '@mui/material';
import React, { Component,useContext } from 'react';
import { FileData,FileThumbnail } from '../../data/TeamCtgrData'
import HomeSliderView from './HomeSliderView'
import { GlobalDataStore } from '../../context/GlobalDataStoreContext';

export default function Home(props) {
    const [global, setGlobal] = useContext(GlobalDataStore)
    const last = [...Object.values(global)].pop();
    const imgs = FileThumbnail.rootToMake(last)

    return <React.Fragment>
        <HomeSliderView children={imgs}></HomeSliderView>
    </React.Fragment>
}



