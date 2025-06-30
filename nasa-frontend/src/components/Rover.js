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
        <div className={styles.container}>
            <h1 className={styles.heading}>Mars Rover: Curiosity</h1>
            <p className={styles.subtitle}>Explore Mars through Curiosity's eyes</p>

            <form onSubmit={handleSubmit} className={styles.dateForm}>
                <div className={styles.inputGroup}>
                    <label htmlFor="earth-date">Select Earth Date:</label>
                    <input
                        id="earth-date"
                        type="date"
                        value={earthDate}
                        onChange={e => setEarthDate(e.target.value)}
                        className={styles.dateInput}
                    />
                </div>
                <button type="submit" className={styles.button}>Explore Photos</button>
            </form>

            {loading && <div className={styles.loading}>Loading Mars photos...</div>}
            {error && <div className={styles.error}>Error: {error.toString()}</div>}

            {!loading && !error && photos.length === 0 && (
                <div className={styles.noResults}>No photos found for this date. Try another date.</div>
            )}

            {photos.length > 0 && (
                <div className={styles.results}>
                    <h2 className={styles.resultsHeading}>
                        {photos.length} Photo{photos.length !== 1 ? 's' : ''} from {earthDate}
                    </h2>
                    <div className={styles.grid}>
                        {photos.map(photo => (
                            <div key={photo.id} className={styles.card}>
                                <img
                                    src={photo.img_src}
                                    alt={photo.camera.full_name}
                                    className={styles.thumbnail}
                                    loading="lazy"
                                />
                                <div className={styles.photoInfo}>
                                    <span className={styles.cameraName}>{photo.camera.full_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}