import { createSlice } from "@reduxjs/toolkit";
import serverApi from "../../helpers/baseUrl";

export const fetchMemes = (access_token) => async (dispatch) => {
  dispatch(setLoading(true));
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
    dispatch(setMemes(memesWithLikes));
  } catch (error) {
    dispatch(setError(error.response.data.error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const toggleLike = ({ memeId, isLiked, access_token }) => async (dispatch) => {
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
    dispatch(updateMemeLikeStatus({ memeId, isLiked: !isLiked }));
  } catch (error) {
    dispatch(setError(error.response.data.error));
  }
};

const memeSlice = createSlice({
  name: "memes",
  initialState: {
    memes: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.status = action.payload ? "loading" : "idle";
    },
    setMemes: (state, action) => {
      state.memes = action.payload;
      state.status = "succeeded";
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
    updateMemeLikeStatus: (state, action) => {
      const { memeId, isLiked } = action.payload;
      const meme = state.memes.find((m) => m.id === memeId);
      if (meme) {
        meme.isLiked = isLiked;
        meme.likes = isLiked ? meme.likes + 1 : meme.likes - 1;
      }
    },
  },
});

export const { setLoading, setMemes, setError, updateMemeLikeStatus } = memeSlice.actions;

export default memeSlice.reducer;
