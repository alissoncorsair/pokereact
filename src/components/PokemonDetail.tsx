import { useParams, Link } from 'react-router-dom';
import { useGetPokemonByIdQuery } from '../features/pokemon/pokemonApi';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleFavorite, selectFavorites } from '../features/pokemon/favoritesSlice';
import { useEffect, useState, useMemo } from 'react';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const InfoList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="info-group">
    <h2>{title}</h2>
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const PokemonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const pokemonId = parseInt(id || '-1', 10);
  const { data, isLoading, error, isFetching, refetch } = useGetPokemonByIdQuery(pokemonId);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const isFavorite = favorites.includes(pokemonId);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isDataLoading = isLoading || isFetching;

  useEffect(() => {
    setImageLoaded(false);
  }, [data]);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(pokemonId));
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const imageUrl = useMemo(
    () => data?.sprites.other['official-artwork'].front_default || data?.sprites.front_default,
    [data]
  );

  if (isDataLoading) {
    return (
      <div className="pokemon-detail loading" data-testid="loading" aria-live="polite">
        <Link to="/" className="back-button">← Back to List</Link>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Pokémon details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pokemon-detail error" data-testid="error" aria-live="assertive">
        <Link to="/" className="back-button">← Back to List</Link>
        <div className="error-container">
        <p>Error loading Pokémon details. Please try again.</p>
        <button onClick={refetch} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="pokemon-detail" data-testid="pokemon-detail">
      <Link to="/" className="back-button">← Back to List</Link>
      
      <div className="pokemon-header">
        <h1>{capitalize(data.name)}</h1>
        <button 
          onClick={handleToggleFavorite} 
          data-testid="favorite-button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "★ Unfavorite" : "☆ Favorite"}
        </button>
      </div>

      <div className="pokemon-image">
        {!imageLoaded && <div className="image-loading-placeholder"></div>}
        <img 
          src={imageUrl} 
          alt={data.name}
          data-testid="pokemon-image"
          className={imageLoaded ? 'visible' : 'hidden'}
          onLoad={handleImageLoad}
          onError={() => setImageLoaded(false)} 
        />
      </div>

      <div className="pokemon-info">
        <InfoList title="Types" items={data.types.map((type) => type.type.name)} />
        <InfoList title="Abilities" items={data.abilities.map((ability) => 
          `${ability.ability.name}${ability.is_hidden ? ' (hidden)' : ''}`
        )} />
        <InfoList 
          title="Stats" 
          items={data.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`)} 
        />
        <div className="info-group">
          <h2>Base Info</h2>
          <p>Height: {data.height / 10}m</p>
          <p>Weight: {data.weight / 10}kg</p>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
