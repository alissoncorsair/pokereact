import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../tests/utils";
import PokemonList from "./PokemonList";
import { server } from "../tests/mocks/server";
import { http, HttpResponse } from "msw";
import { API_BASE_URL } from "../utils/config";

describe("PokemonList", () => {
  it("should render loading state initially", () => {
    renderWithProviders(<PokemonList />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByText("Loading Pokémon...")).toBeInTheDocument();
  });

  it("should display list of pokemon after loading", async () => {
    renderWithProviders(<PokemonList />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    expect(screen.getByText("PokeReact")).toBeInTheDocument();

    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("Ivysaur")).toBeInTheDocument();
    expect(screen.getByText("Venusaur")).toBeInTheDocument();

    expect(screen.getByTestId("pokemon-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("pokemon-item-2")).toBeInTheDocument();
    expect(screen.getByTestId("pokemon-item-3")).toBeInTheDocument();
  });

  it("should show error state when API call fails", async () => {
    server.use(
      http.get(`${API_BASE_URL}/pokemon`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    expect(screen.getByText("Error loading Pokémon list")).toBeInTheDocument();
  });

  it("should display favorite indicator for favorited pokemon", async () => {
    renderWithProviders(<PokemonList />, {
      preloadedState: {
        favorites: { ids: [1, 3] },
      },
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    const bulbasaurItem = screen.getByTestId("pokemon-item-1");
    const ivysaurItem = screen.getByTestId("pokemon-item-2");
    const venusaurItem = screen.getByTestId("pokemon-item-3");

    expect(bulbasaurItem.textContent).toContain("⭐");
    expect(ivysaurItem.textContent).not.toContain("⭐");
    expect(venusaurItem.textContent).toContain("⭐");
  });

  it("should have correct link to pokemon detail page", async () => {
    renderWithProviders(<PokemonList />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    const bulbasaurLink = screen.getByRole("link", { name: /Bulbasaur/ });
    expect(bulbasaurLink).toHaveAttribute("href", "/pokemon/1");
  });
});
