import React, { JSX, PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { pokemonApi } from "../features/pokemon/pokemonApi";
import favoritesReducer from "../features/pokemon/favoritesSlice";

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    route = "/",
    useMemoryRouter = false,
    ...renderOptions
  } = {}
) {
  const store = configureStore({
    reducer: {
      favorites: favoritesReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
    preloadedState,
  });

  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        {useMemoryRouter ? (
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        ) : (
          <BrowserRouter>{children}</BrowserRouter>
        )}
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export * from "@testing-library/react";
