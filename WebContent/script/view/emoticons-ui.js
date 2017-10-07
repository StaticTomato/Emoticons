/**
 * EmoticonsUI
 * 
 * Object for manipulating emoticons in the UI (creating, updating, removing).
 * 
 * 
 * @author Thomas Asheim Smedmann
 */

"use strict"

class EmoticonsUI {
	
	constructor() {
		/* Public */
		
		/* Callbacks to EmoticonController*/
		this.addEmoticon = null;
		this.editEmoticon = null;
		this.deleteEmoticon = null;
		this.startPeriodic = null;
		this.stopPeriodic = null;
		
		/* Private */
		this._deleteModal = null;
		this._editModal = null;
		this._container = null;
		this._infoBar = null;
		this._infoIcon = null;
		this._delInfo = null;
		this._editInfo = null;
		this._dEmo = null;
		this._eEmo = null;
		this._eDes = null;
		this._aEmo = null;
		this._aDes = null;
		
		this._selectedEmoticon = null;
		this._timer1 = null;
		this._timer2 = null;
	}
	
	connect() {
		/* Get elements */
		this._getElements();
		
		/* Connect callbacks */
		this._connectCallbacks();
		
	}
	
	createEmoticon(emoticon) {
		let emoCon = document.createElement("div");
		let emo = document.createElement("h2");
		let span = document.createElement("span");
		let delBtn = document.createElement("button");
		let editBtn = document.createElement("button");
		let copyBtn = document.createElement("button");
		delBtn.id = "delete" + emoticon.id; delBtn.title = "Delete";
		delBtn.innerHTML = "<i class='fa fa-trash-o'></i>";
		delBtn.addEventListener("click",this._deleteClicked.bind(this));
		editBtn.id = "edit" + emoticon.id; editBtn.title = "Edit";
		editBtn.innerHTML = "<i class='fa fa-pencil-square-o'></i>";
		editBtn.addEventListener("click",this._editClicked.bind(this));
		copyBtn.id = "copy" + emoticon.id; copyBtn.title = "Copy to clipboard";
		copyBtn.innerHTML = "<i class='fa fa-files-o'></i>";
		copyBtn.addEventListener("click",this._copyClicked.bind(this));
		span.className = "tooltipText";
		span.appendChild(delBtn); span.appendChild(editBtn); span.appendChild(copyBtn);
		emo.id = "emo" + emoticon.id; emo.title = emoticon.description;
		emo.textContent = emoticon.icon;
		emoCon.id = "emoCon" + emoticon.id;
		emoCon.className = "emoticonContainer tooltip w3-card-4";
		emoCon.appendChild(emo); emoCon.appendChild(span);
		this._container.insertBefore(emoCon,this._container.firstChild);
	}
	
	updateEmoticon(emoticon) {
		let emo = document.getElementById("emo"+ emoticon.id);
		emo.textContent = emoticon.icon;
		emo.title = emoticon.description;
	}
	
	removeEmoticon(id) {
		let emoCon = document.getElementById("emoCon"+ id);
		this._container.removeChild(emoCon);
	}
	
	closeDeleteModal() {
		this._delInfo.textContent = "";
		this._deleteModal.style.display="none";
		window.setTimeout(this.startPeriodic.bind(this),500);
	}
	
	closeEditModal() {
		this._editInfo.textContent = "";
		this._editModal.style.display="none";
		window.setTimeout(this.startPeriodic.bind(this),500);
	}
	
	clearAddInput() {
		this._aEmo.value = "";
		this._aDes.value = "";
	}
	
	showInfo(msg,status) {
		this._infoBar.textContent = msg;
		if(status >= 400) {
			this._infoIcon.className = "fa fa-exclamation";
			this._infoBar.className = "red";
		} else if(status >= 300) {
			this._infoIcon.className = "fa fa-info";
			this._infoBar.className = "yellow";
		} else if(status >= 200) {
			this._infoIcon.className = "fa fa-info";
			this._infoBar.className = "green";
		} else if(status >= 100) {
			this._infoIcon.className = "fa fa-info";
			this._infoBar.className = "info";
		} else {
			this._infoIcon.className = "fa fa-info";
			this._infoBar.className = "info";
		}
		this._triggerInfoBarFade();
	}
	
	showAddInfo(msg) {
		this._infoBar.textContent = msg;
		this._infoIcon.className = "fa fa-info";
		this._infoBar.className = "red";
		this._triggerInfoBarFade();
	}
	
	showDelInfo(msg) {
		this._delInfo.textContent = msg;
	}
	
	showEditInfo(msg) {
		this._editInfo.textContent = msg;
	}
	
	_addClicked() {
		this.stopPeriodic();
		let emoticon = new Emoticon(null,this._aEmo.value,this._aDes.value);
		if(typeof this.addEmoticon === "function") {
			this.addEmoticon(emoticon);
		}
		window.setTimeout(this.startPeriodic.bind(this),500);
	}
	
	_editClicked(e) {
		let id = e.target.id.replace("edit","");
		let emo = document.getElementById("emo" + id);
		this._eEmo.value = emo.textContent;
		this._eDes.value = emo.title;
		this._selectedEmoticon = id;
		this._editInfo.textvalue = "";
		this._editModal.style.display="block";
		this.stopPeriodic();
	}
	
	_deleteClicked(e) {
		let id = e.target.id.replace("delete","");
		let emo = document.getElementById("emo" + id);
		this._dEmo.textContent = emo.textContent;
		this._dEmo.title = emo.title;
		this._selectedEmoticon = id;
		this._delInfo.textvalue = "";
		this._deleteModal.style.display="block";
		this.stopPeriodic();
	}
	
	_copyClicked(e) {
		let id = e.target.id.replace("copy","");
		let icon = document.getElementById("emo" + id);
		let dummy = document.getElementById("copyField");
		dummy.value = icon.textContent;
		dummy.className = "visible";
		dummy.select();
		let result = document.execCommand("copy");
		dummy.className = "hidden";
		let msg = result ? "Emoticon successfully copied to clipboard" : "Failed to copy to clipboard";
		this.showInfo(msg);
	}
	
	_saveClicked() {
		let id = parseInt(this._selectedEmoticon,10);
		let emoticon = new Emoticon(null,this._eEmo.value,this._eDes.value);
		if(typeof this.editEmoticon == "function") {
			this.editEmoticon(id,emoticon);
		}
	}
	
	_yesClicked() {
		if(typeof this.deleteEmoticon === "function") {
			this.deleteEmoticon(parseInt(this._selectedEmoticon,10));
		}
	}
	
	_getElements() {
		this._deleteModal = document.getElementById("deleteModal");
		this._editModal = document.getElementById("editModal");
		this._container = document.getElementById("emoticons");
		this._infoBar = document.getElementById("infoBar");
		this._infoIcon = document.getElementById("infoIcon");
		this._delInfo = document.getElementById("delInfo");
		this._editInfo = document.getElementById("editInfo");
		this._dEmo = document.getElementById("dEmo");
		this._eEmo = document.getElementById("eEmo");
		this._eDes = document.getElementById("eDes");
		this._aEmo = document.getElementById("aEmo");
		this._aDes = document.getElementById("aDes");
	}
	
	_connectCallbacks() {
		document.getElementById("add").addEventListener("click",this._addClicked.bind(this));
		document.getElementById("save").addEventListener("click",this._saveClicked.bind(this));
		document.getElementById("yes").addEventListener("click",this._yesClicked.bind(this));
		document.getElementById("no").addEventListener("click",this.closeDeleteModal.bind(this));
		document.getElementById("exitDelete").addEventListener("click",this.closeDeleteModal.bind(this));
		document.getElementById("cancel").addEventListener("click",this.closeEditModal.bind(this));
		document.getElementById("exitEdit").addEventListener("click",this.closeEditModal.bind(this));
	}
	
	_triggerInfoBarFade() {
		window.clearTimeout(this._timer1);
		window.clearTimeout(this._timer2);
		this._infoBar.classList.remove("fadeIn","fadeOut");
		this._infoIcon.classList.remove("fadeIn","fadeOut");
		this._timer1 = window.setTimeout(() => {
			this._infoBar.classList.add("fadeIn");
			this._infoIcon.classList.add("fadeIn");
		},8000);
		this._timer2 = window.setTimeout(() => {
			this._infoBar.className = "info";
			this._infoIcon.className = "fa fa-info";
			this._infoBar.textContent = "No new info";
			this._infoBar.classList.add("fadeOut");
			this._infoIcon.classList.add("fadeOut");
		},11000);
	}
}