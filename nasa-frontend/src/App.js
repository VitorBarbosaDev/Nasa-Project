import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// 1️⃣ Home component: simple welcome message
function Home() {
    return <h2>Welcome to NASA Data Explorer</h2>;
}

// 2️⃣ APOD component: placeholder until fetching the real data
function APOD() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_NASA_API_KEY}`
        )
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading APOD...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div style={{ padding: '1rem' }}>
            <h2>{data.title}</h2>
            <img src={data.url} alt={data.title} style={{ maxWidth: '100%' }} />
            <p>{data.explanation}</p>
        </div>
    );
}

// 3️⃣ App component: sets up routing and navigation
function App() {
    return (
        <BrowserRouter>
            {/* Navigation bar with links */}
            <nav style={{ padding: '1rem', background: '#222', color: '#fff' }}>
                <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
                <Link to="/apod">APOD</Link>
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