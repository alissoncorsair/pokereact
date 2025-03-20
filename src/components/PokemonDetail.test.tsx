import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../tests/utils";
import PokemonDetail from "./PokemonDetail";

describe("PokemonDetail", () => {
  it("should render loading state initially", () => {
    renderWithProviders(<PokemonDetail />, {
      route: "/pokemon/1",
      useMemoryRouter: true,
    });

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should display pokemon details after loading", async () => {
    renderWithProviders(<PokemonDetail />, {
      route: "/pokemon/1",
      useMemoryRouter: true,
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Pokemon--1")).toBeInTheDocument();
    expect(screen.getByTestId("favorite-button")).toBeInTheDocument();
    expect(screen.getByText("normal")).toBeInTheDocument();
    expect(screen.getByText("ability")).toBeInTheDocument();
    expect(screen.getByText("hp: 50")).toBeInTheDocument();
  });

  it("should toggle favorite status when clicking the favorite button", async () => {
    const user = userEvent.setup();

    renderWithProviders(<PokemonDetail />, {
      route: "/pokemon/1",
      useMemoryRouter: true,
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    const favoriteButton = screen.getByTestId("favorite-button");
    expect(favoriteButton).toHaveTextContent("☆ Favorite");

    await user.click(favoriteButton);
    expect(favoriteButton).toHaveTextContent("★ Unfavorite");

    await user.click(favoriteButton);
    expect(favoriteButton).toHaveTextContent("☆ Favorite");
  });
});
