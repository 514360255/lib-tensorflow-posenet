
import PoseDetection from "@/poseDetection";
let canvas: any;
let ctx: any;
let poseDetection: any;
let poses: any = [];
let video: any;
let videoWidth, videoHeight;

const color = 'aqua';
const lineWidth = 2;

let sketchGuiState = {
    showVideo: true,
    showSkeleton: true,
    showPoints: true,
};

export function setupSketch(
    thePoseDetection: any,
    theVideo: any,
    theVideoWidth: number,
    theVideoHeight: number
) {
    canvas = document.getElementById('output');
    ctx = canvas.getContext('2d');
    poseDetection = thePoseDetection;
    video = theVideo;
    videoWidth = theVideoWidth;
    videoHeight = theVideoHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;
    sketchLoop();
}

export function initSketchGui(gui: any) {
    gui.open();
    gui.add(sketchGuiState, 'showVideo');
    gui.add(sketchGuiState, 'showSkeleton');
    gui.add(sketchGuiState, 'showPoints');
}

let getNewFrame = true;
async function sketchLoop() {
    if (getNewFrame) {
        poses = await poseDetection.getPoses();
    }
    getNewFrame = !getNewFrame;

    let minPoseConfidence: any;
    let minPartConfidence: any;

    switch (poseDetection.guiState.algorithm) {
        case 'single-pose':
            minPoseConfidence = +poseDetection.guiState.singlePoseDetection
                .minPoseConfidence;
            minPartConfidence = +poseDetection.guiState.singlePoseDetection
                .minPartConfidence;
            break;
        case 'multi-pose':
            minPoseConfidence = +poseDetection.guiState.multiPoseDetection
                .minPoseConfidence;
            minPartConfidence = +poseDetection.guiState.multiPoseDetection
                .minPartConfidence;
            break;
    }

    ctx.save();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the video on the canvas
    if (sketchGuiState.showVideo) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    poses.forEach(({score, keypoints}: any) => {
        if (score >= minPoseConfidence) {
            if (sketchGuiState.showPoints) {
                drawKeypoints(keypoints, minPartConfidence, ctx);
            }
            if (sketchGuiState.showSkeleton) {
                drawSkeleton(keypoints, minPartConfidence, ctx);
            }
        }
    });

    ctx.restore();

    requestAnimationFrame(sketchLoop);
}

function toTuple({y, x}: any) {
    return [y, x];
}

export function drawPoint(ctx: any, y: number, x: number, r: number, color: string) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax]: any, [by, bx]: any, color: string, scale: number, ctx: any) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(keypoints: any, minConfidence: any, ctx: any, scale = 1) {
    const adjacentKeyPoints = poseDetection.getAdjacentKeyPoints(
        keypoints,
        minConfidence
    );

    adjacentKeyPoints.forEach((keypoints: any[]) => {
        drawSegment(
            toTuple(keypoints[0].position),
            toTuple(keypoints[1].position),
            color,
            scale,
            ctx
        );
    });
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(keypoints: any[], minConfidence: number, ctx: any, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
            continue;
        }

        const {y, x} = keypoint.position;
        drawPoint(ctx, y * scale, x * scale, 5, color);
    }
}
