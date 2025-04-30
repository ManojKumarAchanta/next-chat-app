import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    // Add credentials if needed
    // credentials: 'include',
  }),
  endpoints: (builder) => ({
    // Define your endpoints here
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "/users/signup",
        method: "POST",
        body: userData,
      }),
    }),
    // Add more endpoints as needed
  }),
  // Enable caching, invalidation, polling, etc.
  tagTypes: ["User"],
});

// Export hooks for using the endpoints
export const { useLoginMutation, useSignupMutation } = api;
