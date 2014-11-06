function AuthWindow() {
	//declare module dependencies
	var MasterView = require('ApplicationWindow');
	var helper = require('ui/common/Helper');

	//create object instance
	var self = Ti.UI.createWindow({
		title : 'RTDM',
		exitOnClose : true,
		navBarHidden : false,
		layout : 'vertical',
		backgroundColor : '#362372'
	});

	var logo = Ti.UI.createImageView({
		image : Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'logo.jpg')
	});
	self.add(logo);

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

	// entrar
	button.addEventListener('click', function() {
		helper.showMsg('teste');
	});
	self.add(button);

	//construct UI
	return self;
};

module.exports = AuthWindow; 