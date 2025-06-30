import React, { useState, useEffect } from 'react';
import styles from './Rover.module.css';
import Spinner from './Spinner';

export default function Rover() {
    const [photos, setPhotos] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [earthDate, setEarthDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split('T')[0];
    });
    const [camera, setCamera] = useState('ALL');
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch photos by date
    const fetchPhotos = () => {
        setLoading(true);
        setError(null);
        const base = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos`;
        const url = `${base}?earth_date=${earthDate}&api_key=${process.env.REACT_APP_NASA_API_KEY}`;

        fetch(url)
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
            .then(json => {
                setPhotos(json.photos);
                setFiltered(json.photos);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    // Update filtered list when camera changes
    useEffect(() => {
        if (camera === 'ALL') {
            setFiltered(photos);
        } else {
            setFiltered(photos.filter(p => p.camera.name === camera));
        }
    }, [camera, photos]);

    const handleSubmit = e => {
        e.preventDefault();
        fetchPhotos();
    };

    // Derive unique camera list from fetched photos
    const cameraOptions = Array.from(
        new Set(photos.map(p => p.camera.name))
    );

    // Open full-screen modal
    const openModal = img => {
        setSelectedImage(img);
        document.body.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    // Close modal on escape key press
    useEffect(() => {
        const onKey = e => e.key === 'Escape' && closeModal();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);


    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Mars Rover: Curiosity</h1>
            <p className={styles.subtitle}>Explore Mars through Curiosity's eyes</p>

            {/* Date & Camera Filter Form */}
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
                <div className={styles.inputGroup}>
                    <label htmlFor="camera-select">Filter by Camera:</label>
                    <select
                        id="camera-select"
                        value={camera}
                        onChange={e => setCamera(e.target.value)}
                        className={styles.dateInput}
                    >
                        <option value="ALL">All Cameras</option>
                        {cameraOptions.map(cam => (
                            <option key={cam} value={cam}>{cam}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className={styles.button}>Explore Photos</button>
            </form>

            {/* Status & Results */}
            {loading && <Spinner />}
            {error && <div className={styles.error}>Error: {error.toString()}</div>}
            {!loading && !error && filtered.length === 0 && (
                <div className={styles.noResults}>No photos found for this selection.</div>
            )}
            {filtered.length > 0 && (
                <div className={styles.results}>
                    <h2 className={styles.resultsHeading}>
                        {filtered.length} Photo{filtered.length !== 1 ? 's' : ''} from {earthDate}
                    </h2>
                    <div className={styles.grid}>
                        {filtered.map(photo => (
                            <div key={photo.id} className={styles.card} onClick={() => openModal(photo)}>
                                <img
                                    src={photo.img_src}
                                    alt={photo.camera.full_name}
                                    className={styles.thumbnail}
                                />
                                <div className={styles.photoInfo}>
                                    <span className={styles.cameraName}>{photo.camera.full_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Full-screen modal */}
            <div className={`${styles.modal} ${selectedImage ? styles.modalOpen : ''}`} onClick={closeModal}>
                {selectedImage && (
                    <>
                        <button className={styles.modalClose} onClick={closeModal}>&times;</button>
                        <img
                            src={selectedImage.img_src}
                            alt={selectedImage.camera.full_name}
                            className={styles.modalImage}
                            onClick={e => e.stopPropagation()}
                        />
                        <div className={styles.modalInfo} onClick={e => e.stopPropagation()}>
                            {selectedImage.camera.full_name} - Rover: {selectedImage.rover.name}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}