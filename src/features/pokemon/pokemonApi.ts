import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PokemonDetail, PokemonListResponse } from './types';
import { API_BASE_URL } from '../../utils/config';

export const extractIdFromUrl = (url: string): number => {
  const segments = url.split('/');
  return parseInt(segments[segments.length - 2], 10);
};

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Pokemon'],
  endpoints: (builder) => ({
    getPokemonList: builder.query<PokemonListResponse, void>({
      query: () => 'pokemon?limit=100',
      providesTags: ['Pokemon'],
    }),
    getPokemonById: builder.query<PokemonDetail, number>({
      query: (id) => `pokemon/${id}`,
      providesTags: (result, error, id) => [{ type: 'Pokemon', id }],
    }),
  }),
});

export const { useGetPokemonListQuery, useGetPokemonByIdQuery } = pokemonApi;