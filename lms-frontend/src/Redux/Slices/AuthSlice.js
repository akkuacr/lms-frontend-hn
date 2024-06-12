import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from "../../Helpers/axiosInstance"



const initiState={
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    data:localStorage.getItem('data') || {}
}


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


export const login = createAsyncThunk("/auth/login",async(data)=>{
    try{

        const res = axiosInstance.post("/user/login",data);
         toast.promise(res,{
            loading:"Wait ! authentication  in progress... ",
            success:(data)=>{
                 return data?.data?.message;
            },
            error:"Failed to login"
         });
         
         return (await res).data;

    }catch{
        toast.error(error?.response?.data?.message);
    }
})

 

const authSlice = createSlice({
    name:'auth',
    initialState:{},
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(login.fulfilled,(state,action)=>{
            localStorage.setItem("data",JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("role",action?.payload?.user?.role);
            state.isLoggedIn=true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role;
        })
    }
})

///export const {} = authSlice.actions;
export default authSlice.reducer;   
