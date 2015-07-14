ErrorController = function() {
};

ErrorController.envelope = function(message) {
	return { 
		success: false,
		error: {
			message: message ? message : ''
		}
	};
};

ErrorController.missingParameters = function(names) {
	return this.envelope('Missing request parameters (req.params): ' + names);
};

ErrorController.missingFormData = function(names) {
	return this.envelope('Missing formdata values (req.body): ' + names);
};

ErrorController.error = function(error) {
	return this.envelope(error);
};

module.exports = ErrorController;