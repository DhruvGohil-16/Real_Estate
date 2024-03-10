import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error:null,
    loading:false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.error = null;
            state.loading = true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser = action.payload;
            console.log(state.currentUser);
            state.loading=false;
            state.error=null;
        },
        signInFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        updateStart:(state)=>{
            state.error = null;
            state.loading = true;
        },
        updateSuccess:(state,action)=>{
            state.currentUser = action.payload;
            console.log(state.currentUser);
            state.loading=false;
            state.error=null;
        },
        updateFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        }
    }
})

export const {signInFailure,signInStart,signInSuccess,updateFailure,updateStart,updateSuccess} = userSlice.actions;

export default userSlice.reducer;