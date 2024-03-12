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
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Container from '@mui/material/Container';

import Skills from './components/Skills.js';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person';

// Modules
import loadJSON from './modules/load-json.mjs';
import calculateProfit from './modules/calculate-profit.mjs';
import urlFrieldlyName from './modules/urlfriendly-name.mjs';
import useStateWithLocalStorage from './hooks/useStateWithLocalStorage';
import calculateCombatLevel from './modules/calculate-combat-level.mjs';

// Pages
import Admin from './pages/Admin.js';
import BurntValue from './pages/BurntValue.js';
import Crafting from './pages/Crafting.js';
import Diaries from './pages/Diaries.js';
import Implings from './pages/Implings.js';
import Item from './pages/Item.js';
import Items from './pages/Items.js';
import LevelCalculator from './pages/LevelCalculator.js';
import MoneyMaking from './pages/MoneyMaking.js';
import MonsterProfits from './pages/MonsterProfits.js';
import Stores from './pages/Stores.js';
import ZahurCalculator from './pages/ZahurCalculator.js';

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

function Layout({handleFilterChange, playerName, playerStats, handlePlayerNameChange}) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const inputRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const pages = [
        {
            key: 'grand-exchange',
            label: 'Grand Exchange',
            path: '/',
        },
        {
            key: 'burnt-value',
            label: 'Burnt Value',
            path: '/burnt-value',
        },
        {
            key: 'crafting',
            label: 'Crafting',
            path: '/crafting',
        },
        {
            key: 'diaries',
            label: 'Diaries',
            path: '/diaries',
        },
        {
            key: 'implings',
            label: 'Implings',
            path: '/implings',
        },
        {
            key: 'level',
            label: 'Level Calculator',
            path: '/level-calculator',
        },
        {
            key: 'money-making',
            label: 'Money Making',
            path: '/money-making',
        },
        {
            key: 'monster-profits',
            label: 'Monster profits',
            path: '/monster-profits',
        },
        {
            key: 'stores',
            label: 'Stores',
            path: '/stores',
        },
        {
            key: 'zahur-calculator',
            label: 'Zahur Calculator',
            path: '/zahur-calculator',
        }
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
    const [crafts, setCrafts] = useState([]);
    const [lastDayData, setLastDayData] = useState({});
    const [volumes, setVolumes] = useState({});
    const [itemFilter, setItemFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');
    const [playerName, setPlayerName] = useStateWithLocalStorage('playerName', '');
    const [playerStats, setPlayerStats] = useState({});

    useEffect(() => {
        const loadInitialData = async () => {
            const mappingData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/mapping`);
            const latestData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/latest`);
            const dayData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/24h`);
            const volumeData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/volumes`);

            const fullMap = {};

            for(const item of mappingData) {
                fullMap[item.id] = {
                    ...item,
                    urlName: urlFrieldlyName(item.name),
                };
            }

            setMapping(fullMap);
            setLatest(latestData.data);
            setLastDayData(dayData.data);
            setVolumes(volumeData.data);

            const currentProfit = await calculateProfit(latestData.data, fullMap, dayData.data);
            setCrafts(currentProfit);

            if(playerName) {
                const playerData = await loadJSON(`https://sync.runescape.wiki/runelite/player/${playerName}/STANDARD`);

                if(playerData.code !== 'NO_USER_DATA'){
                    const gamePlayerStats = playerData.levels;

                    gamePlayerStats['Quests'] = playerData.quests;
                    gamePlayerStats['Achievement diaries'] = playerData.achievement_diaries;

                    gamePlayerStats['Quest points'] = 0;
                    gamePlayerStats['Skills'] = 0;

                    for(const skill in playerData.levels){
                        if(skill === 'Skills'){
                            continue;
                        }

                        gamePlayerStats['Skills'] = gamePlayerStats['Skills'] + playerData.levels[skill];
                    }

                    for(const quest in playerData.quests){
                        gamePlayerStats['Quest points'] = gamePlayerStats['Quest points'] + playerData.quests[quest];
                    }

                    gamePlayerStats['Combat level'] = calculateCombatLevel(gamePlayerStats);

                    setPlayerStats(gamePlayerStats);
                }
            }
        }

        loadInitialData();
    }, [playerName]);

    useEffect(() =>{
        let interval = setInterval(async () => {
            const latestData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/latest`);
            setLatest(latestData.data);
            const currentProfit = await calculateProfit(latestData.data, mapping, lastDayData);
            setCrafts(currentProfit);
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
                    handlePlayerNameChange={(value) => {
                        if(value){
                            setPlayerName(value);
                        }
                    }}
                    playerStats={playerStats}
                    playerName={playerName}
                />}
            >
                <Route
                    index
                    element={<Items
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
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
                        playerStats={playerStats}
                    />}
                />
                <Route
                    path='crafting'
                    element={<Crafting
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
                        crafts={crafts}
                        volumes={volumes}
                    />}
                />
                <Route
                    path="monster-profits"
                    element={<MonsterProfits
                        latest={latest}
                        mapping={mapping}
                        filter={debouncedFilter}
                        playerStats={playerStats}
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
                        playerStats={playerStats}
                    />}
                />
                <Route
                    path="/item/:id"
                    element={<Item
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
                        crafts={crafts}
                        volumes={volumes}
                    />}
                />
                <Route
                    path="zahur-calculator"
                    element={<ZahurCalculator
                        latest={latest}
                        filter={debouncedFilter}
                        mapping={mapping}
                        volumes={volumes}
                        crafts={crafts}
                    />}
                />
                <Route
                    path="admin"
                    element={<Admin
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
                        crafts={crafts}
                        volumes={volumes}
                    />}
                />
            </Route>
        </Routes>
    </Router>);
}

export default App;
