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
            setBottomList(relativeFind)
            setPdf(find)
        }
    },[location])

    const OnClickBottom = function(item){
        console.log(item);
        navigate('/pdf?id='+item.file_id,{replace: true})
    }
    console.log("bottomList",bottomList);

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
                {bottomList.map(item=> {
                    let id = searchParams.get("id")
                    if (!id){
                        return <></>;
                    }
                    const find = fileCtgrDataList.find(it=>it.file_ctgr_id == item.file_ctgr_id);
                    //current
                    if (item.file_id == id){
                        if (find){
                            return <Button disabled>{find?.file_ctgr_nm} 보는중</Button>
                        } else {
                            return <Button disabled>{item?.file_nm} 보는중</Button>
                        }
                    } else {
                        if (find){
                            return <Button onClick={OnClickBottom.bind(this,item)}>{find?.file_ctgr_nm} 보기</Button>
                        } else {
                            return <Button onClick={OnClickBottom.bind(this,item)}>{item?.file_nm} 보기</Button>
                        }
                    }
                })

                }
                {/* <Button>해당 제품 MSDS 보기</Button>
                <Button>경고표시 보는중</Button>
                <Button>작업공정 별 관리요청 보기</Button> */}
            </Stack>
        </Box>
    </React.Fragment>
}