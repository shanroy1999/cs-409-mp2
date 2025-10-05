import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchIndex, fetchPokemon, idFromUrl } from '../../api/pokemon'
import type { PokemonTypeName } from '../../api/types'
import { Loader, ErrorMsg, Empty } from '../../components/common/State'
import { useNavStore } from '../../app/store'

const TYPES: PokemonTypeName[] = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying',
    'psychic', 'bug', 'rock', 'ghost', 'dark', 'dragon', 'steel', 'fairy'
]

type GalleryItem = { id: number; name: string; img: string | null; types: PokemonTypeName[] }

export function GalleryPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [images, setImages] = useState<GalleryItem[]>([])
    const [selected, setSelected] = useState<Set<PokemonTypeName>>(new Set())

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        fetchIndex(400, 0)
            .then(async (res) => {
                const first = res.results
                const out: GalleryItem[] = []
                for (const item of first) {
                    const id = idFromUrl(item.url)
                    try {
                        const p = await fetchPokemon(id)
                        const img = p.sprites.other?.['official-artwork']?.front_default ?? p.sprites.front_default ?? null
                        const types = p.types.map(t => t.type.name) as PokemonTypeName[]
                        out.push({ id, name: p.name, img, types })
                    } catch {
                        out.push({ id, name: item.name, img: null, types: [] })
                    }
                    if (cancelled) return
                }
                if (!cancelled) setImages(out)
            })
            .catch(e => !cancelled && setError(e?.message || 'Failed to load'))
            .finally(() => !cancelled && setLoading(false))
        return () => { cancelled = true }
    }, [])

    const filtered = useMemo(() => {
        if (selected.size === 0) return images
        return images.filter(p => Array.from(selected).every(t => p.types.includes(t)))
    }, [images, selected])

    const idsForNav = useMemo(() => filtered.map(x => x.id), [filtered])
    const setList = useNavStore(s => s.setList)
    useEffect(() => { setList(idsForNav) }, [idsForNav, setList])

    if (loading && images.length === 0) return <Loader />
    if (error) return <ErrorMsg message={error} />
    return (
        <section aria-labelledby="gallery-heading">
            <div className="controls mtSm">
                <h1 id="gallery-heading">Pokémon – Gallery</h1>
                <div className="row wrap">
                    {TYPES.map(t => (
                        <button
                            key={t}
                            onClick={() => {
                                const next = new Set(selected)
                                next.has(t) ? next.delete(t) : next.add(t)
                                setSelected(next)
                            }}
                            className={`badge ${selected.has(t) ? 'active' : ''}`}
                            aria-pressed={selected.has(t)}
                        >{t}</button>
                    ))}
                    {selected.size > 0 && (
                        <button className="badge" onClick={() => setSelected(new Set())}>Clear</button>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="card">
                    <p className="status">No Pokémon match the selected type filters.</p>
                    <div className="row mtSm">
                        <button className="btn" onClick={() => setSelected(new Set())}>Clear filters</button>
                        <Link className="btn ghost navLink" to="/">← Back to List</Link>
                    </div>
                </div>
            ) : (
                <ul className="grid cards">
                    {filtered.map(p => (
                        <li key={p.id} className="card">
                            <Link to={`/pokemon/${p.id}`} className="navLink">
                                <div className="square">
                                    {p.img ? <img src={p.img} alt={p.name} /> : null}
                                </div>
                                <div className="row wrap mtSm">
                                    <div className="navLink">#{p.id} {p.name}</div>
                                    <div className="row wrap">
                                        {p.types.map(t => <span key={t} className="badge">{t}</span>)}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}