import React, { useState, useEffect } from 'react';
import styles from './Earth.module.css';

export default function Earth() {
    const [date, setDate] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchImages = () => {
        if (!date) return;
        setLoading(true);
        const [y, m, d] = date.split('-');
        const url = `https://api.nasa.gov/EPIC/api/natural/date/${y}-${m}-${d}?api_key=${process.env.REACT_APP_NASA_API_KEY}`;
        fetch(url)
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
            .then(json => {
                setImages(json);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    return (
        <div>
            <h2>Awesome Earth Imagery</h2>
            <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
            />
            <button onClick={fetchImages} disabled={!date}>Fetch</button>

            {loading && <p>Loading images...</p>}
            {error && <p>Error: {error.toString()}</p>}
            <div className={styles.gallery}>
                {images.map(img => {
                    const imgUrl = `https://api.nasa.gov/EPIC/archive/natural/${img.date.split(' ')[0].replaceAll('-', '/')}/png/${img.image}.png?api_key=${process.env.REACT_APP_NASA_API_KEY}`;
                    return (
                        <div key={img.image} className={styles.card}>
                            <img src={imgUrl} alt={img.caption} className={styles.image} />
                            <p>{img.caption}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}