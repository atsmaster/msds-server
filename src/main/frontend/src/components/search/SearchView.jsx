import { Box, Button, Container, Divider, IconButton, MenuItem, Select, Typography } from '@mui/material';
import React, { Component, useRef } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useContext, useEffect } from 'react';
import { GlobalDataStore } from '../../context/GlobalDataStoreContext';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { TeamData, FileCtgrData, FileData } from '../../data/TeamCtgrData';
import useActiveElement from '../../hooks/useActiveElement';
import { createFuzzyMatcher } from '../../hooks/useReg';


/**
 * static values
 */
const teamDataList = TeamData.make();
const fileCtgrDataList = FileCtgrData.make();
const tableSize = 650


/**
 * budle data of fragment
 * @param {*} data 
 * @param {*} id 
 * @returns 
 */
const bundleOf = (data, id) => {
    let list = Object.values(data);
    let rs = list.map((e) => {
        let idx = teamDataList.findIndex(item => item.team_id === e)
        if (idx >= 0) return teamDataList[idx].team_dir_nm
        return ""
    })
    let rsString = rs.join(" ")
    let find = fileCtgrDataList.find(e => e.file_ctgr_id == id)

    return {
        name: find ? find.file_ctgr_nm : "",
        team: rsString,
        teamId: list[list.length - 1]
    }
}

/**
 * Header Info
 * @returns 
 */
function SearchViewHeader(props) {
    const { name, team } = props
    return <Box>
        <Typography
            variant="h5"
            gutterBottom
            sx={{ textAlign: 'center', mt: 1 }}>
            {name} 검색 {team}
        </Typography>
    </Box>
}

/**
 * Search Input View
 * @param {*} props 
 * @returns 
 */
function SearchViewInputArea(props) {
    const { OnChange } = props
    const focusedElement = useActiveElement();
    const inputRef = useRef()
    const [searchValue, setSearchValue] = useState()

    useEffect(() => {
        if (inputRef.current.querySelector('input') == focusedElement) {
            if (OnChange) {
                OnChange(searchValue)
            }
        }
    }, [searchValue])

    return <React.Fragment>
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            mt={2}
        >
            <Typography
                variant="h5"
                minWidth="100px"
                gutterBottom> 제품명 검색 </Typography>
            <Input
                variant="h5"
                ref={inputRef}
                placeholder="코로나 전담 병원, 재택치료 검색"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                fullWidth
            />
            <Button variant="contained">검색</Button>
        </Stack>
    </React.Fragment>
}

/**
 * Grid View
 * @param {*} props 
 * @returns 
 */
function SearchViewGrid(props) {

    const { list, onClick } = props

    if (list && list.length > 0) {
        return <>
            <Table sx={{ minWidth: tableSize }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>NO</TableCell>
                        <TableCell>이름</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(list && list.length > 0) ? list.map((row, i) => (
                        <TableRow
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            onClick={onClick.bind(this, row)}
                        >
                            <TableCell component="th" scope="row">
                                {i}
                            </TableCell>
                            <TableCell >{row.file_nm}</TableCell>
                        </TableRow>
                    )) : (<div>Empty</div>)}
                </TableBody>
            </Table>
            <Stack spacing={2} >
                <Pagination count={10} variant="outlined" shape="rounded" sx={{ margin: "0 auto" }} />
            </Stack>
        </>
    }

    return <>
        <Box sx={{ width: 200, height: 200, margin: '0 auto' }}>
            <Typography>
                Empty
            </Typography>
        </Box>
    </>
}

export default function SearchView(props) {



    const navigate = useNavigate();
    const [global, setGlobal] = useContext(GlobalDataStore)
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation();

    let last = [...Object.values(global)].pop();
    const masterFiles = useRef(FileData.rootToMake(last));
    const [files, setFile] = useState([]);
    const [keyword, setKeyword] = useState()

    /**
     * 
     */
    const checkValidated = () => {
        if (!global?.department || !global?.department || !searchParams.get("id")) {
            alert("NOP")
            navigate("/", { replace: true })
            return false
        }
        return true
    }

    /**
     * Events
     * @param {*} keyword 
     */
    const OnChangeSearch = (keyword) => {
        setKeyword(keyword);
        console.log("#OnChangeSearch", keyword);
    }
    const OnClickSearch = (item) => {
        console.log("#OnClickSearch", item);
        if (item){
            navigate('/pdf?id='+item.file_id)
        }
    }
    

    const FilterCondition = (item) => {
        var last = [...Object.values(global)].pop();
        return item.file_ctgr_id == searchParams.get("id") && item.team_id == last;
    }
    /**
     * keyword hooks
     */
    useEffect(() => {
        if (keyword == undefined) {
            return;
        }
        if (keyword && keyword.length > 0) {
            setFile([...files].filter(item => createFuzzyMatcher(keyword).test(item.file_nm.toLowerCase())))
        } else {
            setFile([...masterFiles.current.filter(FilterCondition)]);
        }
    }, [keyword])

    /**
     * master hook
     */
    useEffect(() => {
        console.log("master change!")
    }, [masterFiles])

    /**
     * Location
     */
    useEffect(() => {
        if (!checkValidated()) {
            return;
        }
        setFile([...masterFiles.current.filter(FilterCondition)]);
        setKeyword(undefined);
    }, [location])

    return <Container>
        <SearchViewInputArea OnChange={OnChangeSearch} />
        <SearchViewGrid list={files} onClick={OnClickSearch} />
    </Container>
}