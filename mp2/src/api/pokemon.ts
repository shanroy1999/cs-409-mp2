import { api } from './client'
import type { Pokemon, PokemonIndexResponse, PokemonTypeName } from './types'

export function idFromUrl(url: string): number {
    const m = url.match(/\/pokemon\/(\d+)\/?$/)
    return m ? Number(m[1]) : 0
}

const MOCK: PokemonIndexResponse = {
    count: 3, next: null, previous: null,
    results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' }
    ],
}

export async function fetchIndex(limit = 1000, offset = 0): Promise<PokemonIndexResponse> {
    try {
        const res = await api.get<PokemonIndexResponse>('/pokemon', { params: { limit, offset } })
        return res.data
    } catch {
        return MOCK
    }
}

export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
    const res = await api.get<Pokemon>(`/pokemon/${idOrName}`)
    return res.data
}

export async function fetchType(name: PokemonTypeName) {
    const res = await api.get<{ pokemon: { pokemon: { name: string; url: string } }[] }>(`/type/${name}`)
    return res.data.pokemon.map(p => p.pokemon) // [{name,url}]
}