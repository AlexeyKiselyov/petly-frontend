import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotices,
  fetchOneNotice,
  addNotice,
  deleteNotice,
} from './noticesOperations';

const initialState = {
  notices: [],
  oneNotice: {},
  isLoading: false,
  error: null,
  notifyNotices: null,
};

const handlePending = state => {
  state.isLoading = true;
  state.error = null;
  state.notifyNotices = null;
};

const handleRejected = (state, { payload }) => {
  state.error = payload;
  state.isLoading = false;
};

const noticesSlice = createSlice({
  name: 'notices',
  initialState,
  extraReducers: builder => {
    builder
      // отримання оголошень по категоріям
      .addCase(fetchNotices.pending, handlePending)
      .addCase(fetchNotices.fulfilled, (state, { payload }) => {
        state.notices = payload.notices;
        state.isLoading = false;
      })
      .addCase(fetchNotices.rejected, handleRejected)
      // отримання одного оголошення
      .addCase(fetchOneNotice.pending, handlePending)
      .addCase(fetchOneNotice.fulfilled, (state, { payload }) => {
        state.oneNotice = payload;
        state.isLoading = false;
      })
      .addCase(fetchOneNotice.rejected, handleRejected)
      // додавання оголошень відповідно до обраної категорії
      .addCase(addNotice.pending, handlePending)
      .addCase(addNotice.fulfilled, (state, { payload }) => {
        if (
          state.notices[0].category === payload.route ||
          payload.route === 'owner'
        ) {
          state.notices.unshift(payload.data);
        }
        state.notifyNotices = 'Notice was successfully added!';
        state.isLoading = false;
      })
      .addCase(addNotice.rejected, handleRejected)
      // видалення оголошення авторизованого користувача створеного цим же користувачем
      .addCase(deleteNotice.pending, handlePending)
      .addCase(deleteNotice.fulfilled, (state, { payload }) => {
        state.notices = state.notices.filter(({ _id }) => _id !== payload);
        state.notifyNotices = 'Notice was successfully deleted!';
        state.isLoading = false;
      })
      .addCase(deleteNotice.rejected, handleRejected);
  },
  reducers: {
    clearNotices(state, { payload }) {
      state.notices = payload;
    },
    changeFavotitesNotices(state, { payload }) {
      state.notices = state.notices.filter(notice => notice._id !== payload);
    },
  },
});

export default noticesSlice.reducer;
export const { clearNotices, changeFavotitesNotices } = noticesSlice.actions;
