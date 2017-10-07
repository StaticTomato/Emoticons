/**
 * Validator
 * 
 * Object for validating input and emoticons.
 * 
 * 
 * @author Thomas Asheim Smedmann
 */

"use strict"

class Validator {
	
	constructor() {
		/* Nothing to do */
	}
	
	static isValidNewEmoticon(emoticon) {
		if(emoticon.icon == null || emoticon.icon.length == 0) {
			return "Emoticon cannot be empty";
		} else if(emoticon.icon.length > 20) {
			return "Emoticon cannot exceed 20 characters";
		} else if(emoticon.description != null) {
			if(emoticon.description > 40) {
				return "Description cannot exceed 40 characters";
			}
		}
		return null;
	}
	
	static isValidEditedEmoticon(id,emoticon) { 
		if(this.isValidId(id) != null) {
			return "Emoticon has invalid id";
		} else if(emoticon.icon == null || emoticon.icon.length == 0) {
			return "Emoticon cannot be empty";
		} else if(emoticon.icon.length > 20) {
			return "Emoticon cannot exceed 20 characters";
		} else if(emoticon.description != null) {
			if(emoticon.description > 40) {
				return "Description cannot exceed 40 characters";
			}
		}
		return null;
	}
	
	static isValidId(id) {
		if(id == null || isNaN(id)) {
			return "Id must have a numeric value";
		} else if(parseInt(id,10) == NaN) {
			return "Id must be an integer";
		} else if(id < 0) {
			return "Id must be an positive integer";
		}
		return null;
	}
	
}