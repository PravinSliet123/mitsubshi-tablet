import { render, Printer, Text } from 'react-thermal-printer';
import { connect } from 'node:net';

const data = await render(
  <Printer type="epson">
    <Text>Hello World</Text>
  </Printer>
);

const conn = connect({
  host: '192.168.0.99',
  port: 9100,
  timeout: 3000,
}, () => {
  conn.write(Buffer.from(data), () => {
    conn.destroy();
  });
});