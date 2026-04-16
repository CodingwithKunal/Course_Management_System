import { useState } from "react"
import { registerInstructor } from "../../services/authService"
import { useNavigate } from "react-router"


const RegisterInstructor = () => {
    const [form, setform] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        expertise: "",
        experience: "",
    })
    const Nevigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await registerInstructor(form)
        if (res.ok) {
            Nevigate("/login")
            setform({
                name: "",
                email: "",
                password: "",
                bio: "",
                expertise: "",
                experience: "",
            })
        }

    }
    return (
        <main className=' flex items-center justify-center  h-screen'>
            <div className='w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg'>
                <h2 className='text-2xl font-bold text-center text-white'>Instructor Registration</h2>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label htmlFor='name' className='block text-sm font-medium text-white'>Name</label>
                        <input type='text' id='name' className='w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white  focus:ring-2  outline-0' required
                            onChange={(e) => setform({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-white'>Email</label>
                        <input type='email' id='email' className='w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white  focus:ring-2  outline-0' required
                            onChange={(e) => setform({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor='password' className='block text-sm font-medium text-white'>Password</label>
                        <input type='password' id='password' className='w-full px-3 py-2 mt-1 border  rounded-md bg-gray-700 text-white   focus:ring-2 ' required
                            onChange={(e) => setform({ ...form, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor='bio' className='block text-sm font-medium text-white'>Bio</label>
                        <textarea id='bio' className='w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white  focus:ring-2  outline-0' rows='4'
                            onChange={(e) => setform({ ...form, bio: e.target.value })}
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor='Expertise' className='block text-sm font-medium text-white'>Expertise</label>
                        <input type='text' id='password' className='w-full px-3 py-2 mt-1 border  rounded-md bg-gray-700 text-white   focus:ring-2 ' required
                            onChange={(e) => setform({ ...form, expertise: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor='Experience' className='block text-sm font-medium text-white'>Experience</label>
                        <input type='text' id='password' className='w-full px-3 py-2 mt-1 border  rounded-md bg-gray-700 text-white   focus:ring-2 ' required
                            onChange={(e) => setform({ ...form, experience: e.target.value })}
                        />
                    </div>

                    <button type='submit' className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md  focus:ring-2 '>Register</button>
                </form>
            </div>


        </main>
    )
}

export default RegisterInstructor
