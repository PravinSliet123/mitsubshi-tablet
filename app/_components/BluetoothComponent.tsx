'use client';

import { useEffect, useLayoutEffect, useState } from 'react';

export default function BluetoothWeightReader() {
  const [weight, setWeight] = useState<number | any>(null);
  const [status, setStatus] = useState("Disconnected");
  const [weightValue, setWeightValue] = useState()
  const connectToScale = async () => {
    try {
      setStatus("Requesting device...");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['0000180d-0000-1000-8000-00805f9b34fb'], // Weight Scale Service
      });

      setStatus("Connecting...");

      const server = await device.gatt?.connect();
      console.log("🚀 ~ connectToScale ~ server:", server)
      const service = await server?.getPrimaryService("0000180d-0000-1000-8000-00805f9b34fb"); // Replace with the actual service UUID for your scale
      console.log("🚀 ~ connectToScale ~ service:", service)
      const characteristic = await service?.getCharacteristic('0000180d-0000-1000-8000-00805f9b34fb');
      console.log("🚀 ~ connectToScale ~ characteristic:", characteristic)

      characteristic?.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        console.log("🚀 ~ characteristic?.addEventListener ~ value:", value)
        const flags = value.getUint8(0);
        const rawWeight = value.getUint16(1, /*littleEndian=*/true); // in hectograms

        const weightKg = rawWeight / 200; // Standard conversion
        setWeight(weightKg);
        setStatus("Weight received!");
      });

      await characteristic?.startNotifications();
      setStatus("Connected. Waiting for weight...");
    } catch (error) {
      console.error("Bluetooth error:", error);
      setStatus("Error: " + (error as Error).message);
    }
  };

  const custome = async () => {
    //@ts-ignore
    const port = await navigator.serial.requestPort();

    // Wait for the serial port to open.
    await port.open({ baudRate: 9600 });
    const reader = port.readable.getReader();

    // Listen to data coming from the serial device.
    while (true) {
      const { value, done } = await reader.read();
      console.log("🚀 ~ custome ~ done:", done)
      console.log("🚀 ~ custome ~ value:", value)
      if (done) {
        // Allow the serial port to be closed later.
        reader.releaseLock();
        break;
      }

      // value is a Uint8Array.
      console.log(value);
      setWeightValue(value)
    }
  }

  useEffect(() => {
    if (weightValue) {
      const str = Buffer.from(weightValue).toString('utf8').trim();
      if (str.endsWith('S')) {
        const value = str.slice(0, -1);
        const weight = parseFloat(value);
        console.log(`Weight: ${weight} kg`);
        // TODO: Send to frontend / DB
        setWeight(weight)
      } else {
        console.log('Received partial/invalid:', str);
      }
    }
  }, [weightValue])




  return (
    <div className="p-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={connectToScale}
      >
        Connect to BLE Scale
      </button>
      <p className="mt-2 text-gray-700">Status: {status}</p>
      <button className='bg-blue-600 text-white px-4 py-2 rounded' onClick={custome}>PORT TEST</button>
      {weight !== null && (
        <p className="mt-4 text-2xl font-bold">Weight: {weight.toFixed(2)} kg</p>
      )}
    </div>
  );
}
