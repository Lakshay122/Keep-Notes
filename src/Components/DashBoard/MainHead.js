import * as React from 'react';
import { styled, createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { List, Toolbar, Typography, Divider, Badge, Button , Avatar, CssBaseline, Box, Menu, MenuItem, Tooltip, InputBase } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import ListItemIcon from '@mui/material/ListItemIcon';

import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import ContentFile from '../Routes/ContentFile';
import { SearchRounded } from '@mui/icons-material';
import {  useState } from "react";
import { Dashboard } from '@mui/icons-material';
import axios from 'axios';

const drawerWidth = 240;






const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));
  


const mdTheme = createTheme();

export default function MainHead() {
    const [title , setTitle] = useState("dashboard");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [searchNotes, setSearchNotes] = React.useState([]);
    const openi = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [open, setOpen] = React.useState(false);
 
    const handleLogout = () => {

        sessionStorage.clear();
        localStorage.clear();
        navigate('Sign')
            

    }

    let value = localStorage.getItem("token");
    if (!value) {
        value = sessionStorage.getItem("token");
    }

    const config = {
        headers: { Authorization: `Bearer ${value}` },
    };


    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');

    const handleInputChange = (event) => {
        setSearchValue(event.target.value)
        axios.get(`https://keepnotes-5qsn.onrender.com/api/get-notes/${event.target.value}`,config)
        .then((res)=>{
            console.log("search",res)
            setSearchNotes(res.data.notes)
        })
    };
    return (
        <ThemeProvider theme={mdTheme}>
            <Box className='d-flex'>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar >
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                        >
                           Notes App
                        </Typography>

                        <Search>
                            <SearchIconWrapper>
                                <SearchRounded />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search your title…"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={handleInputChange}
                                value={searchValue}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <Tooltip title="LogOut">
                                <IconButton
                                    onClick={handleLogout}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    {/* <Avatar sx={{ width: 32, height: 32 }}>V</Avatar> */}
                                    <Logout style={{color:"#fff"}} fontSize="small" />

                                </IconButton>
                            </Tooltip>
                        </Box>
                      

                    </Toolbar>
                </AppBar>
                
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    
                    <ContentFile searchNotes= {searchNotes}/>
                </Box>
            </Box>
        </ThemeProvider >
    );
}





