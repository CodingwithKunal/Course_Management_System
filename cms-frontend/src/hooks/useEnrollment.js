import { useEffect, useState } from "react";
import { updateWatchProgress, getCourseProgress } from "../services/enrollmentService.js";


export const useEnrollment = (courseId, videoRef) => {
    const [progress, setProgress] = useState("NOT_STARTED");
    const [saved, setsaved] = useState(false);


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


    // Save watch progress every 10 seconds while the video is playing   
    useEffect(() => {
        if(!videoRef?.current) return 

        const interval = setInterval(async () => {
            
                const currentTime = videoRef.current.currentTime;
                
                await updateWatchProgress(courseId, currentTime);
                setsaved(true);

                setTimeout(() => setsaved(false), 2000); // Reset saved state after 2 seconds
        
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, [courseId, videoRef]);

    
    return { progress, saved };

}