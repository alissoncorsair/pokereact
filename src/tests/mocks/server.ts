import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../../utils/config';

export const handlers = [
  http.get(`${API_BASE_URL}/pokemon`, () => {
    return HttpResponse.json({
      count: 1118,
      next: `${API_BASE_URL}/pokemon?offset=20&limit=20`,
      previous: null,
      results: [
        { name: 'bulbasaur', url: `${API_BASE_URL}/pokemon/1/` },
        { name: 'ivysaur', url: `${API_BASE_URL}/pokemon/2/` },
        { name: 'venusaur', url: `${API_BASE_URL}/pokemon/3/` },
      ]
    });
  }),

  http.get(`${API_BASE_URL}/pokemon/1`, () => {
    return HttpResponse.json({
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        other: {
          'official-artwork': {
            front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
          }
        }
      },
      types: [
        { slot: 1, type: { name: 'grass' } },
        { slot: 2, type: { name: 'poison' } }
      ],
      abilities: [
        { ability: { name: 'overgrow' }, is_hidden: false },
        { ability: { name: 'chlorophyll' }, is_hidden: true }
      ],
      stats: [
        { base_stat: 45, stat: { name: 'hp' } },
        { base_stat: 49, stat: { name: 'attack' } }
      ]
    });
  }),

  http.get(`${API_BASE_URL}/pokemon/:id`, ({ params }) => {
    if (params.id === '999') {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      id: Number(params.id),
      name: `pokemon-${params.id}`,
      height: 10,
      weight: 100,
      sprites: {
        front_default: `https://example.com/sprite-${params.id}.png`,
        other: {
          'official-artwork': {
            front_default: `https://example.com/artwork-${params.id}.png`
          }
        }
      },
      types: [{ slot: 1, type: { name: 'normal' } }],
      abilities: [{ ability: { name: 'ability' }, is_hidden: false }],
      stats: [{ base_stat: 50, stat: { name: 'hp' } }]
    });
  })
];

export const server = setupServer(...handlers);