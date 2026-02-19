import { app, dbReady } from "./app.js";
const PORT = 3001;
dbReady
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server started on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize DB", error);
    process.exit(1);
  });
