'use client';

import { useLayoutEffect, useState } from 'react';

export default function BluetoothWeightReader() {
  const [weight, setWeight] = useState<number | null>(null);
  const [status, setStatus] = useState("Disconnected");

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
  const connectToScale2 = async () => {
    try {
      setStatus("Requesting device...");
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['0000181d-0000-1000-8000-00805f9b34fb'] }], // Weight Scale Service
        optionalServices: ['0000181d-0000-1000-8000-00805f9b34fb']
      });
  
      setStatus("Connecting...");
      const server = await device.gatt!.connect();
      
      // Correct Service UUID for Weight Scale
      const service = await server.getPrimaryService('0000181d-0000-1000-8000-00805f9b34fb');
      
      // Correct Characteristic UUID for Weight Measurement
      const characteristic = await service.getCharacteristic('00002a9d-0000-1000-8000-00805f9b34fb');
  
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const flags = value.getUint8(0);
        const rawWeight = value.getUint16(1, true); // Little-endian
        const weightKg = rawWeight / 200;
        setWeight(weightKg);
        setStatus("Weight received!");
      });
  
      await characteristic.startNotifications();
      setStatus("Connected. Waiting for weight...");
    } catch (error) {
      console.error("Bluetooth error:", error);
      setStatus("Error: " + (error as Error).message);
    }
  };
  

  const custome = async () => {

    // Filter on devices with the Arduino Uno USB Vendor/Product IDs.
    // const filters = [
    //   { usbVendorId: 0x2341, usbProductId: 0x0043 },
    //   { usbVendorId: 0x2341, usbProductId: 0x0001 }
    // ];

    // // Prompt user to select an Arduino Uno device.
    // const port = await navigator.serial.requestPort({ filters });

    // const { usbProductId, usbVendorId } = port.getInfo();
    // Prompt user to select any serial port.
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
    }
  }




  return (
    <div className="p-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={connectToScale}
      >
        Connect to BLE Scale
      </button>
      <p className="mt-2 text-gray-700">Status: {status}</p>
      {weight !== null && (
        <p className="mt-4 text-2xl font-bold">Weight: {weight.toFixed(2)} kg</p>
      )}

      <button className='bg-blue-600 text-white px-4 py-2 rounded' onClick={custome}>PORT TEST</button>
    </div>
  );
}
