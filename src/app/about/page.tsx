import Link from "next/link"

export default function AboutOverlay() {
    return (
        <div className="flex justify-end">
            <Link href='/' className="absolute bottom-4 left-4 text-lg opacity-40 hover:opacity-100 transition-opacity duration-300">
                ⓧ
            </Link>
            <div className="max-w-[600px] mt-4 mr-4 text-right flex flex-col gap-8 text-sm">
                <div>i think about the sky at night. how the stars may no longer be there and their glow remains, long after their lifespans have extinguished.</div>
                <div>i remember you. i remember the warmth that lingered between us. this vast night sky does not feel so bleak because you were here, once.</div>
            </div>
        </div>
    )
}