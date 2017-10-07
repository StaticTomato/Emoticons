/**
 * AJAXConnection
 * 
 * Object for use of AJAX and XMLHttpRequest to send and receive data.
 * 
 * Copied from Bjarte Kileng @ Bergen University College. Thanks!
 * 
 * @author Thomas Asheim Smedmann
 */

"use strict";

class AJAXConnection {
    
	constructor(url){
        
    	/* Private */
    	this._url = url;
    	
    	/* Callbacks */
        this.onSuccess = null;
        this.onFail = null;
    }

    get(pathArray,data) {
        let xmlhttprequest = new XMLHttpRequest();

        // If given, add path to the URL.
        let url = this._url + this._convertToPath(pathArray);

        // If given, add GET parameters.
        if(data != null) {
        	url += "?" + this._formatData(data);
        }

        // Open request, and add event listeners.
        xmlhttprequest.open('GET', url, true);
        xmlhttprequest.addEventListener("load",this._requestSucceseeded.bind(this),true);
        xmlhttprequest.addEventListener("error",this._requestFailed.bind(this),true);

        // Sending request
        xmlhttprequest.send(null);
    }

    del(pathArray) {
        let xmlhttprequest = new XMLHttpRequest();

        // If given, add path to the URL.
        let url = this._url + this._convertToPath(pathArray);

        // Open request, and add event listeners.
        xmlhttprequest.open('DELETE', url, true);
        xmlhttprequest.addEventListener("load",this._requestSucceseeded.bind(this),true);
        xmlhttprequest.addEventListener("error",this._requestFailed.bind(this),true);

        // Sending request
        xmlhttprequest.send(null);
    }

    put(pathArray,data) {
        let xmlhttprequest = new XMLHttpRequest();

        // If given, add path to the URL.
        let url = this._url + this._convertToPath(pathArray);

        // Open request, and add event listeners.
        xmlhttprequest.open('PUT', url, true);
        xmlhttprequest.addEventListener("load",this._requestSucceseeded.bind(this),true);
        xmlhttprequest.addEventListener("error",this._requestFailed.bind(this),true);

        // Must specify document type with PUT data
        xmlhttprequest.setRequestHeader("Content-Type","application/json; charset=utf-8");

        // Sending request
        xmlhttprequest.send(JSON.stringify(data));
    }

    post(pathArray,data) {
        let xmlhttprequest = new XMLHttpRequest();

        // If given, add path to the URL.
        let url = this._url + this._convertToPath(pathArray);

        // Open request, and add event listeners.
        xmlhttprequest.open('POST', url, true);
        xmlhttprequest.addEventListener("load",this._requestSucceseeded.bind(this),true);
        xmlhttprequest.addEventListener("error",this._requestFailed.bind(this),true);

        // Must specify document type with POST data
        xmlhttprequest.setRequestHeader("Content-Type","application/json; charset=utf-8");

        // Sending request
        xmlhttprequest.send(JSON.stringify(data));
    }


    _requestSucceseeded(e) {
        let xmlhttprequest = e.target; // The XMLHttpRequest instance
        if (typeof this.onSuccess === "function") {
        	this.onSuccess(xmlhttprequest);
        }
    }
    
    _requestFailed(e) {
    	let xmlhttprequest = e.target; // The XMLHttpRequest instance
    	if(typeof this.onFail === "function") {
    		this.onFail(xmlhttprequest);
    	}
    }

    _formatData(dataObject) {
        let dataString="";
        for (let property in dataObject) {
            dataString += encodeURIComponent(property) + 
            "=" + encodeURIComponent(dataObject[property]) + "&";
        }
        dataString = dataString.substring(0,dataString.length-1);
        return dataString;
    }

    _convertToPath(pathArray) {
        let path = "";
        if (Array.isArray(pathArray)) {
            pathArray.forEach((part) => {path += "/" + part});
        }
        return path;
    }
}