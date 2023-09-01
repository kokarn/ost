import {
    useEffect,
    useState,
    // useMemo,
} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Outlet
} from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';

import loadJSON from './modules/load-json.mjs';
import calculateProfit from './modules/calculate-profit.mjs';

import View from './pages/View.js';
import Level from './pages/Level.js';
import Items from './pages/Items.js';
import MoneyMaking from './pages/MoneyMaking.js';

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
    return (<Box
        sx={{ flexGrow: 1 }}
    >
            {/* A "layout route" is a good place to put markup you want to
        share across all the pages on your site, like navigation. */}
        <AppBar position="static">
            <Toolbar disableGutters>
                <Button
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    <Link to="/">
                        Home
                    </Link>
                </Button>
                <Button
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    <Link
                        to="/level"
                    >
                        Level
                    </Link>
                </Button>
                <Button
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    <Link
                        to="/items"
                    >
                        Items
                    </Link>
                </Button>
                <Button
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    <Link
                        to="/money-making"
                    >
                        Money Making
                    </Link>
                </Button>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={handleFilterChange}
                    />
                </Search>
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

    return (<Router>
        <Routes>
            <Route path="/" element={<Layout
                handleFilterChange={(e) => {
                    setItemFilter(e.target.value);
                }}
            />}>
                <Route index element={<Items
                    dayData={lastDayData}
                    filter={itemFilter}
                    latest={latest}
                    mapping={mapping}
                    profits={profits}
                    volumes={volumes}
                />} />
                <Route path="level" element={<Level />} />
                <Route path="money-making" element={<MoneyMaking />} />
            </Route>
        </Routes>
    </Router>);
}

export default App;
