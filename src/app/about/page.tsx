'use client'

import Link from "next/link"
import dynamic from 'next/dynamic'

const Field = dynamic(() => import('../../components/Field'), {
    ssr: false,
})

export default function About() {

    return (
        <>
            <Link href='/' className="absolute bottom-4 left-4 text-lg p-2 opacity-40 hover:opacity-100 transition-opacity duration-300" id='message'>
                ⓧ
            </Link>
            <div className="w-screen mt-4 mr-4 p-10 absolute flex justify-end">
                <div className="flex max-w-[600px] flex-col gap-8 text-xs">
                    <div>
                        I look towards the night sky & think about how it’s a graveyard of stars whose lifespans have extinguished long ago. It’s a fact that used to fill me with sorrow. But these days
                        I&apos;m recognizing it as something heartbreakingly tender: how the radiance of these forgone stars linger onwards into time, illuminating a sky that they never foresaw.
                    </div>
                    <div>
                        I recall the individuals whose presence in my life, albeit brief, have subtly and irrevocably shaped me. The light, albeit fleeting, was once there. And I’m still standing in its afterglow,
                        transmuted by its touch.
                    </div>
                    <div>I remember you. I remember the warmth that lingered between us. This vast night sky does not feel so desolate, all because you were here, once. </div>
                </div>
            </div>
            <Field skyMode="night" />
        </>
    )
}