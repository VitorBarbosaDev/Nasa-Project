import React from 'react';
import styles from './Description.module.css';

export default function Description({ text }) {
    return <p className={styles.description}>{text}</p>;
}