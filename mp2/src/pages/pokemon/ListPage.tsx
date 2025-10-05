import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchIndex, idFromUrl } from '../../api/pokemon'
import { Input } from '../../components/ui/Input'
import { Loader, ErrorMsg, Empty } from '../../components/common/State'
import { Pagination } from '../../components/Pagination'
import { useNavStore } from '../../app/store'
import type { PokemonIndexItem } from '../../api/types'

const PAGE_SIZE = 24

export function ListPage() {
    const [params, setParams] = useSearchParams()
    const pageFromUrl = Number(params.get('page') || '1')
    const qFromUrl = params.get('q') || ''
    const sortByFromUrl = (params.get('sortBy') || 'name') as 'name' | 'id'
    const orderFromUrl = (params.get('order') || 'asc') as 'asc' | 'desc'

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<PokemonIndexItem[]>([])

    const [page, setPage] = useState(pageFromUrl)
    const [q, setQ] = useState(qFromUrl)
    const [sortBy, setSortBy] = useState<'name' | 'id'>(sortByFromUrl)
    const [order, setOrder] = useState<'asc' | 'desc'>(orderFromUrl)

    useEffect(() => {
        let ok = true
        setLoading(true)
        fetchIndex(1000, 0)
            .then(res => ok && setData(res.results))
            .catch(e => ok && setError(e?.message || 'Failed to load'))
            .finally(() => ok && setLoading(false))
        return () => { ok = false }
    }, [])

    const filtered = useMemo(() => {
        const base = q ? data.filter(p => p.name.includes(q.toLowerCase())) : data
        const sorted = [...base].sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name)
            const ida = idFromUrl(a.url), idb = idFromUrl(b.url)
            return ida - idb
        })
        if (order === 'desc') sorted.reverse()
        return sorted
    }, [data, q, sortBy, order])

    const total = filtered.length
    const start = (page - 1) * PAGE_SIZE
    const items = filtered.slice(start, start + PAGE_SIZE)

    const idsForNav = useMemo(() => filtered.map(x => idFromUrl(x.url)), [filtered])
    const setList = useNavStore(s => s.setList)
    useEffect(() => { setList(idsForNav) }, [idsForNav, setList])

    useEffect(() => {
        setParams(p => {
            p.set('page', String(page))
            q ? p.set('q', q) : p.delete('q')
            p.set('sortBy', sortBy)
            p.set('order', order)
            return p
        })
    }, [page, q, sortBy, order, setParams])

    if (loading) return <Loader />
    if (error) return <ErrorMsg message={error} />

    return (
        <section aria-labelledby="list-heading">
            <div className="between">
                <h1 id="list-heading">Pokémon – List</h1>
                <div className="controls">
                    <div className="group">
                        <label className="status">Search (filters as you type)</label>
                        <Input
                            value={q}
                            onChange={(e) => { setPage(1); setQ(e.target.value) }}
                            placeholder="e.g., char, bulb…"
                            aria-label="Search Pokémon"
                        />
                    </div>
                    <div className="group">
                        <label className="status">Sort by</label>
                        <select className="input" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                            <option value="name">Name</option>
                            <option value="id">ID</option>
                        </select>
                    </div>
                    <div className="group">
                        <label className="status">Order</label>
                        <select className="input" value={order} onChange={e => setOrder(e.target.value as any)}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="card">
                    <p className="status">No results found.</p>
                    <div className="row mtSm">
                        <button className="btn" onClick={() => { setQ(''); setPage(1); }}>
                            Clear search
                        </button>
                        <button className="btn ghost" onClick={() => { setSortBy('name'); setOrder('asc'); setPage(1); }}>
                            Reset sort/order
                        </button>
                        <Link to="/gallery" className="btn ghost navLink">Go to Gallery →</Link>
                    </div>
                </div>
            ) : (
                <>
                    <ul className="grid cards">
                        {items.map((p) => {
                            const id = idFromUrl(p.url)
                            return (
                                <li key={p.name} className="card">
                                    <Link to={`/pokemon/${id}`} className="navLink">#{id} {p.name}</Link>
                                </li>
                            )
                        })}
                    </ul>

                    <div className="mtSm">
                        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={(p) => setPage(p)} />
                    </div>
                </>
            )}
        </section>
    )
}