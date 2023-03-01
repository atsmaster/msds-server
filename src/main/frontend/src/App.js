
import React, { Component, useContext, useEffect, useState } from 'react';
import {
  useLocation,
  HashRouter,
} from 'react-router-dom';

import { useNavigate, BrowserRouter } from 'react-router-dom';
import Home from './components/home/Home';
import MyRoutes from './hooks/navigate/navigate';
import { useSearchParams } from 'react-router-dom'

import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';

// import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import ListItemText from '@mui/material/ListItemText';
// import MailIcon from '@mui/icons-material/Mail';
// import MenuIcon from '@mui/icons-material/Menu';
import './assets/css/App.css'
import Typography from '@mui/material/Typography';
import { Container } from '@mui/system';
import { TeamCtgrData, TeamData, FileCtgrData, FileData } from './data/TeamCtgrData.jsx'
import { Button, createTheme, ThemeProvider, Toolbar } from '@mui/material';
import { useDialog } from './context/DialogProvider';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';
import { GlobalDataStore } from './context/GlobalDataStoreContext';
import HeaderBreadCrum from './components/common/HeaderBreadCrum';




const drawerWidth = 200;
const dropBox = 120;


const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#000000',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        regular: {
          height: "32px",
          minHeight: "32px",
          "@media (min-width: 600px)": {
            minHeight: "48px",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "32px"
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontSize: "24px"
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: "24px"
        }
      },
    },
  },
});

// #263238
theme.typography.title = {
  fontWeight: 900,
  lineHeight: 1.33,
  letterSpacing: '-0.42px',
  fontSize: '2.4rem',
  [theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
}
theme.typography.subTitle = {
  fontWeight: 600,
  lineHeight: 1.33,
  letterSpacing: '-0.42px',
  fontSize: '2.0rem',
  // '@media (min-width:600px)': {
  //   fontSize: '1.2rem',
  // },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.0rem',
  },
}
theme.typography.span = {
  fontWeight: 600,
  lineHeight: 1.33,
  letterSpacing: '-0.42px',
  fontSize: '1.6rem',
  [theme.breakpoints.up('md')]: {
    fontSize: '1.6rem',
  },
}


export default function App(props) {

  return <React.Fragment>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <DashboardContent />
      </ThemeProvider>
    </HashRouter>
  </React.Fragment>
}


const teamDataList = TeamData.make();
const teamCtgrDataList = TeamCtgrData.make();
const fileCtgrDataList = FileCtgrData.make();

function DashboardContent() {
  /**
   * Data
   */
  const [breadcrumbList, setBreadcrumbs] = useState([]);
  const [global, setGlobal] = useContext(GlobalDataStore)
  const [searchParams, setSearchParams] = useSearchParams()

  const [department, setDepartment] = React.useState(global.department);
  const [group, setGroup] = React.useState(global.group);
  const location = useLocation();


  /**
   * Hooks
   */
  const navigate = useNavigate()
  const [openDialog, closeDialog] = useDialog();

  /**
   * Event
   * @param {*} event 
   */
  const handleChange = (event) => {
    setDepartment(event.target.value);
    setGroup('')
  };
  const handleChange2 = (event) => {
    setGroup(event.target.value);
  };
  const onClickSearch = function (item) {
    if (!department || !group) {
      openDialog({
        children: (
          <>
            <DialogTitle>알림</DialogTitle>
            <DialogContent>부서 또는 공정을 지정해주세요</DialogContent>
            <DialogActions>
              <Button color="primary" onClick={closeDialog}>Close</Button>
            </DialogActions>
          </>
        )
      })
      return;
    }
    setGlobal({
      department, group
    })

    navigate('/search?id=' + item.file_ctgr_id)
  };

  /**
   * For breadcrumb Navigation
   */
  React.useEffect(() => {
    console.log("APP page Changed!")
    /**
     * Home
     */
    if (location.pathname == '/') {
      setBreadcrumbs(["MSDS보기"])
    }
    /**
     * Search 
     */
    else if (location.pathname == '/search') {
      const searchId = searchParams.get('id')
      const searchfind = fileCtgrDataList.find(item => item.file_ctgr_id == searchId)
      if (searchfind) {
        setBreadcrumbs(["MSDS", searchfind.file_ctgr_nm])
      } else {
        setBreadcrumbs(["MSDS"])
      }
    }
    /**
     * PDF
     */
    else if (location.pathname == '/pdf') {
      const searchId = searchParams.get('id')
      let last = [...Object.values(global)].pop();
      let list = FileData.rootToMake(last)
      const searchfind = list.find(item => item.file_id == searchId)
      if (searchfind) {
        const filectgr = fileCtgrDataList.find(item => item.file_ctgr_id == searchfind.file_ctgr_id)
        if (filectgr) {
          setBreadcrumbs(["MSDS", filectgr.file_ctgr_nm, searchfind.file_nm])
        } else {
          setBreadcrumbs(["MSDS"])
        }
      } else {
        setBreadcrumbs(["MSDS"])
      }
    }
    /**
     * Others
     */
    else {
      setBreadcrumbs([])
    }
  }, [location])


  // document.body.addEventListener("scroll",function(){
  //   document.body.scrollTop = 0;
  // })

  return (<>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* side bar drawer */}
      <AppBar position="fixed" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ minHeight: '36px' }}>
          <Typography variant="subTitle" noWrap component="div">
            MSDS manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          height: 'calc(100% - 64px)',
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "#f9f9f9",
            color: "#000000"
          },
        }}

        variant="permanent"
        anchor="left">
        <Toolbar />
        <Stack spacing={2}>
          <List>
            {/* 소속 */}
            <ListItem>
              <Stack spacing={1}>
                <Typography variant="title">소속</Typography>
                <Stack>
                  <Typography variant="span">부서</Typography>
                  <FormControl sx={{ minWidth: dropBox }}>
                    <Select
                      value={department}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}>
                      <MenuItem value="">
                        <Typography variant='h3'>
                          부서 선택
                        </Typography>
                      </MenuItem>
                      {teamDataList.filter(item => item.team_up_id == 0).map(item =>
                        <MenuItem key={item.team_id} value={item.team_id}>
                          <Typography variant='h3'>
                            {item.team_dir_nm}
                          </Typography>
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack>
                  <Typography variant="span">공정</Typography>
                  <FormControl sx={{ minWidth: dropBox }}>
                    <Select
                      value={group}
                      onChange={handleChange2}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }} >
                      <MenuItem value="">
                        <Typography variant='h3'>
                          공정 선택
                        </Typography>
                      </MenuItem>
                      {teamDataList.filter(item => item.team_up_id == department).map(item =>
                        <MenuItem key={item.team_id} value={item.team_id}>
                          <Typography variant='h3'>
                            {item.team_dir_nm}
                          </Typography>
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Stack>
                <Box>
                  <Button
                    variant="contained"
                    // fullWidth
                    style={{ width: "160px", height: "40px", fontSize: '1.5rem' }}
                    sx={{ p: 1 }}
                    onClick={() => {
                      // console.log(department,group);
                      // if (!department&&!group){
                      //   setGlobal({ department, group})
                      // }
                      setGlobal({ department, group })
                      navigate('/', { replace: true }
                      )
                    }}>적용</Button>
                </Box>
              </Stack>
            </ListItem>
            <Divider />
            {/* 메인 화면 */}
            <ListItem onClick={() => { navigate('/') }}>
              <ListItemButton selected={location.pathname == '/'} sx={{ p: 0 }}>
                <Typography variant="title" > MSDS보기 </Typography>
              </ListItemButton>
            </ListItem>
            {/* 자료검색 */}
            <ListItem>
              <Typography variant="title"> 검색 </Typography>
            </ListItem>
            {fileCtgrDataList.map(item =>
              <ListItem
                style={{ paddingTop: 0, paddingBottom: 0 }}
                key={item.team_ctgr_id}
                onClick={onClickSearch.bind(this, item)}>
                <ListItemButton
                  selected={searchParams.get("id") == item.file_ctgr_id}>
                  <ListItemText
                    primary={<Typography variant='subTitle'>{item.file_ctgr_nm}</Typography>} />
                </ListItemButton>
              </ListItem>)}
          </List>
        </Stack>
      </Drawer>

      {/* container */}
      <Container maxWidth={false} style={{ padding: 0 }}>
        <Toolbar />
        <HeaderBreadCrum list={breadcrumbList} />
        <MyRoutes />
      </Container>
    </Box>
  </>)
}
