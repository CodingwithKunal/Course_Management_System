import { useRef } from "react";
import { useEnrollment } from "../../hooks/useEnrollment.js";


function VideoPlayer({courseId}) {
    const videoRef = useRef(null); 

    const {saved} = useEnrollment(courseId, videoRef);
  return (
   <main>
    <video ref={videoRef} controls width="600">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
    </video>
    {saved && <p className=" text-green-500 mt-2">Progress saved!</p>}
   </main>
  )
}

export default VideoPlayer
