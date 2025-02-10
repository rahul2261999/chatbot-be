import expressServer from './helper/express-server';
import loggerService from './utils/logger/logger.service';


(async () => {
  try {
    await expressServer.init();
  } catch (error) {
   loggerService.error(null, { error })
  }
})()