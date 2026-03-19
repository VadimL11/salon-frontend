'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function InitData() {
  const initData = useAppStore(state => state.initData);

  useEffect(() => {
    initData().catch(console.error);
  }, [initData]);

  return null;
}
