import { useGetPokemonListQuery } from "../features/pokemon/pokemonApi";
import { extractIdFromUrl } from "../features/pokemon/pokemonApi";
import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { selectFavorites } from "../features/pokemon/favoritesSlice";

const PokemonList = () => {
  const { data, isLoading, error } = useGetPokemonListQuery();
  const favorites = useAppSelector(selectFavorites);

  if (isLoading) return <div data-testid="loading">Loading Pokémon...</div>;
  if (error) return <div data-testid="error">Error loading Pokémon list</div>;

  return (
    <div className="pokemon-list">
      <h1>PokeReact</h1>
      <ul>
        {data?.results.map((pokemon) => {
          const id = extractIdFromUrl(pokemon.url);
          const isFavorite = favorites.includes(id);

          return (
            <Link key={pokemon.name} to={`/pokemon/${id}`}>
              <li data-testid={`pokemon-item-${id}`}>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                {isFavorite && " ⭐"}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default PokemonList;
