import { useEffect, useRef, useState } from "react";
import { updateWatchProgress, getCourseProgress } from "../services/enrollmentService.js";


export const useEnrollment = (courseId, videoRef) => {
    const [progress, setProgress] = useState("NOT_STARTED");
    const [saved, setSaved] = useState(false);
    const timerRef = useRef(null);

    // Update watch progress when the user watches the video
    useEffect(() => {
        const fetchProgress = async () => {
            const res = await getCourseProgress(courseId);
            if (res.ok) {
                setProgress(res.data.progress);
            }
        };

        fetchProgress();
    }, [courseId]);

    useEffect(() => {
        if (!videoRef?.current) return;

        const video = videoRef.current;

        const clearSavedTimer = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };

        const saveProgress = async () => {
            if (video.paused || video.currentTime <= 0) return;

            const res = await updateWatchProgress(courseId, video.currentTime);
            if (!res.ok) return;

            setSaved(true);
            clearSavedTimer();
            timerRef.current = setTimeout(() => setSaved(false), 3000);
        };

        let intervalId = null;

        const startSaving = () => {
            saveProgress();
            intervalId = setInterval(saveProgress, 5000);
        };

        const stopSaving = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };

        video.addEventListener("play", startSaving);
        video.addEventListener("pause", stopSaving);
        video.addEventListener("ended", stopSaving);

        if (!video.paused) {
            startSaving();
        }

        return () => {
            stopSaving();
            clearSavedTimer();
            video.removeEventListener("play", startSaving);
            video.removeEventListener("pause", stopSaving);
            video.removeEventListener("ended", stopSaving);
        };
    }, [courseId, videoRef]);

    return { progress, saved };
};