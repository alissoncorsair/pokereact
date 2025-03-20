import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface FavoritesState {
  ids: number[];
}

const loadInitialState = (): FavoritesState => {
  try {
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : { ids: [] };
  } catch {
    return { ids: [] };
  }
};

const initialState: FavoritesState = loadInitialState();

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.ids.indexOf(id);

      if (index !== -1) {
        state.ids.splice(index, 1);
      } else {
        state.ids.push(id);
      }

      localStorage.setItem('pokemonFavorites', JSON.stringify(state));
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const selectFavorites = (state: RootState) => state.favorites.ids;
export default favoritesSlice.reducer;