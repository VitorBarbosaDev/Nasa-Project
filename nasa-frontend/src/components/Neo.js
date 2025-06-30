import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import styles from './Neo.module.css';

// custom tooltip for largest NEO chart
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;
    const { largestName } = payload[0].payload;
    const value = payload[0].value;
    return (
        <div className={styles.customTooltip}>
            <p className={styles.tooltipLabel}>{label}</p>
            <p><strong>Biggest:</strong> {largestName}</p>
            <p><strong>Size:</strong> {value.toFixed(2)} km</p>
        </div>
    );
}

export default function Neo() {
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(today);
    const [asteroids, setAsteroids] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortKey, setSortKey] = useState('');

    // fetch data for chart over past 7 days ending 'date'
    useEffect(() => {
        const end = new Date(date);
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        const startStr = start.toISOString().split('T')[0];
        fetch(
            `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startStr}&end_date=${date}&api_key=${process.env.REACT_APP_NASA_API_KEY}`
        )
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
            .then(json => {
                const obj = json.near_earth_objects;
                const days = [];
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const key = d.toISOString().split('T')[0];
                    const arr = obj[key] || [];
                    const count = arr.length;
                    let largestSize = 0, largestName = '';
                    arr.forEach(a => {
                        const sz = a.estimated_diameter.kilometers.estimated_diameter_max;
                        if (sz > largestSize) { largestSize = sz; largestName = a.name; }
                    });
                    days.push({ date: key, count, largestSize, largestName });
                }
                setChartData(days);
            })
            .catch(() => {});
    }, [date]);

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
            return b.estimated_diameter.kilometers.estimated_diameter_max - a.estimated_diameter.kilometers.estimated_diameter_max;
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
            {/* NEO count over past week */}
            <h3 className={styles.chartTitle}>NEO Count (Past 7 Days)</h3>
            <div style={{ width: '100%', height: 250, marginBottom: '2rem' }}>
                <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 8 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {/* NEO average max size over past week */}
            <h3 className={styles.chartTitle}>Largest NEO Size (km) (Past 7 Days)</h3>
            <div style={{ width: '100%', height: 250, marginBottom: '2rem' }}>
                <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="largestSize" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSize)" activeDot={{ r: 8 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
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