import React from 'react'
import { useContinueLearning } from '../../../hooks/useContinueLearning.js'
import { useNavigate } from 'react-router-dom'

const ContinueLearningCard = () => {
    const { enrollment, loading, error } = useContinueLearning()
    const navigate = useNavigate()
    const handleContinueLearning = () => {

        navigate(`/course/${enrollment.course._id}/learn`)

    }

    if (loading) { return <div> Loading...</div> }
    if (error) { return <div> Error: {error.message}</div> }


    return (
        <div>


            {enrollment ? (
                <div>
                    <h1 className=' font-bold text-blue-500 text-2xl' >Your Recent Activity</h1>
                    <h2>{enrollment.course?.title}</h2>
                    <p>{enrollment.course?.description}</p>
                    <p>{enrollment.progress }</p>
                    <button className='bg-white py-2 px-2 rounded-2xl text-black cursor-pointer' onClick={handleContinueLearning}>Continue Learning</button>
                </div>
            ) : (
                <p>Start another course to keep learning.</p>
            )}

        </div>
    )
}

export default ContinueLearningCard
