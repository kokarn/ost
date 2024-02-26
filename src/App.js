import {
    useEffect,
    useState,
    useRef,
} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    // Link,
    Outlet,
    NavLink,
} from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ClearIcon from '@mui/icons-material/Clear';

import loadJSON from './modules/load-json.mjs';
import calculateProfit from './modules/calculate-profit.mjs';

import LevelCalculator from './pages/LevelCalculator.js';
import Items from './pages/Items.js';
import MoneyMaking from './pages/MoneyMaking.js';
import Crafts from './pages/Crafts.js';
import MonsterProfits from './pages/MonsterProfits.js';
import Implings from './pages/Implings.js';
import BurntValue from './pages/BurntValue.js';
import Admin from './pages/Admin.js';
import Stores from './pages/Stores.js';
import Diaries from './pages/Diaries.js';

import './App.css';

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

function Layout({handleFilterChange}) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const inputRef = useRef(null);

    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };

    const pages = [
        {
            key: 'items',
            label: 'Items',
            path: '/',
        },
        {
            key: 'money-making',
            label: 'Money Making',
            path: '/money-making',
        },
        {
            key: 'level',
            label: 'Level Calculator',
            path: '/level-calculator',
        },
        {
            key: 'crafts',
            label: 'Crafts',
            path: '/crafts',
        },
        {
            key: 'monster-profit',
            label: 'Monsters',
            path: '/monsters',
        },
        {
            key: 'implings',
            label: 'Implings',
            path: '/implings',
        },
        {
            key: 'burnt-value',
            label: 'Burnt Value',
            path: '/burnt-value',
        },
        {
            key: 'stores',
            label: 'Stores',
            path: '/stores',
        },
        {
            key: 'diaries',
            label: 'Diaries',
            path: '/diaries',
        },
        // {
        //     key: 'admin',
        //     label: 'Admin',
        //     path: '/admin',
        // },
    ];

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
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        {pages.map((page) => (
                            <MenuItem
                                key={`mobile-${page.path}`}
                                onClick={handleCloseNavMenu}
                            >
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    <NavLink
                                        to = {`${page.path}`}
                                    >
                                        {page.label}
                                    </NavLink>
                                </Button>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Button
                            key={`desktop-${page.path}`}
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, display: 'block' }}
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
                    ))}
                </Box>
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

        {/* An <Outlet> renders whatever child route is currently active,
        so you can think about this <Outlet> as a placeholder for
        the child routes we defined above. */}
        <Outlet />
    </Box>
);
}

function App() {
    const [latest, setLatest] = useState([]);
    const [mapping, setMapping] = useState({});
    const [profits, setProfit] = useState({});
    const [lastDayData, setLastDayData] = useState({});
    const [volumes, setVolumes] = useState({});
    const [itemFilter, setItemFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            const mappingData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/mapping`);
            const latestData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/latest`);
            const dayData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/24h`);
            const volumeData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/volumes`);

            const fullMap = {};

            for(const item of mappingData) {
                fullMap[item.id] = item;
            }

            setMapping(fullMap);
            setLatest(latestData.data);
            setLastDayData(dayData.data);
            setVolumes(volumeData.data);

            const currentProfit = await calculateProfit(latestData.data, fullMap, dayData.data);
            setProfit(currentProfit);
        }

        loadInitialData();
    }, []);

    useEffect(() =>{
        let interval = setInterval(async () => {
            const latestData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/latest`);
            setLatest(latestData.data);
            const currentProfit = await calculateProfit(latestData.data, mapping, lastDayData);
            setProfit(currentProfit);
        }, 1000 * 60);

        //destroy interval on unmount
        return () => clearInterval(interval);
    }, [mapping, lastDayData])

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedFilter(itemFilter);
        }, 250);

        return () => {
            clearTimeout(timerId);
        };
      }, [itemFilter]);

    return (<Router>
        <Routes>
            <Route
                path="/"
                element={<Layout
                    handleFilterChange={(e) => {
                        setItemFilter(e.target.value);
                    }}
                />}
            >
                <Route
                    index
                    element={<Items
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
                        profits={profits}
                        volumes={volumes}
                    />}
                />
                <Route
                    path="level-calculator"
                    element={<LevelCalculator
                        mapping={mapping}
                        latest={latest}
                    />}
                />
                <Route
                    path="money-making"
                    element={<MoneyMaking
                        filter={debouncedFilter}
                    />}
                />
                <Route
                    path='crafts'
                    element={<Crafts
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
                        profits={profits}
                        volumes={volumes}
                    />}
                />
                <Route
                    path="monsters"
                    element={<MonsterProfits
                        latest={latest}
                        mapping={mapping}
                        filter={debouncedFilter}
                    />}
                />
                <Route
                    path="implings"
                    element={<Implings
                        latest={latest}
                        filter={debouncedFilter}
                        mapping={mapping}
                    />}
                />
                <Route
                    path="burnt-value"
                    element={<BurntValue/>}
                />
                <Route
                    path="stores"
                    element={<Stores
                        latest={latest}
                        filter={debouncedFilter}
                        mapping={mapping}
                        volumes={volumes}
                    />}
                />
                <Route
                    path="diaries"
                    element={<Diaries
                        filter={debouncedFilter}
                    />}
                />
                <Route
                    path="admin"
                    element={<Admin
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
                        profits={profits}
                        volumes={volumes}
                    />}
                />
            </Route>
        </Routes>
    </Router>);
}

export default App;
