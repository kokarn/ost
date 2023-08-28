import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Outlet
} from "react-router-dom";

import View from './View.js';
import Level from './Level.js';

import './App.css';

function Layout() {
    return (
        <div>
            {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
            <nav
                className="navbar"
            >
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/level">Level</Link>
                    </li>
                </ul>
            </nav>

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
