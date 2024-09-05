// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import memeReducer from '../features/memes/memeSlice'; 

// Setup store Redux
const store = configureStore({
  reducer: {
    memes: memeReducer, 
  },
});

export default store;
