var InstallSDK = require("./installsdk");

var SDKConfig = (function (){
	function SDKConfig() {
	}

	SDKConfig.prototype.execute = function() {
		InstallSDK.printAndroidSDKConfig();
	}

	return SDKConfig;
})();

module.exports = SDKConfig;