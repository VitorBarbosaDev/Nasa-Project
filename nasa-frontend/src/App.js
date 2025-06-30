import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import APOD from './components/APOD';
import { NavLink } from 'react-router-dom';


// 1️⃣ Home component: simple welcome message
function Home() {
    return <h2>Welcome to NASA Data Explorer</h2>;
}



// 3️⃣ App component: sets up routing and navigation
function App() {
    return (
        <BrowserRouter>
            {/* Navigation bar with links */}
            <nav style={{ padding: '1rem', background: '#222', color: '#fff' }}>
                <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
                <NavLink
                    to="/apod"
                    style={({ isActive }) => ({
                        marginRight: '1rem',
                        color: isActive ? '#fff' : '#61dafb'
                    })}
                >APOD
                </NavLink>
            </nav>

            {/* Route definitions */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apod" element={<APOD />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;