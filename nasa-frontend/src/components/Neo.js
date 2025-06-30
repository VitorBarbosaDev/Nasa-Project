import React, { useState, useEffect } from 'react';
import styles from './Neo.module.css';

export default function Neo() {
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(today);
    const [asteroids, setAsteroids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortKey, setSortKey] = useState('');

    const fetchNEO = (d) => {
        setLoading(true);
        setError(null);
        fetch(
            `https://api.nasa.gov/neo/rest/v1/feed?start_date=${d}&end_date=${d}&api_key=${process.env.REACT_APP_NASA_API_KEY}`
        )
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
            .then(json => {
                setAsteroids(json.near_earth_objects[d] || []);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    useEffect(() => { fetchNEO(date); }, []);

    const handleNEOSubmit = e => {
        e.preventDefault();
        fetchNEO(date);
    };

    if (loading) return <p>Loading NEO data...</p>;
    if (error) return <p>Error: {error.toString()}</p>;

    const sorted = [...asteroids].sort((a, b) => {
        if (sortKey === 'size') {
            return a.estimated_diameter.kilometers.estimated_diameter_max - b.estimated_diameter.kilometers.estimated_diameter_max;
        }
        if (sortKey === 'danger') {
            return (b.is_potentially_hazardous_asteroid ? 1 : 0) - (a.is_potentially_hazardous_asteroid ? 1 : 0);
        }
        return 0;
    });

    return (
        <div className={styles.container}>
            <form onSubmit={handleNEOSubmit} className={styles.dateForm}>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    max={today}
                    className={styles.dateInput}
                />
                <button type="submit" className={styles.submitButton}>Get NEOs</button>
            </form>
            <h2 className={styles.heading}>Near Earth Objects: {new Date().toLocaleDateString()}</h2>
            <div className={styles.controls}>
                <button
                    className={sortKey === '' ? styles.active : ''}
                    onClick={() => setSortKey('')}
                >Default</button>
                <button
                    className={sortKey === 'size' ? styles.active : ''}
                    onClick={() => setSortKey('size')}
                >Sort by Size</button>
                <button
                    className={sortKey === 'danger' ? styles.active : ''}
                    onClick={() => setSortKey('danger')}
                >Show Hazardous First</button>
            </div>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Size (km)</th>
                    <th>Hazardous</th>
                </tr>
                </thead>
                <tbody>
                {sorted.map(obj => (
                    <tr key={obj.id} className={obj.is_potentially_hazardous_asteroid ? styles.hazard : ''}>
                        <td>{obj.name}</td>
                        <td>{obj.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)}</td>
                        <td>{obj.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}