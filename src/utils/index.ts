
export const videoSize = () => {
    const videoWidth = window.innerWidth / 2.8;
    const videoHeight = window.innerWidth / 2.8;
    return {videoHeight, videoWidth};
}

export const mobile = () => {
    return isMobile();
}

export const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
}

export const isiOS = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export const isMobile = () => {
    return isAndroid() || isiOS();
}

export const setUserMedia = () => {
    navigator.getUserMedia = navigator.getUserMedia || (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia;
}

export const setupCamera = async (id: string = 'video') => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('此浏览器不支持getUserMedia');
    }
    const video: any = document.getElementById(id);
    const { videoWidth, videoHeight } = videoSize();
    video.width = videoWidth;
    video.height = videoHeight;
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: 'user',
            width: mobile() ? undefined : videoWidth,
            height: mobile() ? undefined : videoHeight,
        },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

export const loadVideo = async (id: string = 'video') => {
    setUserMedia();
    const video: any = await setupCamera(id);
    video.play();

    return video;
}
