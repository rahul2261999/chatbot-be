
import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors'
import Io from '../socket/io';
import rag from '../llm/rag/rag';
import constant from '../constants/constant';

class ExpressServer {
  private static instance: ExpressServer;
  private app: express.Express;
  private port: number = constant.app.port;
  private httpServer: http.Server;
  private io?: Io;

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = Io.init(this.httpServer);
    this.initilizeMiddleware();
  }
  
  public static getInstance(): ExpressServer {
    if (!ExpressServer.instance) {
      ExpressServer.instance = new ExpressServer();
    }

    return ExpressServer.instance;
  }

  private initilizeMiddleware() {
    try {
      console.info("executing middleware");
      
      this.app.use(cors());
      this.app.use(express.json({}))

      console.info("execution completed -> middleware")
    } catch (error) {
      console.error(error);
    }
  }

  public async init() {
    this.httpServer.listen(this.port, async () => {
      console.info(`Server is running on port ${this.port}`);
      // const answer = await rag.askQuestion("the me about the Psoriasis?")
      // console.log(answer);

      // const answer2 = await rag.askQuestion("the me about the disease?")
      // console.log(answer2);

      // trainnDocument()
    });
  }

  public getHttpServer() {
    return this.httpServer;
  }

  public getIoServer() {
    return this.io;
  }
}

export default ExpressServer.getInstance();