
/**
 * Error Controller
 */
ErrorController = function() {
};

/**
 * Application-specific return object for all errors
 * @param  {string} message
 * @return {Object}
 */
ErrorController.envelope = function(message) {
    return {
        success: false,
        error: {
            message: message ? message : ''
        }
    };
};

/**
 * Returns error message specific to missing req.params
 * @param  {string} names
 * @return {Object}
 */
ErrorController.missingParameters = function(names) {
    return this.envelope('Missing request parameters (req.params): ' + names);
};

/**
 * Returns error message specific to missing form data
 * @param  {string} names
 * @return {Object}
 */
ErrorController.missingFormData = function(names) {
    return this.envelope('Missing formdata values (req.body): ' + names);
};

/**
 * Returns general error message
 * @param  {string} error
 * @return {Object}
 */
ErrorController.error = function(error) {
    return this.envelope(error);
};

module.exports = ErrorController;
