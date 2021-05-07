import * as React from 'react';
import {View} from 'remax/one';
import styles from './index.css';
import {useEffect} from "react";

export default () => {

    useEffect(() => {
        navigator.getUserMedia = navigator.getUserMedia || (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia;
        console.log(navigator);

        const video: any = document.getElementById('video');

        const stream = navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'user',
            },
        });
    })

    return (
        <View className={styles.app}>
            <video id="video">
            </video>
        </View>
    );
};
