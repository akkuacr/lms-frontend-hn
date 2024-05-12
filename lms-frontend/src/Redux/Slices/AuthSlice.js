import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from "../../Helpers/axiosInstance"

export const createAccount = createAsyncThunk("/auth/signup",async(data)=>{
    try{

        const res = axiosInstance.post("/user/register",data);
         toast.promise(res,{
            loading:"Wait ! creating your account ",
            success:(data)=>{
                 return data?.data?.message;
            },
            error:"Server not Reached"
         });
         
         return (await res).data;

    }catch{
        toast.error(error?.response?.data?.message);
    }
})

const initiState={
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    data:localStorage.getItem('data') || {}
}

const authSlice = createSlice({
    name:'auth',
    initialState:{},
    reducers:{},
})

///export const {} = authSlice.actions;
export default authSlice.reducer;   

