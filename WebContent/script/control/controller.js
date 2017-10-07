/**
 * Controller
 * 
 * Object for connecting AJAX-service and EmoticonController.
 * 
 * 
 * @author Thomas Asheim Smedmann
 */

"use strict"

class Controller {
	
	constructor() {
		/* Public */
		
		
		/* Callbacks */
		
			
		/* Private */
		this._service = new EmoticonService();
		this._emoticonController = new EmoticonController();
	}
	
	start() {
		/* Connect callbacks */
		this._connectCallbacks();
		
		/* Connect to service */
		this._service.connect();
		
		/* Run EmoticonController */
		this._emoticonController.start();
		
	}
	
	_connectCallbacks() {
		
		/* from service to controller */
		this._service.getLogId = 
			this._emoticonController.getCurrentLogId.bind(this._emoticonController);
		
		this._service.responseReceived = 
			this._emoticonController.handleResponse.bind(this._emoticonController);
		
		this._service.periodicReceived = 
			this._emoticonController.handlePeriodic.bind(this._emoticonController);
		
		this._service.requestFailure = 
			this._emoticonController.handleFailure.bind(this._emoticonController);
		
		/* From controller to service */
		this._emoticonController.addEmoticon = 
			this._service.addEmoticon.bind(this._service);
		
		this._emoticonController.editEmoticon = 
			this._service.updateEmoticon.bind(this._service);
		
		this._emoticonController.deleteEmoticon = 
			this._service.deleteEmoticon.bind(this._service);
		
		this._emoticonController.stopPeriodicAJAX = 
			this._service.stopAJAXPeriodic.bind(this._service);
		
		this._emoticonController.startPeriodicAJAX = 
			this._service.startAJAXPeriodic.bind(this._service);	
	}
}