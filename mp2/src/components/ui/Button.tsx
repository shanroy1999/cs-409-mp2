import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
export function Button({ className = '', loading, children, ...rest }: Props) {
    return (
        <button className={`btn ${className}`} aria-busy={loading || undefined} {...rest}>
            {loading ? 'Loading…' : children}
        </button>
    )
}