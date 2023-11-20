'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation'

export default function ALink({ children, className='', activeClass, href }: { children: React.ReactNode; className?: string, activeClass?: string, href: string }) {

    const pathname = usePathname()

    return (
        <Link href={href} className={`${className} ${pathname === href ? activeClass + ' active' : ''}`}>
            {children}
        </Link>
    )
}