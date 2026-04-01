import app from './app';
import { initSchema } from './db/schema';

const PORT = 5000;

initSchema();

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
