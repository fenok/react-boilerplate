import express from 'express';

export class Server {
  private express: express.Application;
  private config: any;
  private logger: any;

  constructor({ configBuilder, router, logger }) {
    this.config = configBuilder.getConfig('server');
    this.logger = logger;
    this.express = express();

    this.express.disable('x-powered-by');
    this.express.use(router);
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      const http = this.express.listen(this.config.port, () => {
        const { port } = http.address() as any;
        this.logger.info(`[pid ${process.pid}] Listening at port ${port}`);
        resolve();
      });
    });
  }
}