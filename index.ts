import expressServer from './helper/express-server';


(async () => {
  try {
    await expressServer.init();
  } catch (error) {
    console.log(error);
  }
})()