import { apiSlice } from '@/lib/store/slices/apiSlice';

export const USERS_TAG = 'users';

const userService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, void>({
      query: () => ({
        url: '/users',
        method: 'GET',
        useAuth: true,
      }),
      providesTags: [USERS_TAG],
    }),
  }),
});

export const { useGetAllUsersQuery } = userService;
