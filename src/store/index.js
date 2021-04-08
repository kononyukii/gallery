import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { gallerySlice } from '../redusers';

const middleware = getDefaultMiddleware({ thunk: true });

 const store = configureStore({
  reducer: gallerySlice.reducer,
  middleware,
});

export default store;

store.subscribe(() => store.getState());

