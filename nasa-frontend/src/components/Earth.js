import React, { useState, useEffect } from 'react';
import styles from './Earth.module.css';
import Spinner from './Spinner';
import { apiEndpoints } from '../config/api';

export default function Earth() {
    const [date, setDate] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchImages = () => {
        if (!date) return;
        setLoading(true);

        fetch(apiEndpoints.earth(date))
            .then(res => {
                if (!res.ok) {
                    return res.json().then(errorData => {
                        throw new Error(errorData.error || 'Network response was not ok');
                    });
                }
                return res.json();
            })
            .then(json => {
                setImages(json);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };
    // Open full-screen modal
    const openModal = img => {
        setSelectedImage(img);
        document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };
    // Close modal on Escape key
    useEffect(() => {
        const onKey = e => e.key === 'Escape' && closeModal();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Awesome Earth Imagery</h2>
            <form onSubmit={e => { e.preventDefault(); fetchImages(); }} className={styles.filterForm}>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className={styles.dateInput}
                />
                <button type="submit" className={styles.fetchButton} disabled={!date}>
                    Fetch
                </button>
            </form>

            {error && <p>Error: {error.toString()}</p>}
            <div className={styles.gallery}>
                {images.map(img => {
                    const imgUrl = apiEndpoints.earthImage(img.date.split(' ')[0], img.image);
                    return (
                        <div key={img.image} className={styles.card} onClick={() => openModal(img)}>
                            <img src={imgUrl} alt={img.caption} className={styles.image} />
                            <p className={styles.caption}>{img.caption}</p>
                        </div>
                    );
                })}
            </div>
            {/* Full-screen modal */}
            <div className={`${styles.modal} ${selectedImage ? styles.modalOpen : ''}`} onClick={closeModal}>
                {selectedImage && (
                    <>
                        <button className={styles.modalClose} onClick={closeModal}>&times;</button>
                        <img
                            src={apiEndpoints.earthImage(selectedImage.date.split(' ')[0], selectedImage.image)}
                            alt={selectedImage.caption}
                            className={styles.modalImage}
                            onClick={e => e.stopPropagation()}
                        />
                        <div className={styles.modalInfo} onClick={e => e.stopPropagation()}>
                            {selectedImage.caption}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}