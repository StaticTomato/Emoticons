/**
 * AJAXPeriodic
 * 
 * Object for use of AJAX and XMLHttpRequest to send and receive data
 * periodically.
 * 
 * Copied from Bjarte Kileng @ Bergen University College. Thanks!
 * 
 * NB! If start() and stop() is called multiple times in succession, 
 * it will result in multiple periodic requests.
 * 
 * use canBeStarted() to check if its safe to start the periodic calls again.
 * 
 * @author Thomas Asheim Smedmann
 */

"use strict";

class AJAXPeriodic {
    
	constructor(url,timeout) {
        
    	/* Public */
        

        // Callbacks
		// If set, getPathArray will be run to fetch the path AJAXPeriodic will
		// use to fetch the wanted resource from.
		this.getPathArray = null;
        // If set, getData will be run to fetch the data to send.
        this.getData = null;
        // If set, responseReceived will be run when data is received.
        this.responseReceived = null;
        // If set, requestFailure will be run if the request failed.
        this.requestFailure = null;
        
        /* Private */
        this._url = url;
        this._ajax = new AJAXConnection(url);
        this._timer = null;
        this._timeout = timeout || 5000;
        this._waiting = false;
        this._stopped = true;

        this._ajax.onSuccess = this._handleRespons.bind(this);
        this._ajax.onFail = this._handleFailure.bind(this);
    }

    start() {
    	this._stopped = false;
        let data = null;
        let pathArray = null;
        if (typeof this.getData === "function") {
            data = this.getData();
        }
        if (typeof this.getPathArray === "function") {
            pathArray = this.getPathArray();
        }
        this._waiting = true;
        if(!this._stopped) {
        	console.info("[AJAXPeriodic " + new Date() + "] Sending data");
        	this._ajax.get(pathArray,data);
        }
    }

    stop() {
        console.info('[AJAXPeriodic ' + new Date() + '] Cancelling periodic data')
        window.clearTimeout(this._timer);
        this._stopped = true;
    }

    get stopped() {
    	return this._stopped;
    }
    
    get waiting() {
    	return this._waiting;
    }
    
    _handleRespons(response) {
    	if(typeof this.responseReceived === "function") {
    		this.responseReceived(response);
    	}
        if(! this._stopped) {
        	this._timer = window.setTimeout(this.start.bind(this),this._timeout);
        }
        this._waiting = false;
    }
    
    _handleFailure(response) {
    	if(typeof this.requestFailure == "function") {
    		this.requestFailure(response);
    	}
    	this._stopped = true;
    	this._waiting = false;
    }
    
}
