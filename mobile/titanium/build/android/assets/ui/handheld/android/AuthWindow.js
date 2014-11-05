function AuthWindow() {
	//declare module dependencies
	var MasterView = require('ApplicationWindow');

	//create object instance
	var self = Ti.UI.createWindow({
		title : 'RTDM',
		exitOnClose : true,
		navBarHidden : false,
		layout : 'vertical',
		backgroundColor : '#123456'
	});

	var label = Ti.UI.createLabel({
		text : 'Login',
		color : '#fff',
		top : 10,
		textAlign : 'center',
		font : {
			fontWeight : 'bold',
			fontSize : 18
		},
		height : 'auto'
	});
	self.add(label);

	var textfield = Ti.UI.createTextField({
		height : 40,
		top : 10,
		width : 200,
		keyboardType : Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		hintText : 'username'
	});
	self.add(textfield);

	var button = Ti.UI.createButton({
		title : 'Entrar',
		top : 10,
		height : 40,
		width : 200
	});

	button.addEventListener('click', function() {
		// Check console
		Ti.API.info('User clicked the button ');

		// Alert
		var msgTitle = "Alert title";
		var msgText = "You clicked the button!";
		var alertBox = Ti.UI.createAlertDialog({
			title : msgTitle,
			message : msgText
		});
		alertBox.show();

	});
	self.add(button);

	//construct UI
	return self;
};

module.exports = AuthWindow;
