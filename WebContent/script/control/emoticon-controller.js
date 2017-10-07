/**
 * EmoticonController
 * 
 * Object for handling events from the UI.
 *  
 * 
 * @author Thomas Asheim Smedmann
 */

"use strict"

class EmoticonController {
	
	constructor() {
		/* Public */
		
		/* Callbacks to Controller */
		this.addEmoticon = null;
		this.editEmoticon = null;
		this.deleteEmoticon = null;
		this.stopPeriodicAJAX = null;
		this.startPeriodicAJAX = null;
		
		/* Private */
		this._currentLogId = -1;
		this._lastAction = null;
		
		this._emoticonsUI = new EmoticonsUI();
	}
	
	start() {
		/* Connect callbacks to UI*/
		this._connectCallbacks();
		
		/* Connect EmoticonUI */
		this._emoticonsUI.connect();
		
		/* Start periodic updates */
		this._startPeriodic();
	}
	
	
	
	handleResponse(response) {
		//TODO: Sjekk stauskode for kva 'action'.
		let status = response.status;
		let msg = "";
		switch(this._lastAction) {
		case "add":
			msg = "Emoticon was successfully added!";
			break;
		case "edit":
			msg = "Emoticon was successfully updated!";
			break;
		case "delete":
			msg = "Emoticon was successfully deletet!";
			break;
		default:
			/* Should not end here */
		}
		
		this._emoticonsUI.showInfo(msg,status);
	}
	
	handlePeriodic(response) {
		let text = response.responseText;
		let updates = null;
		if(text.length > 0) {
			try {
				updates = JSON.parse(text).updates;
				this._manageUpdates(updates);
			} catch(e) {
				let msg = "Could not parse updates";
				this._emoticonsUI.showInfo(msg);
			}	
		}
	}
	
	handleFailure(response) {
		//TODO: Sjekk om detter er ok.
		this._emoticonsUI.showInfo(response.statusText,response.status);
	}
	
	getCurrentLogId() {
		return this._currentLogId;
	}
	
	_manageUpdates(updates) {
		this._currentLogId = updates.logId;
		/* Deleted emoticons */
		if (!(typeof updates.deletedEmoticons  === "undefined")) {
            let emoticons = updates.deletedEmoticons;
            if (!(Array.isArray(emoticons))) {
            	emoticons = [emoticons];
            }
            emoticons.forEach((emoticon) => {this._emoticonsUI.removeEmoticon(emoticon)});
        }
		/* Updated emoticons */
		if (!(typeof updates.updatedEmoticons  === "undefined")) {
            let emoticons = updates.updatedEmoticons;
            if (!(Array.isArray(emoticons))) {
            	emoticons = [emoticons];
            }
            emoticons.forEach((emoticon) => {this._emoticonsUI.updateEmoticon(emoticon)});
        }
		/* New emoticons */
		if (!(typeof updates.newEmoticons  === "undefined")) {
            let emoticons = updates.newEmoticons;
            if (!(Array.isArray(emoticons))) {
            	emoticons = [emoticons];
            }
            emoticons.sort(function(a,b) {
            	return a.id - b.id; // Highest id first.
            });
            emoticons.forEach((emoticon) => {this._emoticonsUI.createEmoticon(emoticon)})
        }
	}
	
	_addEmoticon(emoticon) {
		let msg = Validator.isValidNewEmoticon(emoticon);
		if(msg != null) {
			this._emoticonsUI.showAddInfo(msg);
			return;
		}
		if(typeof this.addEmoticon === "function") {
			this.addEmoticon(emoticon);
			this._lastAction = "add";
		}
		this._emoticonsUI.clearAddInput();
		this._emoticonsUI.showInfo("Adding emoticon...");
	}
	
	_editEmoticon(id,emoticon) {
		let msg = Validator.isValidEditedEmoticon(id,emoticon);
		if(msg != null) {
			this._emoticonsUI.showEditInfo(msg);
			return;
		}
		if(typeof this.editEmoticon === "function") {
			this.editEmoticon(id,emoticon);
			this._lastAction = "edit";
		}
		this._emoticonsUI.closeEditModal();
		this._emoticonsUI.showInfo("Updating emoticon...");
	}
	
	_deleteEmoticon(id) {
		let msg = Validator.isValidId(id);
		if(msg != null) {
			this._emoticonsUI.showDelInfo(msg);
			return;
		}
		if(typeof this.deleteEmoticon === "function") {
			this.deleteEmoticon(id);
			this._lastAction = "delete";
		}
		this._emoticonsUI.closeDeleteModal();
		this._emoticonsUI.showInfo("Deleting emoticon..."); 
	}
	
	_startPeriodic() {
		if(typeof this.startPeriodicAJAX === "function") {
			this.startPeriodicAJAX();
		}
	}
	
	_stopPeriodic() {
		if(typeof this.stopPeriodicAJAX === "function") {
			this.stopPeriodicAJAX();
		}
	}
	
	_connectCallbacks() {
		this._emoticonsUI.addEmoticon = this._addEmoticon.bind(this);
		this._emoticonsUI.editEmoticon = this._editEmoticon.bind(this);
		this._emoticonsUI.deleteEmoticon = this._deleteEmoticon.bind(this);
		this._emoticonsUI.startPeriodic = this._startPeriodic.bind(this);
		this._emoticonsUI.stopPeriodic = this._stopPeriodic.bind(this);
	}
	
}