import React, { useState } from 'react';
import styles from './Rover.module.css';

export default function Rover() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [earthDate, setEarthDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split('T')[0];
    });

    const fetchPhotos = () => {
        setLoading(true);
        setError(null);
        let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${process.env.REACT_APP_NASA_API_KEY}`;
        if (earthDate) url += `&earth_date=${earthDate}`;
        fetch(url)
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
            .then(json => {
                setPhotos(json.photos);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    const handleSubmit = e => {
        e.preventDefault();
        fetchPhotos();
    };

    // render UI
    return (
        <div>
            <h2>Mars Rover: Curiosity</h2>
            <form onSubmit={handleSubmit} className={styles.filters}>
                <input type="date" value={earthDate} onChange={e => setEarthDate(e.target.value)} />
                <button type="submit">Load Photos</button>
            </form>
            {loading && <p>Loading Rover Photos...</p>}
            {error && <p>Error: {error.toString()}</p>}
            {!loading && !error && photos.length === 0 && <p>No photos found for that date.</p>}
            <div className={styles.grid}>
                {photos.map(photo => (
                    <img
                        key={photo.id}
                        src={photo.img_src}
                        alt={photo.camera.full_name}
                        className={styles.thumbnail}
                    />
                ))}
            </div>
        </div>
    );
}