import React, { useState } from 'react'
import UserRegister from '../../components/auth/UserRegister'
import RegisterInstructor from '../../components/auth/RegisterInstructor'
import { useNavigate } from 'react-router'


export const Register = () => {
    const [showe, setshowe] = useState("student")
    const Nevigate = useNavigate()

    return (
        <main className=' flex gap-5 '>
            <button onClick={() => Nevigate("/")} className="absolute top-5 left-5 text-gray-400 hover:text-gray-200 cursor-pointer">Back to Home</button>
            <section className='flex justify-center items-center w-1/2 h-screen'>
                <h1 className=' font-semibold text-7xl underline text-amber-700 '>Banner show </h1>
            </section>
            <section className=' flex items-center justify-center   w-1/2 max-h-10/12 bg-mist-200'>
                <div className="flex flex-col items-center text-black space-x-5 text-xs">
                    <div className='flex space-x-3 py-4'>
                        {/* Student Radio Button Card */}
                        <label
                            htmlFor="student-radio"
                            className={`py-2 px-3 cursor-pointer rounded-xl border flex items-center space-x-4 transition-all ${showe === "student"
                                ? "border-sky-600 bg-sky-100 font-semibold"
                                : "border-gray-400 bg-gray-200"
                                }`}
                        >
                            <span>Student</span>
                            <input
                                type="radio"
                                id="student-radio"
                                name="userRole" // Same name links both radio buttons together
                                value="student"
                                checked={showe === "student"}
                                onChange={(e) => setshowe(e.target.value)}
                                className="cursor-pointer"
                            />
                        </label>

                        {/* Instructor Radio Button Card */}
                        <label
                            htmlFor="instructor-radio"
                            className={`py-2 px-3 cursor-pointer rounded-xl border flex items-center space-x-4 transition-all ${showe === "instructor"
                                ? "border-sky-600 bg-sky-100 font-semibold"
                                : "border-gray-400 bg-gray-200"
                                }`}
                        >
                            <span>Instructor</span>
                            <input
                                type="radio"
                                id="instructor-radio"
                                name="userRole" // Same name links both radio buttons together
                                value="instructor"
                                checked={showe === "instructor"}
                                onChange={(e) => setshowe(e.target.value)}
                                className="cursor-pointer"
                            />
                        </label>

                    </div>

                    <div className="mt-5">
                        {showe === "student" && <UserRegister />}
                        {showe === "instructor" && <RegisterInstructor />}
                    </div>

                    <h1 className='text-black text-sm text-center pb-5 mt-5'>Already have an Account? <span className=' cursor-pointer text-sky-800' onClick={() => Nevigate("/login")}>Sign In</span> </h1>

                </div>

            </section>

        </main>
    )
}
