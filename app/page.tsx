import React from 'react'
import BluetoothComponent from './_components/BluetoothComponent'
import WeightDisplay from './_components/WeightDisplay'
import TestPrint from './_components/TestPrint'
import { PrinterComponent } from './_components/Printer';
const labelData = {
  原料名: '在庫名1',
  原料S_N: '14LUNDC1B35BB62020250630224430-11',
  ベンダーLOT: '123',
  内容量: '1',
  使用期限: '2025/07/02',
  入荷日: '2025/07/01',
  qrData: '14LUNDC1B35BB62020250630224430-11' // or any string to encode in QR
};
function Home() {
  return (
    <div>
      {/* <BluetoothComponent/> */}
      {/* <WeightDisplay/> */}
      {/* <TestPrint labelData={labelData}/> */}
      <PrinterComponent/>
    </div>
  )
}

export default Home