import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../HttpClient';

const API_TAG_TYPE: string[] = ['users'];

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  keepUnusedDataFor: 120,
  tagTypes: API_TAG_TYPE,
  endpoints: () => ({}),
});
