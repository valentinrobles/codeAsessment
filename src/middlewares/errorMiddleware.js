/**
 * Error handler middleware.
 * @param {object} error throwable error.
 * @param {object} req   request object.
 * @param {object} res   response object.
 * @param {object} next  next middleware.
 * @returns {Promise}.
 */
const errorHandler = (err, req, res, next) => {
    //Return bad gateway if the error come with a status code.
    const status = (err&&err.statusCode)?502:500;
  
    //Get detail.
    const message = (err&&err.message)?err.message:'Internal server Error';
    
    res.status(status).json({
      status,
      message
    });
  
}
  
module.exports = {
    errorHandler
};