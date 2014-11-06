function Helper() {

	this.showMsg = function(m) {
		// Alert
		var alertBox = Ti.UI.createAlertDialog({
			title : "Important",
			message : m
		});
		alertBox.show();
	};
}


module.exports = new Helper();