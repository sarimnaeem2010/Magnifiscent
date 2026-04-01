// Hostinger entry point — starts the MagnifiScent API + frontend server
import('./artifacts/api-server/dist/index.mjs').catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
