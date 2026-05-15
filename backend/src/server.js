import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`ERP backend слушает порт ${env.PORT} (0.0.0.0)`);
});

server.on('error', (err) => {
  console.error('Не удалось открыть порт (проверьте PORT):', err);
  process.exit(1);
});
