import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
let user = token ? jwtDecode(token) : null; // Decode token to get user Id and Role, if token exists


const initialState = {
    token: token || null,
    user: user || null,
    isAuthenticated: token ? true : false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{

        Setlogin: (state, action) =>{

            state.user = jwtDecode(action.payload);

            state.token = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("token", action.payload);
        },
        Setlogout: (state) => {

            state.user = null;

            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        },
    },
})
export const { Setlogin, Setlogout } = authSlice.actions;
export default authSlice.reducer;