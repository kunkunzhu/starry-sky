'use client'

import React from 'react'
import Link from 'next/link';
import dynamic from 'next/dynamic'

const StarField = dynamic(() => import('../components/StarField'), {
  ssr: false,
})

export default function Home() {

  return (
    <div className='w-screen h-screen overflow-hidden'>
      <Link
        href='/about'
        className="absolute bottom-4 left-4 text-lg p-2 opacity-40 hover:opacity-100 transition-opacity duration-300"
      >
        ⓘ
      </Link>
      <StarField />
    </div>
  );
}
