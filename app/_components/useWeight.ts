// useWeight.ts
import { useEffect, useState } from 'react';

export function useWeight() {
  const [weight, setWeight] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/connect');
    ws.onmessage = (e) => {
      setWeight(e.data);
    };
    return () => ws.close();
  }, []);

  return weight;
}
