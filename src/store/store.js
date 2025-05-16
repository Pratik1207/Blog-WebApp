import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";  // adjust path accordingly

const store = configureStore({
    reducer: {
        auth: authReducer
    }
});

export default store;
