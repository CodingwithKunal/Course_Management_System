import { useParams } from 'react-router-dom'
import { markCourseComplete } from '../../services/enrollmentService.js';
import VideoPlayer from '../../components/course/VideoPlayer';

const CourseLearn = () => {
    const {id} = useParams(); 

    const handleComplete = async () => {
        await markCourseComplete(id);
    };

  return (
    <main className='p-5'>
        <h1 className='text-2xl font-bold mb-4'>Course Learning Page</h1>
        <VideoPlayer courseId={id} />
        <button onClick={handleComplete} className='mt-4 px-4 py-2 bg-green-500 text-white rounded'>Mark Complete</button>
    </main>
  )
}

export default CourseLearn
