type Props = { page: number; pageSize: number; total: number; onPageChange: (p: number) => void }
export function Pagination({ page, pageSize, total, onPageChange }: Props) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    return (
        <div className="row between">
            <button className="btn ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
            <span className="status">Page {page} / {totalPages}</span>
            <button className="btn ghost" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
        </div>
    )
}