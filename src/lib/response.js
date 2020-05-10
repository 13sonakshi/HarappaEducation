class Response {
    constructor() {
        this.res = {};
    }

    setResponse(res) {
        this.res = res;
        return this;
    }

    created(data) {
        return this.res.status(201).json({success: true, data: data});
    }

    success(data, message, cart_count) {
        return this.res.status(200).json({success: true, message: message, data: data, cart_count: cart_count});
    }

    failure(data, message) {
        return this.res.status(200).json({success: false, message: message, data: data});
    }

    invalidRequest(message) {
        return this.res.status(400).json({success: false, message: message});
    }

    pageNotFound() {
        return this.res.status(404).json({success: false, message: 'Requested Page Not Found'});
    }

    authenticationFailed() {
        return this.res.status(401).json({success: false, message: 'Your login credentials are incorrect.'});
    }

    authorizationFailed() {
        return this.res.status(403).json({success: false, message: 'Your session has expired. Please login again to continue.'});
    }
    // tokenExpiryError() {
    //     return this.res.status(501).json({success: false, message: 'Your session has expired. Please login again to continue.'});
    // }

    validationError(data,message) {
        return this.res.status(422).json({success: false, message: message, data: data});
    }

   
    internalError(data, debugInfo) {
        if(process.env.debug === '1') {
            return this.res.status(500).json({success: false, message: 'Internal Error', debug: data});
        } else {
            return this.res.status(500).json({success: false, message: 'Internal Error', debug: data });
        }
    }
}

module.exports = new Response;