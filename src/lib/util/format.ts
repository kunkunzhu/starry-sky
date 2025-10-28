export function formatTime(date: Date | string | number): string {
    return new Date(date).toLocaleTimeString('en-CA', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function formatMilliseconds(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const times = []
    if (hours > 0) {
        times.push(`${hours}h `)
    }
    if (minutes > 0) {
        times.push(`${minutes}m `)
    }
    if (seconds > 0) {
        times.push(`${seconds}s`)
    }

    return times.join(' ').trim()
}