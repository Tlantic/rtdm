/*
* A master detail view, utilizing a native table view component and platform-specific UI and navigation.
* A starting point for a navigation-based application with hierarchical data, or a stack of windows.
* Requires Titanium Mobile SDK 1.8.0+.
*
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*
*/

//bootstrap and check dependencies
if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
	    version = Ti.Platform.version,
	    height = Ti.Platform.displayCaps.platformHeight,
	    width = Ti.Platform.displayCaps.platformWidth;

	//considering tablets to have width over 720px and height over 600px - you can define your own
	function checkTablet() {
		var platform = Ti.Platform.osname;

		switch (platform) {
		case 'ipad':
			return true;
		case 'android':
			var psc = Ti.Platform.Android.physicalSizeCategory;
			var tiAndroid = Ti.Platform.Android;
			return psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_LARGE || psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_XLARGE;
		default:
			return Math.min(Ti.Platform.displayCaps.platformHeight, Ti.Platform.displayCaps.platformWidth) >= 400
		}
	}

	var isTablet = checkTablet();
	console.log(isTablet);

	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	} else {
		// iPhone and Mobile Web make use of the platform-specific navigation controller,
		// all other platforms follow a similar UI pattern
		if (osname === 'iphone') {
			Window = require('ui/handheld/ios/ApplicationWindow');
		} else if (osname == 'mobileweb') {
			Window = require('ui/handheld/mobileweb/ApplicationWindow');
		} else {
			//Window = require('ui/handheld/android/ApplicationWindow');
			Window = require('ui/handheld/android/AuthWindow');
		}
	}

	/************************/
	var helper = require('ui/common/Helper'),
		xhr = Titanium.Network.createHTTPClient();
	
	xhr.onerror = function(e) {
		helper.showMsg(e.error);
	};

	xhr.onload = function(e) {
		if (this.status == '200') {
			if (this.readyState == 4) {
				var response = JSON.parse(this.responseText);

				if (response.ok === true) {
					new Window().open();
				} else {
					helper.showMsg(response);
				}

			} else {
				helper.showMsg('HTTP Ready State != 4');
			}
		} else {
			helper.showMsg('HTTp Error Response Status Code = ' + this.status);
		}
	};
	xhr.open('GET', "https://tlanrtdm.herokuapp.com");
	xhr.send();

})();
