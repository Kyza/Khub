//META{"name":"CustomDiscordIcon","website":"https://khub.kyza.gq/?plugin=CustomDiscordIcon","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/CustomDiscordIcon/CustomDiscordIcon.plugin.js"}*//

var CustomDiscordIcon = function() {};

var updateInterval;
var iconSetInterval;

const {
  remote
} = require('electron');
const win = remote.getCurrentWindow();
var fs = require("fs");
var request = require('request');
var path = require('path');
var configPath = path.join(__dirname, "CustomDiscordIcon.config.json");
var iconPath = path.join(__dirname, "icon.png");

CustomDiscordIcon.prototype.start = function() {
  /* Start Libraries */

  let libraryScript = document.getElementById("ZLibraryScript");
  if (!libraryScript || !window.ZLibrary) {
    if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
    libraryScript = document.createElement("script");
    libraryScript.setAttribute("type", "text/javascript");
    libraryScript.setAttribute("src", "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js");
    libraryScript.setAttribute("id", "ZLibraryScript");
    document.head.appendChild(libraryScript);
  }

  iconSetInterval = setInterval(() => {
		setIcon();
  }, 1000);
};


var download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function setIcon() {
	if (loadSettings() != undefined) {
		// TODO Make the plugin get the current guild icon, save it, and set it as the taskbar icon.
		if (loadSettings().useGuildIcons) {
			// If the user is in a guild...
			if (ZLibrary.DiscordAPI.currentGuild && ZLibrary.DiscordAPI.currentGuild.icon) {
				// Save the guild icon and set it as the icon.
				var imageURL = ("https://cdn.discordapp.com/icons/" + ZLibrary.DiscordAPI.currentGuild.id + "/" + ZLibrary.DiscordAPI.currentGuild.icon + ".png");
				download(imageURL, iconPath, function() {
					win.setIcon(iconPath);
				});
			} else {
				// The user isn't in a guild, so see if they are in a DM.
				// If the user is in a DM, save the user's icon and set it as the icon.
				if (ZLibrary.DiscordAPI.currentChannel) {
					try {
						var userAvatarURL = ZLibrary.DiscordAPI.currentChannel.recipient.avatarUrl;
						download(userAvatarURL, iconPath, function() {
							win.setIcon(iconPath);
						});
					} catch (e) {
						// So the user is either not in a guild or DM.
						// It's also possible that the guild or user does not have an icon.
						// In this case we just set the icon to whatever the user specified in their settings.
						try {
							win.setIcon(loadSettings().customImagePath);
						} catch (e2) {
							// It's also possible that the user hasn't set a default icon as well.
							console.error(e2);
						}
					}
				} else {
					win.setIcon(loadSettings().customImagePath);
				}
			}
		} else {
			win.setIcon(loadSettings().customImagePath);
		}
	}
}

CustomDiscordIcon.prototype.load = function() {
  ZLibrary.PluginUpdater.checkForUpdate("CustomDiscordIcon", this.getVersion(), "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/CustomDiscordIcon/CustomDiscordIcon.plugin.js");
};

CustomDiscordIcon.prototype.unload = function() {};

CustomDiscordIcon.prototype.stop = function() {
  clearInterval(updateInterval);
  clearInterval(iconSetInterval);
};

CustomDiscordIcon.prototype.onMessage = function() {};

CustomDiscordIcon.prototype.onSwitch = function() {
	setIcon();
};

CustomDiscordIcon.prototype.observer = function(e) {
  //raw MutationObserver event for each mutation
};

CustomDiscordIcon.prototype.getSettingsPanel = function() {
  var settingsWrapper = document.createElement("div");
  settingsWrapper.setAttribute("style", "width; 100%; height: auto;");


  // Here is the toggle for using the guild and DM icons.
  // Checked   = valueChecked-m-4IJZ
  // Unchecked = valueUnchecked-2lU_20
  var useGuildIcon = document.createElement("div");
  useGuildIcon.setAttribute("id", "useGuildIcon");

  var useGuildIconText = document.createElement("div");
  useGuildIconText.setAttribute("id", "useGuildIconText");

  var useGuildIconInput = document.createElement("input");
  useGuildIconInput.setAttribute("id", "useGuildIconInput");

  useGuildIcon.setAttribute("class", "flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueUnchecked-2lU_20 value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
  useGuildIcon.setAttribute("tabindex", "0");
  useGuildIcon.setAttribute("style", "flex: 0 0 auto; width: 250px; margin-bottom: 10px;");
  useGuildIcon.onclick = () => {
    if (useGuildIcon.getAttribute("class") == "flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX") {
      useGuildIcon.setAttribute("class", "flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueUnchecked-2lU_20 value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
      useGuildIconInput.setAttribute("checked", "false");
    } else {
      useGuildIcon.setAttribute("class", "flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
      useGuildIconInput.setAttribute("checked", "true");
    }
    saveSettings();
  };
  // Make sure that the checkbox is set to the correct value when it is created.
  if (loadSettings().useGuildIcons) {
		useGuildIcon.setAttribute("class", "flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
		useGuildIconInput.setAttribute("checked", "true");
  } else {
		useGuildIcon.setAttribute("class", "flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueUnchecked-2lU_20 value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
		useGuildIconInput.setAttribute("checked", "false");
	}

  useGuildIconText.innerHTML = "Use Guild & DM Icons";
  useGuildIconText.setAttribute("style", "position: absolute; text-align: center; width: 100%; height: 100%; line-height: 22.5px;");
  useGuildIconInput.setAttribute("class", "checkboxEnabled-CtinEn checkbox-2tyjJg da-checkboxEnabled da-checkbox");
  useGuildIconInput.setAttribute("type", "checkbox");
  useGuildIconInput.setAttribute("tabindex", "-1");
  useGuildIconInput.setAttribute("checked", "false");
  useGuildIconInput.setAttribute("style", "margin-left: auto; margin-right: auto;");
  useGuildIcon.appendChild(useGuildIconText);
  useGuildIcon.appendChild(useGuildIconInput);



  var iconPath = document.createElement("input");
  iconPath.setAttribute("id", "custom-icon-path");
  iconPath.setAttribute("placeholder", "Enter the path to the image.");
  iconPath.setAttribute("type", "text");
  iconPath.setAttribute("style", "width: 100%; height: 30px; border-width: 0px; border-radius: 10px; background-color: rgba(255, 255, 255, 0.7); padding-left: 10px; margin-bottom: 10px;");

  var errorHTML = "<br>Your image must use a standard format such as <strong>PNG or JPG</strong>.<br>Animated GIFs are not supported and never will be.<br>Your image can't be a URL to something online, it has to be saved somewhere.";
  iconPath.oninput = () => {
    saveSettings();

    try {
      const win = remote.getCurrentWindow();
      win.setIcon(document.getElementById("custom-icon-path").value);
      removeError();
    } catch (e) {
      settingsWrapper.appendChild(createError(errorHTML));
    }
  };

  var title = document.createElement("h1");
  title.setAttribute("style", "font-size: 1.5em; margin-bottom: 20px;");
  title.innerHTML = `<strong>CustomDiscordIcon Settings</strong>`;
  settingsWrapper.appendChild(title);

  settingsWrapper.appendChild(useGuildIcon);
  settingsWrapper.appendChild(iconPath);
  iconPath.value = (loadSettings() == undefined ? "" : loadSettings().customImagePath);

  // Try setting the icon right away.
  setTimeout(() => {
    try {
      const {
        remote
      } = require('electron');
      const win = remote.getCurrentWindow();
      win.setIcon(document.getElementById("custom-icon-path").value);
      removeError();
    } catch (e) {
      settingsWrapper.appendChild(createError(errorHTML));
    }
  }, 100);

  BdApi.showToast("CustomDiscordIcon: Your settings will be saved automatically.", {});

  return settingsWrapper;
};

function createError(errorHTML) {
  if (document.getElementById("custom-icon-error")) {
    document.getElementById("custom-icon-error").remove();
  }
  var error = document.createElement("div");
  error.setAttribute("id", "custom-icon-error");
  error.setAttribute("style", "color: red;");
  error.innerHTML = errorHTML;
  return error;
}

function removeError() {
  if (document.getElementById("custom-icon-error")) {
    document.getElementById("custom-icon-error").remove();
  }
}



function createSettingsFile() {
  var defaultStructure = {
    useGuildIcons: false,
    customImagePath: ""
  };
  fs.writeFile(configPath, JSON.stringify(defaultStructure, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }
    return loadSettings();
  });
}

function loadSettings() {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath));
  } else {
    return createSettingsFile();
  }
}

function saveSettings() {
  fs.writeFile(configPath, JSON.stringify({
    useGuildIcons: (document.getElementById("useGuildIconInput").getAttribute("checked") == "true" ? true : false),
    customImagePath: document.getElementById("custom-icon-path").value
  }, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }
  });
}


CustomDiscordIcon.prototype.getName = function() {
  return "CustomDiscordIcon";
};

CustomDiscordIcon.prototype.getDescription = function() {
  return "This BetterDiscord plugin allows you to change Discord's icon in the taskbar.";
};

CustomDiscordIcon.prototype.getVersion = function() {
  return "1.1.6";
};

CustomDiscordIcon.prototype.getAuthor = function() {
  return "Kyza#9994";
};
