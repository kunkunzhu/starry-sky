'use client'

import Link from 'next/link';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import { getSkyMode, getTimeUntilNight } from '@/lib/util/sky';
import { LocationCoords } from '@/lib/types/misc';
import { formatMilliseconds } from '@/lib/util/format';
import { SkyMode } from '@/lib/types/sky';

const StarField = dynamic(() => import('../components/StarField'), {
  ssr: false,
})

const Field = dynamic(() => import('../components/Field'), {
  ssr: false,
})

export default function Home() {

  const [skyMode, setSkyMode] = useState<SkyMode>('day');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<LocationCoords>({ lat: 43.47, long: -80.52 });
  const [nightCountdown, setNightCountdown] = useState<number>(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ lat: latitude, long: longitude });
      })
    }
  }, []);

  useEffect(() => {
    const timeUntilNight = getTimeUntilNight({ currentTime, location });
    setNightCountdown(timeUntilNight);
  }, [location, currentTime]);

  useEffect(() => {
    const skyMode = getSkyMode({ currentTime, location });
    setSkyMode(skyMode);
  }, [location, currentTime]);

  return (
    <>
      {
        skyMode == 'night' ? (
          <>
            <Link
              href='/about'
              className="absolute bottom-4 left-4 text-lg p-2 opacity-40 hover:opacity-100 transition-opacity duration-300"
            >
              ⓘ
            </Link>
            <StarField />
          </>
        ) : (
          <>
            <div className='absolute w-screen h-screen flex flex-col items-center justify-center' id='no-glow'>
              <span>it is currently {skyMode} time.</span>
              <span>come back in {nightCountdown && formatMilliseconds(nightCountdown)} to stargaze!</span>
            </div>
            <Field skyMode={skyMode} glow={false} />
          </>
        )
      }
    </>
  );
}
