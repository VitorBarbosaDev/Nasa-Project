import React from 'react';
import styles from './ImageCard.module.css';

export default function ImageCard({ src, alt }) {
    return (
        <div className={styles.container}>
            <img src={src} alt={alt} className={styles.image} />
        </div>
    );
}