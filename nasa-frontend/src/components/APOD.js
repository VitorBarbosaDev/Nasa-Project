import React, {useEffect, useState} from "react";
import Title from "./Title";
import ImageCard from "./ImageCard";
import Description from "./Description";
import styles from './APOD.module.css';
import Spinner from './Spinner';
import { apiEndpoints } from '../config/api';

export default function APOD() {
    // Use a known good date instead of today's date which might be in the future
    const defaultDate = '2025-06-30'; // Use a recent date that definitely exists
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(defaultDate);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (d) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching APOD for date:', d);
            console.log('API URL:', apiEndpoints.apod(d));

            const response = await fetch(apiEndpoints.apod(d));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('APOD API Error:', response.status, errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const json = await response.json();
            console.log('APOD data received:', json);
            setData(json);
        } catch (err) {
            console.error('APOD fetch error:', err);
            setError(err.message || 'Failed to fetch APOD data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(date);
    }, [date]);

    if (loading) return <Spinner />;
    if (error) return (
        <div className={styles.container}>
            <h2>APOD - Astronomy Picture of the Day</h2>
            <p style={{color: 'red'}}>Error: {error}</p>
            <button onClick={() => fetchData(date)} className={styles.button}>
                Retry
            </button>
        </div>
    );

    if (!data) return (
        <div className={styles.container}>
            <h2>APOD - Astronomy Picture of the Day</h2>
            <p>No data available</p>
        </div>
    );

    return (
        <div className={styles.container}>
            <form onSubmit={e => { e.preventDefault(); fetchData(date); }} className={styles.dateForm}>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className={styles.dateInput}
                    max={today}
                />
                <button type="submit" className={styles.button}>Get APOD</button>
            </form>
            <p className={styles.date}>{data.date}</p>
            <Title text={data.title} />
            <ImageCard src={data.url} alt={data.title} />
            <Description text={data.explanation} />
        </div>
    );
}