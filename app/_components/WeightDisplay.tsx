'use client';

import { useWeight } from './useWeight';
import { useState } from 'react';

export default function WeightDisplay() {
  const weight = useWeight();
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  const handleConnect = async () => {
    setStatus('connecting');
    try {
      const res = await fetch('http://localhost:8080/connect', {
        method: 'POST',
      });
      const json = await res.json();
      if (json.status === 'connected' || json.status === 'already-connected') {
        setStatus('connected');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Connection error:', err);
      setStatus('error');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-md mx-auto mt-10 text-center">
      <h2 className="text-2xl font-semibold mb-4">Live Weight</h2>

      <p className="text-4xl font-bold text-blue-600 mb-6">
        {weight ? `${weight.replace('S', '')} kg` : '---'}
      </p>

      <button
        onClick={handleConnect}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Connect to Scale
      </button>

      <p className="mt-4 text-sm text-gray-600">
        Status: {status === 'idle' ? 'Not connected' : status}
      </p>
    </div>
  );
}
