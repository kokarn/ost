import {
    useState,
    useRef,
} from 'react';

import {
    // Link,
    Outlet,
    NavLink,
} from "react-router-dom";

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Container from '@mui/material/Container';
// import Drawer from '@mui/material/Drawer';
// import Divider from '@mui/material/Divider';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';


// Icons
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person';

import Skills from './Skills.js';

import pages from '../data/routes.json';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
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
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));


function MainMenu({handleFilterChange, playerName, playerStats, handlePlayerNameChange}) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const inputRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [anchorElCalculators, setAnchorElCalculators] = useState(null);

    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };

    const handleOpenCalculatorsMenu = (event) => {
        setAnchorElCalculators(event.currentTarget);
    };

    const handleCloseCalculatorsMenu = () => {
        setAnchorElCalculators(null);
    }

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);



    // const drawer = (
    //     <div>
    //         <Toolbar />
    //         <Divider />
    //         <List>
    //                 {pages.map((page, index) => (
    //                 <ListItem
    //                     key={page.key}
    //                     disablePadding
    //                 >
    //                     <ListItemButton
    //                         component={Link}
    //                         to={page.path}
    //                     >
    //                         <ListItemText
    //                             primary={page.label}
    //                         />
    //                     </ListItemButton>
    //                 </ListItem>
    //                 ))}
    //         </List>
    //         {/* <Divider />
    //             <List>
    //                 {['All mail', 'Trash', 'Spam'].map((text, index) => (
    //                 <ListItem key={text} disablePadding>
    //                     <ListItemButton>
    //                     <ListItemIcon>
    //                         {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
    //                     </ListItemIcon>
    //                     <ListItemText primary={text} />
    //                     </ListItemButton>
    //                 </ListItem>
    //                 ))}
    //         </List> */}
    //     </div>
    // );

    return (<Box
        sx={{ flexGrow: 1 }}
    >
            {/* A "layout route" is a good place to put markup you want to
        share across all the pages on your site, like navigation. */}
        <AppBar
            position="static"
        >
            <Toolbar
                disableGutters
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        display: {
                            xs: 'flex',
                            md: 'none',
                        }
                    }}
                >
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: {
                                xs: 'block',
                                md: 'none',
                            },
                        }}
                    >
                        {pages.map((page) => {
                            return (<MenuItem
                                key={`mobile-${page.path}`}
                                onClick={handleCloseNavMenu}
                            >
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        display: 'block',
                                    }}
                                >
                                    <NavLink
                                        to = {`${page.path}`}
                                    >
                                        {page.label}
                                    </NavLink>
                                </Button>
                            </MenuItem>)
                        })}
                    </Menu>
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: {
                            xs: 'none',
                            md: 'flex',
                        }
                    }}
                >
                    {pages.map((page) => {
                        if(page.type === 'calculator'){
                            return null;
                        }

                        return (
                            <Button
                                key={`desktop-${page.path}`}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    display: 'block',
                                }}
                            >
                                <NavLink
                                    className={'nav-link'}
                                    to = {`${page.path}`}
                                    style={{
                                        animation: 'all 0.5s ease-in-out',
                                        color: 'white',
                                        // textUnderlineOffset: '2px',
                                    }}
                                >
                                    {page.label}
                                </NavLink>
                            </Button>
                        );
                    })}
                    <Button
                        // key={`desktop-${page.path}`}
                        onClick={handleOpenCalculatorsMenu}
                        sx={{
                            color: 'white',
                        }}
                    >
                        <NavLink
                            className={'nav-link'}
                            style={{
                                animation: 'all 0.5s ease-in-out',
                                color: 'white',
                                // textUnderlineOffset: '2px',
                            }}
                        >
                            {'Calculators'}
                        </NavLink>
                    </Button>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElCalculators}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElCalculators)}
                        onClose={handleCloseCalculatorsMenu}
                    >
                        {pages.map((page) => {
                            if(page.type !== 'calculator'){
                                return null;
                            }

                            return (<MenuItem
                                key={`mobile-${page.path}`}
                                onClick={handleCloseCalculatorsMenu}
                                to = {`${page.path}`}
                                component={NavLink}
                                sx={{
                                    py: 2,
                                    display: 'block',
                                }}
                            >
                                {page.label}
                            </MenuItem>)
                        })}
                    </Menu>
                </Box>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpen}
                    color="inherit"
                >
                    <PersonIcon />
                </IconButton>
                <Modal
                    open={modalOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        autoComplete="off"
                        // component="form"
                        noValidate
                        sx={{
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            left: '50%',
                            outline: 0,
                            p: 2,
                            position: 'absolute',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            // width: 400,
                        }}
                    >
                        <Container
                            sx={{
                                padding: 0,
                            }}
                        >
                            <Skills
                                playerName={playerName}
                                playerStats={playerStats}
                                setPlayerName={handlePlayerNameChange}
                            />
                        </Container>
                    </Box>
                </Modal>
                <Box
                    sx={{
                        marginRight: '12px',
                    }}
                >
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            autoFocus
                            endAdornment ={ <IconButton
                                //   sx={{ visibility: true ? "visible" : "hidden" }}
                                  onClick={() => {
                                    inputRef.current.value = '';
                                    inputRef.current.focus();
                                    handleFilterChange({
                                        target: {
                                            value: '',
                                        }
                                    });
                                  }}
                                >
                                    <ClearIcon />
                            </IconButton>}
                            inputProps={{
                                'aria-label': 'search',
                            }}
                            inputRef={inputRef}
                            onChange={handleFilterChange}
                            placeholder="Search…"
                        />
                    </Search>
                </Box>
            </Toolbar>
        </AppBar>
        {/* <Box
            component='nav'
        >
            <Drawer
                open={true}
                variant="permanent"
            >
                {drawer}
            </Drawer>
        </Box> */}
        {/* An <Outlet> renders whatever child route is currently active,
        so you can think about this <Outlet> as a placeholder for
        the child routes we defined above. */}
        <Outlet />
    </Box>
);
}

export default MainMenu;