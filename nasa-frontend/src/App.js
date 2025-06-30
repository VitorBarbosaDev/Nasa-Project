import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import APOD from './components/APOD';
import Rover from './components/Rover';
import Neo from './components/Neo';
import Earth from './components/Earth';
import styles from './App.module.css';


// 1️⃣ Home component: simple welcome message
function Home() {
    return (
        <div className={styles.homeContainer}>
            <h1 className={styles.homeHeading}>Welcome to NASA Data Explorer</h1>
            <p className={styles.homeSubtitle}>Discover stunning imagery and data from NASA's missions</p>
            <Link to="/apod" className={styles.homeButton}>Explore APOD</Link>
        </div>
    );
}



// 3️⃣ App component: sets up routing and navigation
function App() {
    return (
        <BrowserRouter>
            {/* Navigation bar with links */}
            <nav className={styles.nav}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.link
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/apod"
                    className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.link
                    }
                >
                    APOD
                </NavLink>
                <NavLink
                    to="/rover"
                    className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.link
                    }
                >
                    Rover
                </NavLink>
                <NavLink
                    to="/neo"
                    className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.link
                    }
                >Near Earth Objects</NavLink>
                <NavLink
                    to="/Earth"
                    className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.link
                    }
                >Earth</NavLink>

            </nav>

            {/* Route definitions */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apod" element={<APOD />} />
                <Route path="/rover" element={<Rover />} />
                <Route path="/neo" element={<Neo />} />
                <Route path="/Earth"  element={<Earth />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;