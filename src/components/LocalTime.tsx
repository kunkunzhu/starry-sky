'use client'

// ref: https://francoisbest.com/posts/2023/displaying-local-times-in-nextjs

import { useHydration } from '@/lib/hooks/useHydration'
import { formatTime } from '@/lib/util/format'
import { Suspense } from 'react'

type Props = React.ComponentProps<'time'> & {
    time: Date
    hydratedSuffix?: React.ReactNode
}

export function LocalTime({ time, hydratedSuffix = null, ...props }: Props) {
    const iso = new Date(time).toISOString()
    const hydrated = useHydration()
    return (
        <Suspense key={hydrated ? 'local' : 'utc'}>
            <time dateTime={iso} title={iso} {...props}>
                {formatTime(time)}
                {hydrated ? hydratedSuffix : ' (UTC)'}
            </time>
        </Suspense>
    )
}