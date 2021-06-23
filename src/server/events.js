const process = require('process');
const config  = require('config');
const logger  = require('pino')();

const {
  killTimeout
} = config.get('killTimeout');

//On server internal error.
const onServerError = ()=>logger.error({message:`Server error`});

//On server start.
const onListen = (port)=>{

  logger.info('Dare NodeJS challenge');
  logger.info(`API REST - Running on port: ${port}`);
  
}

//When the process receive kill signal.
const onProcessKill = server =>{
  
  logger.info('Service termination signal received');
  
  setTimeout(() => {

    logger.info('Finishing server');
    server.close(()=>process.exit(0));

  }, killTimeout);

}

//When in the server happen a uncaugth exception.
const onException = err =>logger.error({message:err});

module.exports = {
  onListen,
  onProcessKill,
  onServerError,
  onException
};