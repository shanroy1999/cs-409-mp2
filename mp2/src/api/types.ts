export type PokemonIndexItem = { name: string; url: string }
export type PokemonIndexResponse = {
    count: number
    next: string | null
    previous: string | null
    results: PokemonIndexItem[]
}

export type PokemonTypeName =
    | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice' | 'fighting' | 'poison' | 'ground' | 'flying'
    | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dark' | 'dragon' | 'steel' | 'fairy'

export type PokemonTypeRef = { slot: number; type: { name: PokemonTypeName; url: string } }

export type Pokemon = {
    id: number
    name: string
    height: number
    weight: number
    base_experience: number
    sprites: {
        other?: { [k: string]: { front_default?: string | null } }
        front_default?: string | null
    }
    types: PokemonTypeRef[]
    abilities: { ability: { name: string; url: string } }[]
    stats: { base_stat: number; stat: { name: string } }[]
}