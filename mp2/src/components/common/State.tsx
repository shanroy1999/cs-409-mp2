export function Empty({ children }: { children: React.ReactNode }) {
    return <p role="status" className="status">{children}</p>
}
export function ErrorMsg({ message }: { message: string }) {
    return <p role="alert" className="status error">{message}</p>
}
export function Loader() {
    return <div role="status" aria-live="polite" className="status">Loading…</div>
}
