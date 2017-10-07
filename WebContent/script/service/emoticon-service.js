/**
 * EmoticonsService
 * 
 * Object for communication with the Emoticon Service at:
 * 
 * http://apps.statictomato.com/emoticonservice
 * 
 * @author Thomas Asheim Smedmann
 */

"use strict";

class EmoticonService {
	
	constructor(url) {
		
		/* Public */
		this.servicePath = url || "../emoticonservice/services";
		
		/* Callbacks */
		// If set, getLogId will be run to fetch the log Id EmoticonService will
		// use to fetch the lates Updates.
		this.getLogId = null;
        // If set, responseReceived will be run when data is received.
        this.responseReceived = null;
        // If set, periodicReceived will be run when periodic data is received.
        this.periodicReceived = null;
        // If set, requestFailure will be run if the request failed.
        this.requestFailure = null;
		
		/* Private */
		this._ajaxConnection = new AJAXConnection(this.servicePath);
		this._ajaxPeriodic = new AJAXPeriodic(this.servicePath);
	}
	
	connect() {
		/* Connect callbacks */
		this._connectCallbacks();
	}
	
	addEmoticon(emoticon) {
		this._ajaxConnection.post(["emoticons"],{"emoticon":emoticon});
	}
	
	deleteEmoticon(id) {
		this._ajaxConnection.del(["emoticons",id]);
	}
	
	updateEmoticon(id,emoticon) {
		this._ajaxConnection.put(["emoticons",id],{"emoticon":emoticon});
	}
	
	getEmoticon(id) {
		this._ajaxConnection.get(["emoticons",id]);
	}
	
	getUpdates(logId) {
		this._ajaxConnection.get(["updates",logId]);
	}
	
	startAJAXPeriodic() {
		if(this._ajaxPeriodic.stopped) {
			while(this._ajaxPeriodic.waiting) {/* Waiting... */}
			this._ajaxPeriodic.start();
		}
	}
	
	stopAJAXPeriodic() {
		this._ajaxPeriodic.stop();
	}
	
	_getServicePathArray() {
		if(typeof this.getLogId === "function") {
    		return ["updates",this.getLogId()];
    	}
		return null;
	}
	
	_connectCallbacks() {
		this._ajaxConnection.onSuccess = this.responseReceived.bind(this);
		this._ajaxConnection.onFail = this.requestFailure.bind(this);
		this._ajaxPeriodic.responseReceived = this.periodicReceived.bind(this);
		this._ajaxPeriodic.requestFailure = this.requestFailure.bind(this);
		this._ajaxPeriodic.getPathArray = this._getServicePathArray.bind(this);
	}

}