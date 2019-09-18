//META{"name":"SafeEmbedGenerator","website":"https://khub.kyza.gq/?plugin=SafeEmbedGenerator","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/SafeEmbedGenerator/SafeEmbedGenerator.plugin.js"}*//

/*@cc_on
@if (@_jscript)

	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/
var SafeEmbedGenerator = (() => {
	const config = {
		"info": {
			"name": "SafeEmbedGenerator",
			"authors": [{
				"name": "Kyza",
				"discord_id": "220584715265114113",
				"github_username": "KyzaGitHub"
			}],
			"version": "1.3.4",
			"description": "Adds a button which allows you to create non-bannable embeds with ease.",
			"website": "https://khub.kyza.gq/?plugin=SafeEmbedGenerator",
			"github_raw": "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/SafeEmbedGenerator/SafeEmbedGenerator.plugin.js"
		},
		"changelog": [
			// {
			// 	"title": "New Stuff",
			// 	"items": ["Changed the embed API to my own.", "Added this changelog."]
			// }
			// ,
			// {
			// 	"title": "Bugs Squashed",
			// 	"type": "fixed",
			// 	"items": ["Fixed the visuals for the image type checkbox."]
			// }
			// ,
			// {
			// 	"title": "Improvements",
			// 	"type": "improved",
			// 	"items": ["Rewrote the plugin to prepare for the BBD rewrite/BDv2."]
			// }
			// ,
			// {
			// 	"title": "In Progress",
			// 	"type": "progress",
			// 	"items": ["Adding a recent embeds list for quick access."]
			// }
		],
		"main": "index.js"
	};

	return !global.ZeresPluginLibrary ? class {
		constructor() {
			this._config = config;
		}
		getName() {
			return config.info.name;
		}
		getAuthor() {
			return config.info.authors.map(a => a.name).join(", ");
		}
		getDescription() {
			return config.info.description;
		}
		getVersion() {
			return config.info.version;
		}
		load() {
			let libraryScript = document.getElementById("ZLibraryScript");
			if (!libraryScript || !window.ZLibrary) {
				if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
				libraryScript = document.createElement("script");
				libraryScript.setAttribute("type", "text/javascript");
				libraryScript.setAttribute("src", "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js");
				libraryScript.setAttribute("id", "ZLibraryScript");
				document.head.appendChild(libraryScript);
			}
		}
		start() {}
		stop() {}
	} : (([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
			const { DiscordModules, Logger, Patcher, WebpackModules, PluginUpdater, PluginUtilities, DiscordAPI } = Api;

			const { MessageStore, UserStore, ImageResolver, ChannelStore, Dispatcher } = DiscordModules;

			var embedOpen = false;
			var recentEmbeds = [];

			var updateInterval;
			var makeSureClosedInterval;

			var popupWrapperWidth = 320;
			var popupWrapperHeight = 620;

			var oldImageUrl;
			var oldImageWidth = -1;
			var oldImageHeight = -1;

			var oldDescription = "";
			var oldProviderName = "";
			var disabledDescription = "You must have an author name to use the description or provider name with image banner mode on.";
			var disabledProviderName = "Read the description box.";

			return class SafeEmbedGenerator extends Plugin {

				onStart() {
					/* Start Libraries */

					updateInterval = setInterval(() => {
						PluginUpdater.checkForUpdate("SafeEmbedGenerator", this.getVersion(), "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/SafeEmbedGenerator/SafeEmbedGenerator.plugin.js");
					}, 5000);

					makeSureClosedInterval = setInterval(() => {
						if (!embedOpen) {
							this.closeEmbedPopup();
						}
					}, 1000);

					this.addButton();

					// loadRecentEmbeds();
				}

				onStop() {
					clearInterval(updateInterval);
					clearInterval(makeSureClosedInterval);
					this.removeButton();
				}


				loadRecentEmbeds() {
					try {
						// Load the recent embeds.
						var pluginsFolder = PluginUtilities.getBDFolder("plugins");

						var fs = require("fs");
						recentEmbeds = JSON.parse(fs.readFileSync(pluginsFolder + "/SafeEmbedGenerator.recentEmbeds.json"));
					} catch (e) {
						recentEmbeds = [];
					}
				}

				addButton() {
					try {
						var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
						var channelObject = DiscordAPI.Channel.fromId(channelId);
						if (!channelObject) return;
						var channel = DiscordAPI.Channel.from(channelObject);
						var permissions = channel.discordObject.permissions;

						// Only add the button if the user has permissions to send messages and embed links.
						if (this.isAllowed() && (this.hasPermission("textEmbedLinks") && this.hasPermission("textSendMessages")) || channel.type != "GUILD_TEXT") {
							if (document.getElementsByClassName("embed-button-wrapper").length == 0) {
								var daButtons = document.getElementsByClassName("buttons-205you")[0];
								var embedButton = document.createElement("button");
								embedButton.setAttribute("type", "button");
								embedButton.setAttribute("class", "buttonWrapper-1ZmCpA da-buttonWrapper button-38aScr da-button lookBlank-3eh9lL da-lookBlank colorBrand-3pXr91 da-colorBrand grow-q77ONN da-grow normal embed-button-wrapper");

								var embedButtonInner = document.createElement("div");
								embedButtonInner.setAttribute("class", "contents-18-Yxp da-contents button-3AYNKb da-button button-2vd_v_ da-button embed-button-inner");

								var embedButtonIcon = document.createElement("img");
								//version="1.1" xmlns="http://www.w3.org/2000/svg" class="icon-3D60ES da-icon" viewBox="0 0 22 22" fill="currentColor"
								embedButtonIcon.setAttribute("src", "https://image.flaticon.com/icons/svg/25/25463.svg");
								embedButtonIcon.setAttribute("class", "icon-3D60ES da-icon");
								embedButtonIcon.setAttribute("style", "filter: invert(70%) !important;");
								embedButtonIcon.setAttribute("width", "22");
								embedButtonIcon.setAttribute("height", "22");

								embedButtonIcon.onmouseover = () => {
									embedButtonIcon.setAttribute("style", "filter: invert(100%) !important;");
								};
								embedButtonIcon.onmouseout = () => {
									embedButtonIcon.setAttribute("style", "filter: invert(70%) !important;");
								};

								embedButtonInner.appendChild(embedButtonIcon);
								embedButton.appendChild(embedButtonInner);
								daButtons.insertBefore(embedButton, daButtons.firstChild);

								embedButton.onclick = () => {
									var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
									var channel = DiscordAPI.Channel.from(DiscordAPI.Channel.fromId(channelId));

									// Only send the embed if the user has permissions to embed links.
									if (this.hasPermission("textEmbedLinks") || channel.type != "GUILD_TEXT") {
										this.openEmbedPopup();
									} else {
										BdApi.alert("SafeEmbedGenerator", `You do not have permissions to send embedded links in this channel.\n\nThis is not a problem with the plugin, it is a server setting.`);
									}
								};
							}
						} else {
							this.removeButton();
						}
					} catch (e) {
						console.log(e);
					}
				}

				isAllowed() {
					// Must be one of the following requirements.
					// Be myself.
					// Have any role in the BetterDiscord servers.

					var guildId = window.location.toString().split("/")[window.location.toString().split("/").length - 2];
					var betterDiscordServer1;
					try {
						betterDiscordServer1 = DiscordAPI.Guild.fromId("86004744966914048")
					} catch (e) {}
					var betterDiscordServer2;
					try {
						betterDiscordServer2 = DiscordAPI.Guild.fromId("86004744966914048")
					} catch (e) {}

					if (!betterDiscordServer1 || !betterDiscordServer2) {
						return true;
					}

					var currentUser1 = betterDiscordServer1.currentUser;
					var currentUser2 = betterDiscordServer2.currentUser;

					if (['86004744966914048','280806472928198656'].includes(guildId.toString())) {
						if (!betterDiscordServer1) {
							if (currentUser2.userId == "220584715265114113") {
								// The user is Kyza, return true right away.
								return true;
							}

							if (currentUser2.roles.length > 0) {
								// The user is in a BetterDiscord server but has a role.
								return true;
							} else {
								// The user is in a BetterDiscord server but does not have a role.
								return false;
							}
						} else if (!betterDiscordServer2) {
							if (currentUser1.userId == "220584715265114113") {
								// The user is Kyza, return true right away.
								return true;
							}

							if (currentUser1.roles.length > 0) {
								// The user is in a BetterDiscord server but has a role.
								return true;
							} else {
								// The user is in a BetterDiscord server but does not have a role.
								return false;
							}
						} else {
							if (currentUser1.userId == "220584715265114113") {
								// The user is Kyza, return true right away.
								return true;
							}

							if (currentUser1.roles.length > 0 || currentUser2.roles.length > 0) {
								// The user is in a BetterDiscord server but has a role.
								return true;
							} else {
								// The user is in a BetterDiscord server but does not have a role.
								return false;
							}
						}
					}

					// The user doesn't have any of the BetterDiscord servers selected, so return true.
					return true;
				}

				removeButton() {
					if (document.getElementsByClassName("embed-button-wrapper").length > 0) {
						document.getElementsByClassName("embed-button-wrapper")[0].remove();
					}
				}

				sendEmbed(providerName, providerUrl, authorName, authorUrl, title, description, image, imageType, color) {
					var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
					var channel = DiscordAPI.Channel.from(DiscordAPI.Channel.fromId(channelId));

					// Only send the embed if the user has permissions to embed links.
					if (this.isAllowed() && this.hasPermission("textEmbedLinks") || channel.type != "GUILD_TEXT") {
						const obj = {};
						obj.providerName = providerName;
						obj.providerUrl = providerUrl; // The link on the Provider Name.
						obj.authorName = authorName + (imageType == "true" ? " " : "");
						obj.authorUrl = authorUrl; // The link on the Author Name.
						obj.title = title;
						obj.description = description;
						obj.banner = (imageType == "true" ? true : false); // Photo is a banner, nothing is a small image on the right.
						obj.image = image; // The image displayed on the right.
						obj.color = color; // The color on the left of the embed.

						var request = require("request");

						// Everything was successful, so add the embed to the recent embeds.
						recentEmbeds.unshift(obj);
						// Save the recent embeds.
						var pluginsFolder = PluginUtilities.getBDFolder("plugins");

						// var fs = require("fs");
						// fs.writeFile(pluginsFolder + "/SafeEmbedGenerator.recentEmbeds.json", JSON.stringify(recentEmbeds, null, 2), function(err) {
						//   if (err) {
						//     console.log(err);
						//   }
						// });

						request({
							url: "https://discord-embed-api.herokuapp.com/create/",
							method: "POST",
							json: obj
						}, (err, res, body) => {
							if (err) {
								console.error(err);
								return;
							}
							console.log(body);
							DiscordAPI.Channel.fromId(channelId).sendMessage(`https://discord-embed-api.herokuapp.com/embed/${body.id}`, true);
						});
					} else {
						BdApi.alert("SafeEmbedGenerator", `You do not have permissions to send embedded links in this channel.\n\nBecause of this your message was not sent in order to prevent the embarrassment of 1,000 deaths.\n\nThis is not a problem with the plugin, it is a server setting.`);
					}
				}

				openEmbedPopup() {
					if (!document.getElementById("embedPopupWrapper")) {
						embedOpen = true;

						var popupWrapper = document.createElement("div");
						popupWrapper.setAttribute("id", "embedPopupWrapper");

						var embedButton = document.getElementsByClassName("embed-button-wrapper")[0].getBoundingClientRect();
						var positionInterval = setInterval(() => {
							if (!document.getElementById("embedPopupWrapper")) {
								window.clearInterval(positionInterval);
							}
							popupWrapper.setAttribute("style", "text-align: center; border-radius: 10px; width: " + popupWrapperWidth + "px; height: " + popupWrapperHeight + "px; position: absolute; top: " + ((window.innerHeight / 2) - (popupWrapperHeight / 2)) + "px; left: " + ((window.innerWidth / 2) - (popupWrapperWidth / 2)) + "px; background-color: #36393F; z-index: 999999999999999999999; text-rendering: optimizeLegibility;");
						}, 100);

						// Exit button: <svg width="18" height="18" class="button-1w5pas da-button dropdown-33sEFX da-dropdown open-1Te94t da-open"><g fill="none" fill-rule="evenodd"><path d="M0 0h18v18H0"></path><path stroke="#FFF" d="M4.5 4.5l9 9" stroke-linecap="round"></path><path stroke="#FFF" d="M13.5 4.5l-9 9" stroke-linecap="round"></path></g></svg>
						var exitButton = document.createElement("div");
						exitButton.setAttribute("style", "position: absolute; width: 18px; height: 18px; right: 10px; top: 10px;");
						exitButton.innerHTML = `<svg width="18" height="18" class="button-1w5pas dropdown-33sEFX open-1Te94t"><g fill="none" fill-rule="evenodd"><path d="M0 0h18v18H0"></path><path stroke="#FFF" d="M4.5 4.5l9 9" stroke-linecap="round"></path><path stroke="#FFF" d="M13.5 4.5l-9 9" stroke-linecap="round"></path></g></svg>`;


						var providerName = document.createElement("input");
						providerName.setAttribute("id", "providerName");

						var providerUrl = document.createElement("input");
						providerUrl.setAttribute("id", "providerUrl");

						var authorName = document.createElement("input");
						authorName.setAttribute("id", "authorName");

						var authorUrl = document.createElement("input");
						authorUrl.setAttribute("id", "authorUrl");

						var title = document.createElement("input");
						title.setAttribute("id", "title");

						var description = document.createElement("textarea");
						description.setAttribute("id", "description");

						var imageUrl = document.createElement("input");
						imageUrl.setAttribute("id", "imageUrl");

						var imageType = document.createElement("div");
						imageType.setAttribute("id", "imageType");

						var imageTypeText = document.createElement("div");
						imageTypeText.setAttribute("id", "imageTypeText");

						var imageTypeInput = document.createElement("input");
						imageTypeInput.setAttribute("id", "imageTypeInput");

						var colorPicker = document.createElement("input");
						colorPicker.setAttribute("id", "colorPicker");

						var submitButton = document.createElement("input");
						var fadeOutBackground = document.createElement("div");

						var inputStyle = "width: 275px; margin: auto auto 10px auto;";
						var textInputStyle = "background-color: #484B52; border: none; border-radius: 5px; height: 30px; padding-left: 10px;";

						providerName.setAttribute("type", "text");
						providerName.setAttribute("placeholder", "Provider Name");
						providerName.setAttribute("style", inputStyle + "margin-top: 10px;" + textInputStyle);
						providerName.oninput = () => {
							oldProviderName = providerName.value;

							this.createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
						};

						providerUrl.setAttribute("type", "text");
						providerUrl.setAttribute("placeholder", "Provider URL");
						providerUrl.setAttribute("style", inputStyle + textInputStyle);
						providerUrl.oninput = () => {
							this.createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
						};

						authorName.setAttribute("type", "text");
						authorName.setAttribute("placeholder", "Author Name");
						authorName.setAttribute("style", inputStyle + textInputStyle);
						authorName.oninput = () => {
							if (authorName.value.trim() == "" && imageTypeInput.getAttribute("checked") == "true") {
								this.disableUnusableInputs(authorName, description, providerName);
							} else {
								this.reenableNowUsableInputs(authorName, description, providerName);
							}

							this.createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
						};

						authorUrl.setAttribute("type", "text");
						authorUrl.setAttribute("placeholder", "Author URL");
						authorUrl.setAttribute("style", inputStyle + textInputStyle);
						authorUrl.oninput = () => {
							this.createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
						};

						title.setAttribute("type", "text");
						title.setAttribute("placeholder", "Title");
						title.setAttribute("style", inputStyle + textInputStyle);
						title.oninput = () => {
							this.createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
						};

						description.setAttribute("placeholder", "Description");
						description.setAttribute("style", inputStyle + "height: 250px !important; resize: none;" + textInputStyle);
						description.oninput = () => {
							oldDescription = description.value;

							this.createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
						};

						imageUrl.setAttribute("type", "text");
						imageUrl.setAttribute("placeholder", "Image URL");
						imageUrl.setAttribute("style", inputStyle + textInputStyle);
						imageUrl.oninput = () => {
							this.createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
						};

						imageType.setAttribute("class", "flexChild-faoVW3 switchEnabled-V2WDBB switch-3wwwcV valueUnchecked-2lU_20 value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
						imageType.setAttribute("tabindex", "0");
						imageType.setAttribute("style", "flex: 0 0 auto;" + inputStyle);
						imageType.onclick = () => {
							if (imageType.getAttribute("class") == "flexChild-faoVW3 switchEnabled-V2WDBB switch-3wwwcV valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX") {
								imageType.setAttribute("class", "flexChild-faoVW3 switchEnabled-V2WDBB switch-3wwwcV valueUnchecked-2lU_20 value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
								imageTypeText.setAttribute("style", "position: absolute; text-align: center; width: 100%; height: 100%; line-height: 22.5px; color: white;");
								imageTypeInput.setAttribute("checked", "false");

								this.reenableNowUsableInputs(authorName, description, providerName);
							} else {
								imageType.setAttribute("class", "flexChild-faoVW3 switchEnabled-V2WDBB switch-3wwwcV valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
								imageTypeText.setAttribute("style", "position: absolute; text-align: center; width: 100%; height: 100%; line-height: 22.5px; color: black;");
								imageTypeInput.setAttribute("checked", "true");

								this.disableUnusableInputs(authorName, description, providerName);
							}

							this.createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
						};
						imageTypeText.innerHTML = "Banner Image Mode";
						imageTypeText.setAttribute("style", "position: absolute; text-align: center; width: 100%; height: 100%; line-height: 22.5px; color: white;");
						imageTypeInput.setAttribute("class", "checkboxEnabled-CtinEn checkbox-2tyjJg");
						imageTypeInput.setAttribute("type", "checkbox");
						imageTypeInput.setAttribute("tabindex", "-1");
						imageTypeInput.setAttribute("checked", "false");
						imageTypeInput.setAttribute("style", "margin-left: auto; margin-right: auto;");
						imageType.appendChild(imageTypeText);
						imageType.appendChild(imageTypeInput);

						colorPicker.setAttribute("type", "color");
						colorPicker.setAttribute("style", inputStyle + "background-color: #484B52; border: none; border-radius: 5px;");
						colorPicker.oninput = () => {
							this.createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
						};

						submitButton.setAttribute("type", "button");
						submitButton.setAttribute("value", "Send");
						submitButton.setAttribute("style", inputStyle + "background-color: #484B52; border: none; border-radius: 5px; color: #99AAB5; height: 30px;");

						submitButton.onclick = () => {
							if (!(providerName.value.trim() == "" && providerUrl.value.trim() == "" && authorName.value.trim() == "" && authorUrl.value.trim() == "" && description.value.trim() == "" && imageUrl.value.trim() == "")) {
								var img = new Image();
								if ((providerName.value.trim() == "" && authorName.value.trim() == "" && description.value.trim() == "" && imageUrl.value.trim() != "")) {
									img.onload = function() {
										this.sendEmbed(providerName.value, providerUrl.value, authorName.value, authorUrl.value, "", description.value, imageUrl.value, imageTypeInput.getAttribute("checked"), colorPicker.value);
										this.closeEmbedPopup();
									};
									img.src = imageUrl.value;
								} else {
									this.sendEmbed(providerName.value, providerUrl.value, authorName.value, authorUrl.value, "", description.value, imageUrl.value, imageTypeInput.getAttribute("checked"), colorPicker.value);
									this.closeEmbedPopup();
								}
							}
						};

						//    popupWrapper.appendChild(exitButton);
						popupWrapper.appendChild(providerName);
						popupWrapper.appendChild(providerUrl);
						popupWrapper.appendChild(authorName);
						popupWrapper.appendChild(authorUrl);
						//    popupWrapper.appendChild(title);
						popupWrapper.appendChild(description);
						popupWrapper.appendChild(imageUrl);
						popupWrapper.appendChild(imageType);
						popupWrapper.appendChild(colorPicker);
						popupWrapper.appendChild(submitButton);

						// var jQColoPicker = $(colorPicker);
						// jQColorPicker.spectrum({
						//   color: "#000000",
						//   flat: true,
						//   cancelText: "",
						//   showInput: true
						// });

						// Add the fadeout for the background.
						fadeOutBackground.setAttribute("id", "fadeOutBackground");
						fadeOutBackground.setAttribute("style", "position: absolute; width: 100%; height: 100%; top: 22px; background-color: rgba(0, 0, 0, 0.8); z-index: 999999999999999999998;");
						fadeOutBackground.onclick = () => {
							this.closeEmbedPopup();
						};


						document.body.appendChild(fadeOutBackground);

						// createRecentEmbedPopup(300);
						this.createEmbedPreviewPopup(popupWrapperWidth + 80, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);

						document.body.appendChild(popupWrapper);
					}
				}

				createRecentEmbedPopup(offset) {
					if (!document.getElementById("recentEmbedsWrapper")) {
						var recentEmbedsWrapper = document.createElement("div");
						var recentEmbedsWidth = 200;
						var recentEmbedsHeight = 600;
						recentEmbedsWrapper.setAttribute("id", "recentEmbedsWrapper");
						recentEmbedsWrapper.setAttribute("class", "theme-dark");

						var positionInterval = setInterval(() => {
							if (!document.getElementById("embedPreviewWrapper")) {
								window.clearInterval(positionInterval);
							}
							recentEmbedsWrapper.setAttribute("style", "border-radius: 10px; width: " + recentEmbedsWidth + "px; height: " + recentEmbedsHeight + "px; position: absolute; top: " + ((window.innerHeight / 2) - (recentEmbedsHeight / 2) - 10) + "px; left: " + ((window.innerWidth / 2) - (recentEmbedsWidth / 2) - offset) + "px; background-color: #36393F; z-index: 999999999999999999999; padding: 10px; text-rendering: optimizeLegibility;");
						}, 100);

						var recentEmbedsInner = document.createElement("div");
						recentEmbedsInner.setAttribute("style", "overflow-y: scroll; width: " + recentEmbedsWidth + "px; height: " + recentEmbedsHeight + "px;");

						for (var i = 0; i < recentEmbeds.length; i++) {
							var embed = recentEmbeds[i];

							var embedElement = document.createElement("div");
							embedElement.setAttribute("id", "embedNumber" + i);
							embedElement.setAttribute("class", "embed-IeVjo6 da-embed embedWrapper-3AbfJJ da-embedWrapper");
							embedElement.setAttribute("aria-hidden", "false");
							embedElement.setAttribute("style", "margin-bottom: 10px; max-width: 426px; width: auto; height: auto;");

							embedElement.ondblclick = (e) => {
								var target = (e || window.event).target;

								while (!target.id.startsWith("embedNumber")) {
									target = target.parentElement;
								}

								var elementIndex = parseInt(target.id.replace("embedNumber", ""));

								document.getElementById("providerName").value = recentEmbeds[elementIndex].providerName;
								document.getElementById("providerUrl").value = recentEmbeds[elementIndex].providerUrl;
								document.getElementById("authorName").value = recentEmbeds[elementIndex].authorName;
								document.getElementById("authorUrl").value = recentEmbeds[elementIndex].authorUrl;
								// Title isn't being used right now.
								//				document.getElementById("title").value = recentEmbeds[elementIndex].title;
								document.getElementById("description").value = recentEmbeds[elementIndex].description;
								document.getElementById("imageType").setAttribute("checked", (recentEmbeds[elementIndex].isBanner ? "true" : "false"));
								document.getElementById("colorPicker").value = "#" + recentEmbeds[elementIndex].color;

								this.createEmbedPreviewPopup(popupWrapperWidth + 80, document.getElementById("providerName").value, document.getElementById("providerUrl").value, document.getElementById("authorName").value, document.getElementById("authorUrl").value, document.getElementById("description").value, document.getElementById("colorPicker").value, document.getElementById("authorUrl").getAttribute("checked"), document.getElementById("imageUrl").value);
							};

							embedElement.innerHTML = `<div class="embedPill-1Zntps da-embedPill" style="background-color: ` + (embed.color == "000000" ? "#4f545c" : "#" + embed.color) + `;"></div><div class="embedInner-1-fpTo da-embedInner"><div class="embedContent-3fnYWm da-embedContent"><div class="embedContentInner-FBnk7v da-embedContentInner markup-2BOw-j da-markup" style="clear: right;">` + (embed.providerName.trim() != "" ? `<div class=""><` + (embed.providerUrl.trim() == "" ? "span" : "a") + ` tabindex="0" class="` + (embed.providerUrl.trim() == "" ? "embedProvider-3k5pfl da-embedProvider" : `anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover embedProviderLink-2Pq1Uw embedLink-1G1K1D embedProvider-3k5pfl da-embedProviderLink da-embedLink da-embedProvider`) + `" href=` + embed.providerUrl + `" rel="noreferrer noopener" target="_blank">` + embed.providerName + `</` + (embed.providerUrl.trim() == "" ? "span" : "a") + `></div>` : "") + `` + (embed.authorName.trim() != "" ? `<div class="embedAuthor-3l5luH da-embedAuthor embedMargin-UO5XwE da-embedMargin"><` + (embed.authorUrl.trim() == "" ? "span" : "a") + ` tabindex="0" class="` + (embed.authorUrl.trim() == "" ? "embedAuthorName-3mnTWj da-embedAuthorName" : `anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover embedAuthorNameLink-1gVryT embedLink-1G1K1D embedAuthorName-3mnTWj da-embedAuthorNameLink da-embedLink da-embedAuthorName`) + `" href="` + embed.authorUrl + `" rel="noreferrer noopener" target="_blank">` + embed.authorName + `</` + (embed.providerUrl.trim() == "" ? "span" : "a") + `></div>` : "") + `` + (embed.description.trim() != "" ? `<div class="embedDescription-1Cuq9a da-embedDescription embedMargin-UO5XwE da-embedMargin">` + embed.description + `</div>` : "") + `</div></div></div>`;

							recentEmbedsInner.appendChild(embedElement);
						}

						recentEmbedsWrapper.appendChild(recentEmbedsInner);
						document.body.appendChild(recentEmbedsWrapper);
					}
				}

				createEmbedPreviewPopup(offset, providerName, providerUrl, authorName, authorUrl, description, color, imageType, imageUrl) {
					var img = new Image();

					var create = (useImage, oldImage) => {

						var imageWidth = 0;
						var imageHeight = 0;
						if (useImage && !oldImage) {
							oldImageUrl = imageUrl;

							imageWidth = img.width;
							imageHeight = img.height;

							oldImageWidth = imageWidth;
							oldImageHeight = imageHeight;
						} else if (oldImage) {
							imageUrl = oldImageUrl;
							imageWidth = oldImageWidth;
							imageHeight = oldImageHeight;
						}

						imageType = (imageType == "true" ? "photo" : "thumbnail");

						var imageString = "";


						var embedImageLink = document.createElement("a");
						if (imageType == "photo") {
							embedImageLink.setAttribute("class", "anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover imageWrapper-2p5ogY da-imageWrapper imageZoom-1n-ADA da-imageZoom clickable-3Ya1ho da-clickable embedImage-2W1cML da-embedImage embedMarginLarge-YZDCEs da-embedMarginLarge embedWrapper-3AbfJJ da-embedWrapper");
						} else {
							embedImageLink.setAttribute("class", "anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover imageWrapper-2p5ogY da-imageWrapper imageZoom-1n-ADA da-imageZoom clickable-3Ya1ho da-clickable embedThumbnail-2Y84-K da-embedThumbnail");
						}
						embedImageLink.setAttribute("href", imageUrl);
						embedImageLink.setAttribute("ref", "noreferrer noopener");
						embedImageLink.setAttribute("target", "_blank");
						embedImageLink.setAttribute("role", "button");

						var embedImage = document.createElement("img");
						embedImage.setAttribute("src", imageUrl);

						var scaledImageWidth = -1;
						var scaledImageHeight = -1;

						if (imageType == "photo") {
							//			` + (imageType == "photo" ? `float: right; max-width: 400px; max-height: 400px;` : `float: default; max-width: 80px; max-height: 80px;`) + ("width: " + imageWidth + "px; height: " + imageHeight + "px;") + `

							var countDownScale = 1000.0;
							if (imageWidth >= imageHeight) {
								while (scaledImageWidth > 400 || scaledImageWidth == -1) {
									scaledImageWidth = imageWidth * (countDownScale / 1000);
									countDownScale--;
								}
								scaledImageHeight = imageHeight * (countDownScale / 1000);
							} else {
								while (scaledImageHeight > 400 || scaledImageHeight == -1) {
									scaledImageHeight = imageHeight * (countDownScale / 1000);
									countDownScale--;
								}
								scaledImageWidth = imageWidth * (countDownScale / 1000);
							}

							embedImageLink.setAttribute("style", "float: default; max-width: 400px; max-height: 400px; width: " + scaledImageWidth + "px; height: " + scaledImageHeight + "px;");
							embedImage.setAttribute("style", "max-width: 400px; max-height: 400px; width: " + scaledImageWidth + "px; height: " + scaledImageHeight + "px;" + `background-image: url("https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336"); background-size: cover; background-repeat: none; background-position: center;`);
						} else {
							var countDownScale = 1000.0;
							if (imageWidth >= imageHeight) {
								while (scaledImageWidth > 80 || scaledImageWidth == -1) {
									scaledImageWidth = imageWidth * (countDownScale / 1000);
									countDownScale--;
								}
								scaledImageHeight = imageHeight * (countDownScale / 1000);
							} else {
								while (scaledImageHeight > 80 || scaledImageHeight == -1) {
									scaledImageHeight = imageHeight * (countDownScale / 1000);
									countDownScale--;
								}
								scaledImageWidth = imageWidth * (countDownScale / 1000);
							}

							embedImageLink.setAttribute("style", "float: right; max-width: 80px; max-height: 80px; width: " + scaledImageWidth + "px; height: " + scaledImageHeight + "px;");
							embedImage.setAttribute("style", "max-width: 80px; max-height: 80px; width: " + scaledImageWidth + "px; height: " + scaledImageHeight + "px;" + `background-image: url("https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336"); background-size: cover; background-repeat: none; background-position: center;`);
						}

						embedImageLink.appendChild(embedImage);

						imageString = embedImageLink.outerHTML;


						var tmpString = `<div class="embed-IeVjo6 da-embed embedWrapper-3AbfJJ da-embedWrapper" aria-hidden="false" style="max-width: 426px; width: auto; height: auto;"><div class="embedPill-1Zntps da-embedPill" style="background-color: ` + (color == "#000000" ? "#4f545c" : color) + `;"></div><div class="embedInner-1-fpTo da-embedInner">` + (useImage ? (imageType == "thumbnail" ? imageString : "") : "") + `<div class="embedContent-3fnYWm da-embedContent"><div class="embedContentInner-FBnk7v da-embedContentInner markup-2BOw-j da-markup" style="clear: right;">` + (providerName.trim() != "" ? `<div class=""><` + (providerUrl.trim() == "" ? "span" : "a") + ` tabindex="0" class="` + (providerUrl.trim() == "" ? "embedProvider-3k5pfl da-embedProvider" : `anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover embedProviderLink-2Pq1Uw embedLink-1G1K1D embedProvider-3k5pfl da-embedProviderLink da-embedLink da-embedProvider`) + `" href=` + providerUrl + `" rel="noreferrer noopener" target="_blank">` + providerName + `</` + (providerUrl.trim() == "" ? "span" : "a") + `></div>` : "") + `` + (authorName.trim() != "" ? `<div class="embedAuthor-3l5luH da-embedAuthor embedMargin-UO5XwE da-embedMargin"><` + (authorUrl.trim() == "" ? "span" : "a") + ` tabindex="0" class="` + (authorUrl.trim() == "" ? "embedAuthorName-3mnTWj da-embedAuthorName" : `anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover embedAuthorNameLink-1gVryT embedLink-1G1K1D embedAuthorName-3mnTWj da-embedAuthorNameLink da-embedLink da-embedAuthorName`) + `" href="` + authorUrl + `" rel="noreferrer noopener" target="_blank">` + authorName + `</` + (providerUrl.trim() == "" ? "span" : "a") + `></div>` : "") + `` + (description.trim() != "" ? `<div class="embedDescription-1Cuq9a da-embedDescription embedMargin-UO5XwE da-embedMargin">` + description + `</div>` : "") + `</div></div>` + (useImage ? (imageType == "photo" ? imageString : "") : "") + `</div></div>`;

						var htmlString = (providerName.trim() == "" && authorName.trim() == "" && description.trim() == "" && imageType == "photo" ? (providerName.trim() == "" && authorName.trim() == "" && description.trim() == "" && imageUrl.trim() == "" ? tmpString : imageString) : tmpString);
						if (!document.getElementById("embedPreviewWrapper")) {
							var previewWrapper = document.createElement("div");
							var previewWrapperWidth = 446;
							var previewWrapperHeight = 446;
							previewWrapper.setAttribute("id", "embedPreviewWrapper");
							previewWrapper.setAttribute("class", "theme-dark");

							var embedButton = document.getElementsByClassName("embed-button-wrapper")[0].getBoundingClientRect();
							var positionInterval = setInterval(() => {
								if (!document.getElementById("embedPreviewWrapper")) {
									window.clearInterval(positionInterval);
								}
								previewWrapper.setAttribute("style", "border-radius: 10px; width: auto; height: auto; position: absolute; top: " + ((window.innerHeight / 2) - (previewWrapperHeight / 2)) + "px; left: " + ((window.innerWidth / 2) - (previewWrapperWidth / 2) + offset) + "px; background-color: #36393F; z-index: 999999999999999999999; padding: 10px; text-rendering: optimizeLegibility;");
							}, 100);

							previewWrapper.innerHTML = htmlString;

							document.body.appendChild(previewWrapper);

							return previewWrapper;
						} else {
							// Refresh the embed preview because it is already there.
							var previewWrapper = document.getElementById("embedPreviewWrapper");
							previewWrapper.innerHTML = htmlString;
							return previewWrapper;
						}
					};

					if (oldImageUrl != imageUrl) {
						img.onload = function() {
							create(true, false);
						};
						img.onerror = function() {
							create(false, false);
						};

						img.src = imageUrl;
					} else {
						create(true, true);
					}
				}

				testImage(imageUrl) {
					return (imageUrl.trim() != "" ? true : false);
				}

				reenableNowUsableInputs(authorName, description, providerName) {
					description.disabled = false;
					if (oldDescription != "") {
						description.value = oldDescription;
					}
					description.setAttribute("placeholder", "Description");

					providerName.disabled = false;
					if (oldProviderName != "") {
						providerName.value = oldProviderName;
					}
					providerName.setAttribute("placeholder", "Provider Name");
				}

				disableUnusableInputs(authorName, description, providerName) {
					if (authorName.value.trim() == "") {
						description.disabled = true;
						description.value = "";
						description.setAttribute("placeholder", disabledDescription);

						providerName.disabled = true;
						oldProviderName = providerName.value;
						providerName.value = "";
						providerName.setAttribute("placeholder", disabledProviderName);
					}
				}

				closeEmbedPopup() {
					try {
						document.getElementById("embedPopupWrapper").remove();
					} catch (e) {}
					try {
						document.getElementById("embedPreviewWrapper").remove();
					} catch (e) {}
					try {
						document.getElementById("recentEmbedsWrapper").remove();
					} catch (e) {}
					try {
						document.getElementById("fadeOutBackground").remove();
					} catch (e) {}
					oldDescription = "";
					oldProviderName = "";

					embedOpen = false;
				}

				hasPermission(permission) {
					var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
					var channel = ZLibrary.DiscordAPI.Channel.from(ZLibrary.DiscordAPI.Channel.fromId(channelId));
					var permissions = channel.discordObject.permissions;

					var hexCode;

					// General
					if (permission == "generalCreateInstantInvite") hexCode = 0x1;
					if (permission == "generalKickMembers") hexCode = 0x2;
					if (permission == "generalBanMembers") hexCode = 0x4;
					if (permission == "generalAdministrator") hexCode = 0x8;
					if (permission == "generalManageChannels") hexCode = 0x10;
					if (permission == "generalManageServer") hexCode = 0x20;
					if (permission == "generalChangeNickname") hexCode = 0x4000000;
					if (permission == "generalManageNicknames") hexCode = 0x8000000;
					if (permission == "generalManageRoles") hexCode = 0x10000000;
					if (permission == "generalManageWebhooks") hexCode = 0x20000000;
					if (permission == "generalManageEmojis") hexCode = 0x40000000;
					if (permission == "generalViewAuditLog") hexCode = 0x80;
					// Text
					if (permission == "textAddReactions") hexCode = 0x40;
					if (permission == "textReadMessages") hexCode = 0x400;
					if (permission == "textSendMessages") hexCode = 0x800;
					if (permission == "textSendTTSMessages") hexCode = 0x1000;
					if (permission == "textManageMessages") hexCode = 0x2000;
					if (permission == "textEmbedLinks") hexCode = 0x4000;
					if (permission == "textAttachFiles") hexCode = 0x8000;
					if (permission == "textReadMessageHistory") hexCode = 0x10000;
					if (permission == "textMentionEveryone") hexCode = 0x20000;
					if (permission == "textUseExternalEmojis") hexCode = 0x40000;
					// Voice
					if (permission == "voiceViewChannel") hexCode = 0x400;
					if (permission == "voiceConnect") hexCode = 0x100000;
					if (permission == "voiceSpeak") hexCode = 0x200000;
					if (permission == "voiceMuteMembers") hexCode = 0x400000;
					if (permission == "voiceDeafenMembers") hexCode = 0x800000;
					if (permission == "voiceMoveMembers") hexCode = 0x1000000;
					if (permission == "voiceUseVAD") hexCode = 0x2000000;

					return (permissions & hexCode) != 0;
				}


			};
		};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/

SafeEmbedGenerator.prototype.onSwitch = function() {
	this.addButton();
};
