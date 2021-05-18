import * as React from 'react';
import {View} from 'remax/one';
import './index.scss';
import {useEffect} from "react";
import {loadVideo, mobile, videoSize} from "@/utils";
import dat from 'dat.gui';
import PoseDetection from "@/poseDetection";
import {initSketchGui, setupSketch} from "@/sketch";

export default () => {

    useEffect(() => {
        const video = loadVideo();

        const gui = new dat.GUI({width: 250});
        const detectionGui = gui.addFolder('detection');
        const sketchGui = gui.addFolder('sketch');

        let poseDetection = new PoseDetection(video, mobile());
        const { videoHeight, videoWidth } = videoSize();
        poseDetection.initPoseDetection().then(() => {
            setupSketch(poseDetection, video, videoWidth, videoHeight);
            initSketchGui(sketchGui);
        });
        poseDetection.initGui(detectionGui);
    })

    return (
        <View>
            <video id="video">
            </video>
            <canvas id="output" />
        </View>
    );
};
