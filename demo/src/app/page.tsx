'use client';
import { useEffect, useRef } from 'react';
import { Muser } from '@/muser/index';
import Wrapper from './components/wrapper';

export default function Home() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const muse = new Muser([
      new Wrapper({
        canvas: el.current,
        width: 1000,
        height: 1000,
      }),
    ]);
  
    muse.render();
  }, []);

  return (
    <div>
      <canvas ref={el} width="1000" height="1000"></canvas>
    </div>
  );
}
