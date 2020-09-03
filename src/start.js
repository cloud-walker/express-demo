import express from "express";

// const port = 3000;

// app.use((req, res) => {
//   res.json({ message: "ciao" });
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

export const startServer = ({ port = process.env.PORT } = {}) => {
  const app = express();

  app.use("/api", getRoutes());

  app.use(errorMiddleware);

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${server.address().port}`);
      const originalClose = server.close.bind(server);
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };
      setupCloseOnExit(server);
      resolve(server);
    });
  });
};

startServer();
