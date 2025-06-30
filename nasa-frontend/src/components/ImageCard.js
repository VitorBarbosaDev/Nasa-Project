import React from 'react';

export default function ImageCard({ src, alt }) {
    return (
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: '0.5rem' }} />
        </div>
    );
}