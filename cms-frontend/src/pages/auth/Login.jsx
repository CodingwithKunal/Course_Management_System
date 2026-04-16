import { useState } from "react"
import { loginUser } from "../../services/authService.js"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { Setlogin } from "../../App/authSlice.js"

function Login() {
  const [form, setform] = useState({email:"", password:""})
  const dispatch = useDispatch()
  const nevigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await loginUser(form) 
    if(res.ok){
         dispatch(Setlogin(res.data.token))
         nevigate("/")
    }
    
    
  }
  return (
    <main className=" flex items-center justify-center   h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input type="email" id="email" className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white  focus:ring-2  outline-0" required 
             onChange={(e)=>setform({...form, email: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input type="password" id="password" className="w-full px-3 py-2 mt-1 border  rounded-md bg-gray-700 text-white   focus:ring-2 " required 
              onChange={(e)=>setform({...form, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md  focus:ring-2 ">Login</button>
        </form>

      </div>
      
     
    </main>
  )
}

export default Login
