import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Outlet
} from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

import View from './View.js';
import Level from './Level.js';

import './App.css';

function Layout() {
    return (
        <div>
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

                </Toolbar>
            </AppBar>

            {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
            <Outlet />
        </div>
    );
}

function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<View />} />
                <Route path="level" element={<Level />} />
            </Route>
        </Routes>
    </Router>);
}

export default App;
