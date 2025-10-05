import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchPokemon } from '../../api/pokemon'
import { Loader, ErrorMsg } from '../../components/common/State'
import { useNavStore } from '../../app/store'
import { useEffect, useMemo, useState } from 'react'
import type { Pokemon } from '../../api/types'

export function PokemonDetailPage() {
    const { idOrName } = useParams()
    const [data, setData] = useState<Pokemon | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const { currentList } = useNavStore()
    const navigate = useNavigate()

    useEffect(() => {
        let ok = true
        setLoading(true)
        fetchPokemon(idOrName as string)
            .then(p => ok && setData(p))
            .catch(e => ok && setError(e?.message || 'Failed to load'))
            .finally(() => ok && setLoading(false))
        return () => { ok = false }
    }, [idOrName])

    const idx = useMemo(() => {
        const id = Number(idOrName)
        if (!Number.isNaN(id) && id > 0) return currentList.indexOf(id)
        return -1
    }, [idOrName, currentList])

    const prevId = idx > 0 ? currentList[idx - 1] : undefined
    const nextId = idx >= 0 && idx < currentList.length - 1 ? currentList[idx + 1] : undefined

    if (loading) return <Loader />
    if (error || !data) return <ErrorMsg message={error || 'Failed to load'} />

    const img = data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default ?? null

    return (
        <article>
            <Link to="/" className="navLink">← Back</Link>

            <div className="detail mtSm">
                <div className="card">
                    {img ? <img src={img} alt={data.name} /> : <div className="status">No image</div>}
                </div>

                <div className="prose">
                    <h1>#{data.id} {data.name}</h1>
                    <dl className="statsGrid">
                        <dt className="status">Height</dt><dd>{data.height}</dd>
                        <dt className="status">Weight</dt><dd>{data.weight}</dd>
                        <dt className="status">Base EXP</dt><dd>{data.base_experience}</dd>

                        <dt className="status">Types</dt>
                        <dd className="row wrap">
                            {data.types.map(t => <span key={t.type.name} className="badge">{t.type.name}</span>)}
                        </dd>

                        <dt className="status">Abilities</dt>
                        <dd className="row wrap">
                            {data.abilities.map(a => <span key={a.ability.name} className="badge">{a.ability.name}</span>)}
                        </dd>

                        <dt className="status">Stats</dt>
                        <dd>
                            <ul className="grid">
                                {data.stats.map(s => (
                                    <li key={s.stat.name} className="statRow">
                                        <span className="statName">{s.stat.name}</span>
                                        <meter min={0} max={200} value={s.base_stat}></meter>
                                        <span>{s.base_stat}</span>
                                    </li>
                                ))}
                            </ul>
                        </dd>
                    </dl>

                    <div className="row mtSm">
                        <button className="btn" disabled={!prevId} onClick={() => prevId && navigate(`/pokemon/${prevId}`)}>← Prev</button>
                        <button className="btn" disabled={!nextId} onClick={() => nextId && navigate(`/pokemon/${nextId}`)}>Next →</button>
                    </div>
                </div>
            </div>
        </article>
    )
}