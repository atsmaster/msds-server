import React, { Component, useState, useEffect,useContext, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import '../../assets/css/pdfviewer.css'

import { Box, Button, Divider, IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


import PdfViewer from './PdfViewer';
import { GlobalDataStore } from '../../context/GlobalDataStoreContext';
import { FileCtgrData, FileData } from '../../data/TeamCtgrData';

const fileCtgrDataList = FileCtgrData.make();

export default function PdfMainViewer(props) {
    const actionRef = useRef();
    const [global, setGlobal] = useContext(GlobalDataStore)
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation();
    const navigate = useNavigate();

    const [ pdf,setPdf ] = useState(null)
    const [ bottomList,setBottomList ] = useState([])

    useEffect(()=>{
        let last = [...Object.values(global)].pop();
        let list = FileData.rootToMake(last);
        let id = searchParams.get("id")
        let find = list.find(item=> item.file_id == id && item.team_id == last)
        if (!find){
            alert("PDF not Found")
            navigate('/')
        } else {
            const keyword = find.file_nm.split("_").pop()
            const relativeFind = list.filter(item => item.file_nm.includes(keyword))
            // relativeFind.map(item => item.file_ctgr_id )
            // file_ctgr_id
            // console.log("relativeFind",relativeFind)
            // relativeFind.map(item => )
            // fileCtgrDataList.find(it=> it.file_ctgr_id == item.file_ctgr_id)
            setBottomList(relativeFind)
            setPdf(find)
        }
    },[location])

    return <React.Fragment>
        <div className='viewerRoot' >
            <div className='button-wrapper'>
                <IconButton size='large' onClick={() => actionRef.current.onPrev()}>
                    <ArrowBackIosNewIcon />
                </IconButton>
            </div>
            <PdfViewer ref={actionRef} path={pdf?.file_path}/>
            <div className='button-wrapper right'>
                <IconButton size='large' onClick={() => actionRef.current.onNext()}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </div>
        </div>
        <Box style={{ width: "100%", position: 'absolute', bottom: 0, left: 0 }}>
            <Divider />
            <Stack direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ mb: 1, mt: 1 }}>
                    {/* {bottomList.map(item=>{
                      return <Button>해당 제품 MSDS 원본 보기</Button>
                    })} */}
                <Button>해당 제품 MSDS 원본 보기</Button>
                <Button>부착물1 보는중</Button>
                <Button>해당 제품 부착물2 보기</Button>
            </Stack>
        </Box>
    </React.Fragment>
}