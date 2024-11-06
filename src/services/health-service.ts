import { apiSlice } from '@/lib/store/slices/apiSlice';

const healthService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHealthReport: builder.query<any, void>({
      query: () => ({
        url: '/health',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetHealthReportQuery } = healthService;
