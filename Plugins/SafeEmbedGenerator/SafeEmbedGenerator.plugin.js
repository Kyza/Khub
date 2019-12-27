//META{"name":"SafeEmbedGenerator","website":"https://khub.kyza.net/?plugin=SafeEmbedGenerator","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/SafeEmbedGenerator/SafeEmbedGenerator.plugin.js"}*//

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

function getLibraries_220584715265114113() {
	const title = "Libraries Missing";
	const ModalStack = BdApi.findModuleByProps(
		"push",
		"update",
		"pop",
		"popWithKey"
	);
	const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
	const ConfirmationModal = BdApi.findModule(
		(m) => m.defaultProps && m.key && m.key() == "confirm-modal"
	);
	if (!ModalStack || !ConfirmationModal || !TextElement)
		return BdApi.alert(
			title,
			`The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`
		);
	ModalStack.push(function(props) {
		return BdApi.React.createElement(
			ConfirmationModal,
			Object.assign(
				{
					header: title,
					children: [
						TextElement({
							color: TextElement.Colors.PRIMARY,
							children: [
								`In order to work, ${config.info.name} needs to download the two libraries `,
								BdApi.React.createElement(
									"a",
									{
										href: "https://github.com/rauenzi/BDPluginLibrary/",
										target: "_blank"
									},
									"ZeresPluginLibrary"
								),
								` and `,
								BdApi.React.createElement(
									"a",
									{
										href: "https://github.com/KyzaGitHub/Khub/tree/master/Libraries/KSS",
										target: "_blank"
									},
									"KSS"
								),
								`.`
							]
						})
					],
					red: false,
					confirmText: "Download",
					cancelText: "No! Disable this plugin!",
					onConfirm: () => {
						// Install ZLibrary first.
						require("request").get(
							"https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
							async (error, response, body) => {
								if (error)
									return require("electron").shell.openExternal(
										"https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
									);
								await new Promise((r) =>
									require("fs").writeFile(
										require("path").join(
											ContentManager.pluginsFolder,
											"0PluginLibrary.plugin.js"
										),
										body,
										r
									)
								);
							}
						);
						// Install KSS last.
						require("request").get(
							"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/1KSSLibrary.plugin.js",
							async (error, response, body) => {
								if (error)
									return require("electron").shell.openExternal(
										"https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/1KSSLibrary.plugin.js"
									);
								await new Promise((r) =>
									require("fs").writeFile(
										require("path").join(
											ContentManager.pluginsFolder,
											"1KSSLibrary.plugin.js"
										),
										body,
										r
									)
								);
							}
						);
					},
					onCancel: () => {
						pluginModule.disablePlugin(this.getName());
					}
				},
				props
			)
		);
	});
}

var SafeEmbedGenerator = (() => {
	const config = {
		info: {
			name: "SafeEmbedGenerator",
			authors: [
				{
					name: "Kyza",
					discord_id: "220584715265114113",
					github_username: "KyzaGitHub"
				}
			],
			version: "2.0.1",
			description:
				"Adds a button which allows you to create non-bannable embeds with ease.",
			website: "https://khub.kyza.net/?plugin=SafeEmbedGenerator",
			github_raw:
				"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/SafeEmbedGenerator/SafeEmbedGenerator.plugin.js"
		},
		changelog: [
			// {
			//   "title": "New Stuff",
			//   "items": ["Removed the Revenge Ping button."]
			// }
			// ,
			{
			  title: "Bugs Squashed",
			  type: "fixed",
			  items: [
			    "Fixed the plugin not asking to download KSSLibrary."
			  ]
			}
			// 	    ,
			// {
			// 	title: "Improvements",
			// 	type: "improved",
			// 	items: [
			// 		"Fully rewritten.",
			// 		"Added a button to copy the channel link so others can join you."
			// 	]
			// }
			//	,
			// {
			//   "title": "On-going",
			//   "type": "progress",
			//   "items": []
			// }

		],
		main: "index.js"
	};

	return !global.ZeresPluginLibrary
		? class {
				constructor() {
					this._config = config;
				}
				getName() {
					return config.info.name;
				}
				getAuthor() {
					return config.info.authors.map((a) => a.name).join(", ");
				}
				getDescription() {
					return config.info.description;
				}
				getVersion() {
					return config.info.version;
				}
				load() {
					getLibraries_220584715265114113();
				}
				start() {}
				stop() {}
		  }
		: (([Plugin, Api]) => {
				const plugin = (Plugin, Api) => {
					const {
						DiscordModules,
						Logger,
						Patcher,
						WebpackModules,
						PluginUpdater,
						PluginUtilities,
						DiscordAPI,
						Toasts,
						ReactTools
					} = Api;

					const {
						MessageStore,
						UserStore,
						ImageResolver,
						ChannelStore,
						Dispatcher
					} = DiscordModules;

					var request = require("request");

					var KSS = null;

					return class SafeEmbedGenerator extends Plugin {
						onStart() {
							if (!window.KSSLibrary) {
								getLibraries_220584715265114113();
							}

							PluginUpdater.checkForUpdate(
								"SafeEmbedGenerator",
								this.getVersion(),
								"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/SafeEmbedGenerator/SafeEmbedGenerator.plugin.js"
							);

							KSS = new KSSLibrary(this);

							KSS.setModule(
								"css",
								`
#embed-creator {
  position: absolute;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  background-color: var(--background-primary);
  border: 1px solid var(--background-tertiary);
  z-index: 999999999999;
  transition-duration: 0.4s;

  display: grid;
  grid-template-rows: 40% auto 52px;
}

#embed-creator.open {
  pointer-events: auto;
  opacity: 1;
  transform: scale(100%);
}

#embed-creator.closed {
  pointer-events: none;
  opacity: 0;
  transform: scale(0%);
}

#embed-inputs {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto auto auto auto 24px;
}

#embed-inputs .col1 {
  grid-column: 1;
}

#embed-inputs .col2 {
  grid-column: 2;
}

#embed-inputs * {
  border-radius: 0px;
  width: 100%;
  height: 100%;
  margin: 0px;
  resize: none;
}

#embed-image-banner-wrapper {
  grid-column: 1 / 3;
}

#embed-image-banner-wrapper::after {
  content: "Image Banner";
  color: #72767d;
  font-weight: bold;
  text-align: center;
  line-height: 18px;
  width: calc(50% - 6px);
  height: calc(100% - 6px);
}

#embed-image-banner-wrapper[class*="valueChecked"]::after {
  color: #7289da;
  transform: none;
  left: calc(50%);
}

#embed-preview {
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-rows: auto;
  grid-template-columns: auto;
  overflow-y: auto;
}

#embed-preview-author {
  font-weight: 500;
}

|embedProvider||embedLink| {
  color: var(--interactive-normal);
}

#embed-buttons {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: 100%;
}

#embed-buttons * {
  border-radius: 0px;
  height: 52px;
}

#embed-buttons * * {
  line-height: 48px;
}

#embed-button-wrapper {
  cursor: normal !important;
}
#embed-button-inner {
  cursor: pointer !important;
}
                `
							);

							this.addButton();
							this.createPopup();
						}

						onStop() {
							this.removeButton();
							this.removePopup();
							KSS.dispose();
						}

						onSwitch() {
							// Use this as a backup.
							this.addButton();
							this.createPopup();
						}

						observer({ addedNodes }) {
							for (const node of addedNodes) {
								if (
									node.className == KSS.createClassName("|chat|") ||
									node.className == KSS.createClassName("|chatContent|")
								) {
									this.addButton();
									this.createPopup();
								}
							}
						}

						error(error, toast) {
							let before = this.getName() + " v" + this.getVersion() + ": ";
							if (toast) {
								Toasts.show(before + error, {
									type: "error",
									timeout: 5000
								});
								console.error(before + error);
							} else {
								console.error(before + error);
							}
						}

						hasPermission() {
							let channel = DiscordAPI.currentChannel;
							if (!channel) return false;
							if (channel.type == "DM") return true;
							if (channel.checkPermissions) {
								if (
									channel.checkPermissions(
										DiscordModules.DiscordPermissions.SEND_MESSAGES
									) &&
									channel.checkPermissions(
										DiscordModules.DiscordPermissions.EMBED_LINKS
									) &&
									this.isAllowed()
								) {
									return true;
								}
							} else {
								if (this.isAllowed()) {
									return true;
								}
							}
							return false;
						}

						addButton() {
							try {
								// Only add the button if the user has permissions to send messages and embed links.
								if (this.hasPermission()) {
									var daButtons = document.querySelector(
										KSS.parse("|highBackgroundOpacity buttons|")
									);
									if (
										!document.querySelector("#embed-button-wrapper") &&
										daButtons != null
									) {
										var embedButton = document.createElement("button");
										embedButton.setAttribute("type", "button");
										embedButton.id = "embed-button-wrapper";
										embedButton.className = KSS.createClassName(
											"|active buttonWrapper| |button| |lookBlank| |colorBrand| |grow|"
										);

										var embedButtonInner = document.createElement("div");
										embedButtonInner.id = "embed-button-inner";
										embedButtonInner.className = KSS.createClassName(
											"|contents| |pulseButton button| |highBackgroundOpacity button|"
										);

										var embedButtonIcon = document.createElement("img");
										embedButtonIcon.setAttribute(
											"src",
											"https://image.flaticon.com/icons/svg/25/25463.svg"
										);
										embedButtonIcon.setAttribute(
											"class",
											KSS.createClassName("|pulseButton icon|")
										);
										embedButtonIcon.setAttribute(
											"style",
											"filter: invert(70%) !important;"
										);
										embedButtonIcon.setAttribute("width", "22");
										embedButtonIcon.setAttribute("height", "22");

										embedButtonIcon.onmouseover = () => {
											embedButtonIcon.setAttribute(
												"style",
												"filter: invert(100%) !important;"
											);
										};
										embedButtonIcon.onmouseout = () => {
											embedButtonIcon.setAttribute(
												"style",
												"filter: invert(70%) !important;"
											);
										};

										embedButtonInner.appendChild(embedButtonIcon);
										embedButton.appendChild(embedButtonInner);
										daButtons.insertBefore(embedButton, daButtons.firstChild);

										embedButtonInner.onclick = () => {
											this.openPopup();
										};
									}
								} else {
									this.removeButton();
								}
							} catch (e) {
								this.error(e, true);
							}
						}

						isAllowed() {
							try {
								let guild = DiscordAPI.currentGuild;
								if (!guild) {
									return true;
								} else if (
									(guild.id != "86004744966914048" &&
										guild.id != "280806472928198656") ||
									DiscordAPI.currentUser.id == "220584715265114113"
								) {
									return true;
								}
							} catch (e) {}

							return false;
						}

						removeButton() {
							if (document.querySelector("embed-button-wrapper")) {
								document.querySelector("embed-button-wrapper").remove();
							}
						}

						sendEmbed() {
							this.disableButtons();
							var channel = DiscordAPI.currentChannel;

							let providerName = document.querySelector("#embed-provider-name");
							let providerURL = document.querySelector("#embed-provider-url");
							let authorName = document.querySelector("#embed-author-name");
							let authorURL = document.querySelector("#embed-author-url");
							let title = document.querySelector("#embed-title");
							let description = document.querySelector("#embed-description");
							let color = document.querySelector("#embed-color");
							let imageURL = document.querySelector("#embed-image-url");
							let imageBanner = document.querySelector("#embed-image-banner");

							// Only send the embed if the user has permissions to embed links.
							if (this.isAllowed()) {
								const obj = {};
								obj.providerName = providerName.value;
								obj.providerUrl = providerURL.value; // The link on the Provider Name.
								obj.authorName = authorName.value;
								obj.authorUrl = authorURL.value; // The link on the Author Name.
								obj.title = title.value;
								obj.description = description.value;
								obj.banner = imageBanner.checked; // Photo is a banner, nothing is a small image on the right.
								obj.image = imageURL.value; // The image displayed on the right.
								obj.color = color.value; // The color on the left of the embed.

								request(
									{
										url: "http://em.kyza.net/create/",
										method: "POST",
										json: obj
									},
									(err, res, body) => {
										if (err) {
											this.error(err, true);
											return;
										}
										if (this.hasPermission()) {
											channel.sendMessage(`http://em.kyza.net/embed/${body.id}`, true);
											this.closePopup();
										} else {
											this.enableButtons();
											BdApi.alert(
												"SafeEmbedGenerator",
												`You do not have permissions to send embedded links in this channel.\n\nBecause of this your message was not sent in order to prevent the embarrassment of 1,000 deaths.\n\nThis is not a problem with the plugin, it is a server setting.`
											);
										}
									}
								);
							} else {
								this.enableButtons();
								BdApi.alert(
									"SafeEmbedGenerator",
									`You do not have permissions to send embedded links in this channel.\n\nBecause of this your message was not sent in order to prevent the embarrassment of 1,000 deaths.\n\nThis is not a problem with the plugin, it is a server setting.`
								);
							}
						}

						appendEmbed() {
							this.disableButtons();
							var channel = DiscordAPI.currentChannel;

							let providerName = document.querySelector("#embed-provider-name");
							let providerURL = document.querySelector("#embed-provider-url");
							let authorName = document.querySelector("#embed-author-name");
							let authorURL = document.querySelector("#embed-author-url");
							let title = document.querySelector("#embed-title");
							let description = document.querySelector("#embed-description");
							let color = document.querySelector("#embed-color");
							let imageURL = document.querySelector("#embed-image-url");
							let imageBanner = document.querySelector("#embed-image-banner");

							// Only send the embed if the user has permissions to embed links.
							if (this.isAllowed()) {
								const obj = {};
								obj.providerName = providerName.value;
								obj.providerUrl = providerURL.value; // The link on the Provider Name.
								obj.authorName = authorName.value;
								obj.authorUrl = authorURL.value; // The link on the Author Name.
								obj.title = title.value;
								obj.description = description.value;
								obj.banner = imageBanner.checked; // Photo is a banner, nothing is a small image on the right.
								obj.image = imageURL.value; // The image displayed on the right.
								obj.color = color.value; // The color on the left of the embed.

								request(
									{
										url: "http://em.kyza.net/create/",
										method: "POST",
										json: obj
									},
									(err, res, body) => {
										if (err) {
											this.error(err, true);
											return;
										}
										if (this.hasPermission()) {
											let textarea = ReactTools.getOwnerInstance(
												document.querySelector(KSS.parse("|channelTextArea|"))
											);
											textarea.appendText(
												`${
													textarea.props.textValue[textarea.props.textValue.length - 1] ==
														"\n" || textarea.props.textValue.length == 0
														? ""
														: "\n"
												}http://em.kyza.net/embed/${body.id}`
											);
											textarea.focus();
											this.closePopup();
										} else {
											this.enableButtons();
											BdApi.alert(
												"SafeEmbedGenerator",
												`You do not have permissions to send embedded links in this channel.\n\nBecause of this your message was not sent in order to prevent the embarrassment of 1,000 deaths.\n\nThis is not a problem with the plugin, it is a server setting.`
											);
										}
									}
								);
							} else {
								this.enableButtons();
								BdApi.alert(
									"SafeEmbedGenerator",
									`You do not have permissions to send embedded links in this channel.\n\nBecause of this your message was not sent in order to prevent the embarrassment of 1,000 deaths.\n\nThis is not a problem with the plugin, it is a server setting.`
								);
							}
						}

						enableButtons() {
							document.querySelector("#embed-send-button").removeAttribute("disabled");
							document
								.querySelector("#embed-append-button")
								.removeAttribute("disabled");
							document
								.querySelector("#embed-cancel-button")
								.removeAttribute("disabled");
						}

						disableButtons() {
							document.querySelector("#embed-send-button").disabled = "true";
							document.querySelector("#embed-append-button").disabled = "true";
							document.querySelector("#embed-cancel-button").disabled = "true";
						}

						createPopup() {
							let layerContainer = document.querySelector(
								KSS.parse("|chatContent| |layerContainer|")
							);
							if (
								!document.querySelector("#embed-creator") &&
								layerContainer != null
							) {
								let embedPopup = document.createElement("div");
								embedPopup.id = "embed-creator";
								embedPopup.className = "closed";

								let embedInputs = document.createElement("div");
								embedInputs.id = "embed-inputs";

								let providerName = document.createElement("input");
								providerName.id = "embed-provider-name";
								providerName.setAttribute("maxlength", "256");
								providerName.placeholder = "Provider Name";
								providerName.className = KSS.createClassName("|inputDefault| |input|");
								providerName.oninput = () => {
									this.validateInputs();
									this.updatePreview();
								};

								let providerURL = document.createElement("input");
								providerURL.id = "embed-provider-url";
								providerURL.placeholder = "Provider URL";
								providerURL.className = KSS.createClassName("|inputDefault| |input|");
								providerURL.oninput = () => {
									this.validateInputs();
									this.updatePreview();
								};

								let authorName = document.createElement("input");
								authorName.id = "embed-author-name";
								authorName.setAttribute("maxlength", "256");
								authorName.placeholder = "Author Name";
								authorName.className = KSS.createClassName("|inputDefault| |input|");
								authorName.oninput = () => {
									this.validateInputs();
									this.updatePreview();
								};

								let authorURL = document.createElement("input");
								authorURL.id = "embed-author-url";
								authorURL.placeholder = "Author URL";
								authorURL.className = KSS.createClassName("|inputDefault| |input|");
								authorURL.oninput = () => {
									this.validateInputs();
									this.updatePreview();
								};

								let title = document.createElement("input");
								title.id = "embed-title";
								title.setAttribute("maxlength", "70");
								title.placeholder = "Title";
								title.className = KSS.createClassName("|inputDefault| |input|");
								title.oninput = () => {
									this.validateInputs();
									this.updatePreview();
								};

								let description = document.createElement("textarea");
								description.id = "embed-description";
								description.setAttribute("maxlength", "280");
								description.placeholder = "Description";
								description.className = KSS.createClassName("|inputDefault| |input|");
								description.oninput = () => {
									this.validateInputs();
									this.updatePreview();
								};

								let imageURL = document.createElement("input");
								imageURL.id = "embed-image-url";
								imageURL.placeholder = "Image URL";
								imageURL.className = KSS.createClassName("|inputDefault| |input|");
								imageURL.oninput = () => {
									this.validateInputs();
									this.updatePreview();
								};

								let color = document.createElement("input");
								color.id = "embed-color";
								color.type = "color";
								color.value = "#1E2327";
								color.className = KSS.createClassName(
									"|colorPickerSwatch| |custom| |noColor|"
								);
								color.oninput = () => {
									this.validateInputs();
									this.updatePreview();
								};

								let imageBannerWrapper = document.createElement("div");
								imageBannerWrapper.id = "embed-image-banner-wrapper";
								imageBannerWrapper.className = KSS.createClassName(
									"|flexChild| |switchEnabled| |switch| |valueUnchecked| |valueUnchecked value| |sizeDefault| |value size| |themeDefault|"
								);
								let imageBanner = document.createElement("input");
								imageBanner.id = "embed-image-banner";
								imageBanner.type = "checkbox";
								imageBanner.className = KSS.createClassName(
									"|checkboxEnabled| |value checkbox|"
								);
								imageBannerWrapper.oninput = () => {
									if (imageBanner.checked) {
										imageBannerWrapper.className = KSS.createClassName(
											"|flexChild| |switchEnabled| |switch| |valueChecked| |valueUnchecked value| |sizeDefault| |value size| |themeDefault|"
										);
									} else {
										imageBannerWrapper.className = KSS.createClassName(
											"|flexChild| |switchEnabled| |switch| |valueUnchecked| |valueUnchecked value| |sizeDefault| |value size| |themeDefault|"
										);
									}
									this.validateInputs();
									this.updatePreview();
								};
								imageBannerWrapper.appendChild(imageBanner);

								embedInputs.appendChild(providerName);
								embedInputs.appendChild(providerURL);
								embedInputs.appendChild(authorName);
								embedInputs.appendChild(authorURL);
								embedInputs.appendChild(title);
								embedInputs.appendChild(description);
								embedInputs.appendChild(imageURL);
								embedInputs.appendChild(color);
								embedInputs.appendChild(imageBannerWrapper);

								let embedPreview = document.createElement("div");
								embedPreview.id = "embed-preview";

								let embedWrapper = document.createElement("div");
								embedWrapper.id = "embed-preview-wrapper";
								embedWrapper.className = KSS.createClassName(
									"|embedWrapper| embedFull-2tM8-- |spoilerAttachment embed| |markup|"
								);
								embedWrapper.style = "border-color: rgb(30, 35, 39);";

								let embedGrid = document.createElement("div");
								embedGrid.className = KSS.createClassName("|spoilerAttachment grid|");

								let embedProvider = document.createElement("a");
								embedProvider.id = "embed-preview-provider";
								embedProvider.className = KSS.createClassName(
									"|anchorUnderlineOnHover anchor| |anchorUnderlineOnHover| |embedLink| |embedProvider| |embedMargin|"
								);
								embedProvider.target = "_blank";
								embedProvider.style.display = "none";

								let embedAuthor = document.createElement("a");
								embedAuthor.id = "embed-preview-author";
								embedAuthor.className = KSS.createClassName(
									"|embedAuthorNameLink| |embedAuthorName| |embedAuthor| |embedMargin|"
								);
								embedAuthor.target = "_blank";
								embedAuthor.style.display = "none";

								let embedTitle = document.createElement("a");
								embedTitle.id = "embed-preview-title";
								embedTitle.className = KSS.createClassName(
									"|embedTitle| |embedMargin|"
								);
								embedTitle.target = "_blank";
								embedTitle.href = "http://em.kyza.net/";
								embedTitle.style.display = "none";

								let embedDescription = document.createElement("div");
								embedDescription.id = "embed-preview-description";
								embedDescription.className = KSS.createClassName(
									"|embedDescription| |embedMargin|"
								);
								embedDescription.style.display = "none";

								let embedImage = document.createElement("div");
								embedImage.id = "embed-preview-image";
								embedImage.style = "width: 400px; height: 225px;";
								embedImage.style.display = "none";

								embedGrid.appendChild(embedProvider);
								embedGrid.appendChild(embedAuthor);
								embedGrid.appendChild(embedTitle);
								embedGrid.appendChild(embedDescription);
								embedGrid.appendChild(embedImage);
								embedWrapper.appendChild(embedGrid);
								embedPreview.appendChild(embedWrapper);

								let embedButtons = document.createElement("div");
								embedButtons.id = "embed-buttons";

								let sendButton = document.createElement("button");
								sendButton.id = "embed-send-button";
								sendButton.disabled = "true";
								sendButton.className = KSS.createClassName(
									"|button| |lookFilled| |colorGreen| |disabledButtonOverlay sizeLarge| |grow|"
								);
								let sendButtonInner = document.createElement("div");
								sendButtonInner.className = KSS.createClassName("|contents|");
								sendButtonInner.textContent = "Send Embed";
								sendButton.onclick = () => {
									this.sendEmbed();
								};

								let appendButton = document.createElement("button");
								appendButton.id = "embed-append-button";
								appendButton.disabled = "true";
								appendButton.className = KSS.createClassName(
									"|button| |lookFilled| |colorBrand| |disabledButtonOverlay sizeLarge| |grow|"
								);
								let appendButtonInner = document.createElement("div");
								appendButtonInner.className = KSS.createClassName("|contents|");
								appendButtonInner.textContent = "Append To Message";
								appendButton.onclick = () => {
									this.appendEmbed();
								};

								let cancelButton = document.createElement("button");
								cancelButton.id = "embed-cancel-button";
								cancelButton.className = KSS.createClassName(
									"|button| |lookFilled| |colorRed| |disabledButtonOverlay sizeLarge| |grow|"
								);
								let cancelButtonInner = document.createElement("div");
								cancelButtonInner.className = KSS.createClassName("|contents|");
								cancelButtonInner.textContent = "Cancel";
								cancelButton.onclick = () => {
									this.closePopup();
								};

								sendButton.appendChild(sendButtonInner);
								appendButton.appendChild(appendButtonInner);
								cancelButton.appendChild(cancelButtonInner);

								embedButtons.appendChild(sendButton);
								embedButtons.appendChild(appendButton);
								embedButtons.appendChild(cancelButton);

								embedPopup.appendChild(embedInputs);
								embedPopup.appendChild(embedPreview);
								embedPopup.appendChild(embedButtons);

								layerContainer.appendChild(embedPopup);
							}
						}

						removePopup() {
							try {
								document.querySelector("#embed-creator").remove();
							} catch (e) {}
						}

						openPopup() {
							if (!document.querySelector("#embed-creator")) {
								this.createPopup();
							}
							document.querySelector(
								"#embed-creator"
							).className = document
								.querySelector("#embed-creator")
								.className.replace("closed", "open");
						}

						closePopup() {
							try {
								document.querySelector(
									"#embed-creator"
								).className = document
									.querySelector("#embed-creator")
									.className.replace("open", "closed");
								setTimeout(this.enableButtons, 4e3);
							} catch (e) {}
						}

						removeButton() {
							try {
								document.querySelector("#embed-button-wrapper").remove();
							} catch (e) {}
						}

						validateInputs() {
							let providerName = document.querySelector("#embed-provider-name");
							let providerURL = document.querySelector("#embed-provider-url");
							let authorName = document.querySelector("#embed-author-name");
							let authorURL = document.querySelector("#embed-author-url");
							let title = document.querySelector("#embed-title");
							let description = document.querySelector("#embed-description");
							let imageURL = document.querySelector("#embed-image-url");
							let imageBanner = document.querySelector("#embed-image-banner");

							let sendButton = document.querySelector("#embed-send-button");
							let appendButton = document.querySelector("#embed-append-button");
							let cancelButton = document.querySelector("#embed-cancel-button");

							let enableSending = true;

							if (
								imageBanner.checked &&
								authorName.value.length == 0 &&
								imageURL.value.length > 0
							) {
								enableSending = false;
								if (
									authorName.className.indexOf(
										KSS.createClassName("|errorMessage error|")
									) < 0
								) {
									authorName.className +=
										" " + KSS.createClassName("|errorMessage error|");
								}
							} else {
								authorName.className = authorName.className
									.replace(KSS.createClassName("|errorMessage error|"), "")
									.trim();
							}

							if (
								providerName.value.length == 0 &&
								authorName.value.length == 0 &&
								title.value.length == 0 &&
								description.value.length == 0
							) {
								enableSending = false;
							}

							if (enableSending) {
								sendButton.removeAttribute("disabled");
								appendButton.removeAttribute("disabled");
							} else {
								sendButton.disabled = "true";
								appendButton.disabled = "true";
							}
						}

						updatePreview() {
							let providerName = document.querySelector("#embed-provider-name");
							let providerURL = document.querySelector("#embed-provider-url");
							let authorName = document.querySelector("#embed-author-name");
							let authorURL = document.querySelector("#embed-author-url");
							let title = document.querySelector("#embed-title");
							let description = document.querySelector("#embed-description");
							let color = document.querySelector("#embed-color");
							let imageURL = document.querySelector("#embed-image-url");
							let imageBanner = document.querySelector("#embed-image-banner");

							let embedWrapper = document.querySelector("#embed-preview-wrapper");
							let embedProvider = document.querySelector("#embed-preview-provider");
							let embedAuthor = document.querySelector("#embed-preview-author");
							let embedTitle = document.querySelector("#embed-preview-title");
							let embedDescription = document.querySelector(
								"#embed-preview-description"
							);
							let embedImage = document.querySelector("#embed-preview-image");

							embedWrapper.style.borderColor =
								color.value == "#000000" ? "rgb(30, 35, 39)" : color.value;

							if (providerName.value.trim().length == 0) {
								embedProvider.style.display = "none";
							} else {
								embedProvider.textContent = providerName.value;
								embedProvider.removeAttribute("style");
							}

							if (providerURL.value.trim().length == 0) {
								embedProvider.removeAttribute("href");
							} else {
								embedProvider.href = providerURL.value;
							}

							if (authorName.value.trim().length == 0) {
								embedAuthor.style.display = "none";
							} else {
								embedAuthor.textContent = authorName.value;
								embedAuthor.style.display = "";
							}

							if (authorURL.value.trim().length == 0) {
								embedAuthor.removeAttribute("href");
							} else {
								embedAuthor.href = authorURL.value;
							}

							if (title.value.length == 0) {
								embedTitle.style.display = "none";
							} else {
								embedTitle.textContent = title.value;
								embedTitle.style.display = "";
							}

							if (description.value.length == 0) {
								embedDescription.style.display = "none";
							} else {
								embedDescription.textContent = description.value;
								embedDescription.style.display = "";
							}

							if (imageURL.value.length == 0 || !this.validURL(imageURL.value)) {
								embedImage.style.display = "none";
							} else {
								if (imageBanner.checked) {
									embedWrapper.style.maxWidth = "436px";
									embedImage.className = KSS.createClassName(
										"|imageWrapper| |embedWrapper| |embedMedia| |embedImage|"
									);
								} else {
									embedImage.className = KSS.createClassName(
										"|imageWrapper| |embedThumbnail|"
									);
								}

								let img = new Image();

								var addImage = () => {
									let imageWidth = img.width;
									let imageHeight = img.height;
									var imageScale = Math.min(
										(imageBanner.checked ? 400 : 80) / imageWidth,
										(imageBanner.checked ? 400 : 80) / imageHeight
									);
									let scaledImageWidth =
										imageScale >= 1 ? imageWidth : imageWidth * imageScale;
									let scaledImageHeight =
										imageScale >= 1 ? imageHeight : imageHeight * imageScale;

									embedImage.style.width = scaledImageWidth + "px";
									embedImage.style.height = scaledImageHeight + "px";

									embedImage.innerHTML = `<img src="${imageURL.value}" style="width: ${scaledImageWidth}px; height: ${scaledImageHeight}px;">`;
									embedImage.style.display = "";
								};

								img.onload = function() {
									addImage();
								};
								img.onerror = function() {
									Toasts.warning(
										"Couldn't load the image preview. Are you sure this is an image?"
									);
								};

								img.src = imageURL.value;
							}
						}

						validURL(str) {
							var pattern = new RegExp(
								"^(https?:\\/\\/)?" + // protocol
								"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
								"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
								"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
								"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
									"(\\#[-a-z\\d_]*)?$",
								"i"
							); // fragment locator
							return !!pattern.test(str);
						}
					};
				};
				return plugin(Plugin, Api);
		  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
