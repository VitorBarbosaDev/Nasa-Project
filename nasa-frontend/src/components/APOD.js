import React, {useEffect, useState} from "react";
import Title from "./Title";
import ImageCard from "./ImageCard";
import Description from "./Description";
import styles from './APOD.module.css';

export default function APOD() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_NASA_API_KEY}`
        )
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading APOD...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.container}>
            <p className={styles.date}>{data.date}</p>
            <Title text={data.title} />
            <ImageCard src={data.url} alt={data.title} />
            <Description text={data.explanation} />
        </div>
    );
}