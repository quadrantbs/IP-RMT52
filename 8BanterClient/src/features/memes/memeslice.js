// src/features/memes/memeSlice.js

import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import serverApi from "../../helpers/baseUrl";

export const fetchMemes = createAsyncThunk(
  "memes/fetchMemes",
  async (access_token, thunkAPI) => {
    try {
      const response = await serverApi.get("/memes");
      const memesWithLikes = await Promise.all(
        response.data.map(async (meme) => {
          const likeResponse = await serverApi.get(
            `/memes/${meme.id}/likes/status`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          return { ...meme, isLiked: likeResponse.data.isLiked };
        })
      );
      return memesWithLikes;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "memes/toggleLike",
  async ({ memeId, isLiked, access_token }, thunkAPI) => {
    try {
      if (isLiked) {
        await serverApi.delete(`/memes/${memeId}/likes`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
      } else {
        await serverApi.post(
          `/memes/${memeId}/likes`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      }
      thunkAPI.dispatch(updateMemeLikeStatus({ memeId, isLiked: !isLiked }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const updateMemeLikeStatus = (payload) => ({
  type: "memes/updateMemeLikeStatus",
  payload,
});

const memeSlice = createSlice({
  name: "memes",
  initialState: {
    memes: [],
    status: "idle",
    error: null,
  },
  reducers: {
    updateMemeLikeStatus: (state, action) => {
      const { memeId, isLiked } = action.payload;
      const meme = state.memes.find((m) => m.id === memeId);
      if (meme) {
        meme.isLiked = isLiked;
        meme.likes = isLiked ? meme.likes + 1 : meme.likes - 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMemes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.memes = action.payload;
      })
      .addCase(fetchMemes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default memeSlice.reducer;
