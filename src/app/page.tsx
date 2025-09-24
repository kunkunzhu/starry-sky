'use client'

import React from 'react'
// import StarField from "../components/StarField";
import Link from 'next/link';
import dynamic from 'next/dynamic'

const StarField = dynamic(() => import('../components/StarField'), {
  ssr: false,
})

export default function Home() {

  return (
    <>
      <Link
        href='/about'
        className="absolute bottom-4 left-4 text-lg opacity-40 hover:opacity-100 transition-opacity duration-300"
      >
        ⓘ
      </Link>
      <StarField />
    </>
  );
}
