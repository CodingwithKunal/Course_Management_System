import { useState } from "react"
import { registerUser } from "../../services/authService.js";
import { useNavigate } from "react-router";
import { GoEye } from "react-icons/go";
import { LuEyeClosed } from "react-icons/lu";

function UserRegister() {
  const [form, setform] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [passwordShow, setpasswordShow] = useState(false)
  const [passwordShowconf, setpasswordShowconf] = useState(false)
  const Nevigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault()

    const res = await registerUser(form)
    if (res.ok) {
      Nevigate("/verify-otp", {
        state: {
          email: res.data.email || form.email,
          role: "USER"
        },
      });
    }
  };
  return (

    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-center text-white">User Registration </h2>
      <form onSubmit={handleForm} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
          <input type="text" id="name" className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white  focus:ring-2  outline-0" required
            onChange={(e) => setform({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
          <input type="email" id="email" className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white  focus:ring-2  outline-0" required
            onChange={(e) => setform({ ...form, email: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="block text-sm font-medium text-white">
            Password
          </label>


          <div className="relative w-full">
            <input
              type={passwordShow ? "text" : "password"}
              id="password"
              value={form.password || ""}
              className="w-full px-3 py-2 pr-10 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={(e) => setform({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer focus:outline-none"
              onClick={() => setpasswordShow(!passwordShow)}
            >
              {passwordShow ? (
                <LuEyeClosed className="w-5 h-5" />
              ) : (
                <GoEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div className=" relative w-full">
          <label htmlFor="password" className="block text-sm font-medium text-white">Confirm Password</label>
          <input type={passwordShowconf ? "text" : "password"} id="password" className="w-full px-3 py-2 mt-1 border  rounded-md bg-gray-700 text-white   focus:ring-2 " required
            onChange={(e) => setform({ ...form, confirmPassword: e.target.value })}
          />
          <button className=" absolute right-3 top-11  -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer focus:outline-none"
            onClick={() => setpasswordShowconf(!passwordShowconf)}
          >

            {passwordShowconf ? (
              <LuEyeClosed className="w-5 h-5" />
            ) : (
              <GoEye className="w-5 h-5" />
            )}
          </button>
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md  focus:ring-2 ">Register</button>
      </form>
    </div>


  )
}


export default UserRegister
