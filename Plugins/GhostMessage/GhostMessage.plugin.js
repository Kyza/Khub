//META{"name":"GhostMessage","website":"https://khub.kyza.gq/?plugin=GhostMessage","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/GhostMessage/GhostMessage.plugin.js"}*//

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

String.prototype.replaceAll = function(find, replace) {
	var str = this;
	return str.replace(
		new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),
		replace
	);
};

var GhostMessage = (() => {
	const config = {
		info: {
			name: "GhostMessage",
			authors: [
				{
					name: "Kyza",
					discord_id: "220584715265114113",
					github_username: "KyzaGitHub"
				}
			],
			version: "1.3.3",
			description: "Send messages that delete themselves.",
			github:
				"https://github.com/KyzaGitHub/Khub/tree/master/Plugins/GhostMessage",
			github_raw:
				"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/GhostMessage/GhostMessage.plugin.js"
		},
		changelog: [
			{
				title: "Bugs Squashed",
				type: "fixed selectors",
				items: [
					"Adapted to recently changed selectors."
				]
			}
			// {
			//   "title": "New Stuff",
			//   "items": ["Removed the Revenge Ping button."]
			// }
			// ,
			//{
			//  title: "Bugs Squashed",
			//  type: "fixed",
			//  items: [
			//    "Fixed the plugin not asking to download KSSLibrary."
			//  ]
			//}
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
						Toasts,
						DiscordSelectors,
						DiscordClasses,
						PluginUpdater,
						DiscordModules,
						WebpackModules,
						Tooltip,
						Modals,
						ReactTools,
						ReactComponents,
						ContextMenu,
						Patcher,
						Settings,
						PluginUtilities,
						DiscordAPI,
						DOMTools,
						DiscordClassModules
					} = Api;

					const {
						MessageActions,
						Dispatcher,
						DiscordPermissions,
						ChannelStore,
						SimpleMarkdown
					} = DiscordModules;

					const selectors = {
						chat: WebpackModules.getByProps("chat").chat,
						chatContent: WebpackModules.getByProps("chatContent").chatContent
					};

					var updateInterval;

					var files = [];

					var enabled = false;

					var KSS = null;

					return class GhostMessage extends Plugin {
						onStart() {
							if (!window.KSSLibrary) {
								getLibraries_220584715265114113();
							}

							PluginUpdater.checkForUpdate(
								"GhostMessage",
								this.getVersion(),
								"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/GhostMessage/GhostMessage.plugin.js"
							);

							KSS = new KSSLibrary(this);

							this.addButton();

							this.patch();
						}

						patch() {
							// Patch when a normal message is sent.
							Patcher.after(
								DiscordModules.MessageActions,
								"sendMessage",
								(thisObject, methodArguments, returnValue) => {
									let channel = DiscordAPI.currentChannel;

									if (enabled) {
										returnValue.then((result) => {
											try {
												channel.messages
													.find((message) => {
														return message.id == result.body.id;
													})
													.delete();
											} catch (e) {
												DiscordAPI.currentChannel.sendBotMessage(
													"Failed to delete your message!\nDon't switch channels so fast, I couldn't catch where that message landed!"
												);
											}
										});
									}
								}
							);

							// Patch when an upload is sent.
							Patcher.before(
								WebpackModules.getByProps("instantBatchUpload"),
								"upload",
								(thisObject, methodArguments) => {
									if (enabled) {
										let channel = DiscordAPI.currentChannel;
										files.push({
											content: methodArguments[2].content,
											name: methodArguments[1].name
										});
									}
								}
							);

							// Patch when an instant batch upload is sent.
							Patcher.before(
								WebpackModules.getByProps("instantBatchUpload"),
								"instantBatchUpload",
								(thisObject, methodArguments) => {
									if (enabled) {
										let channel = DiscordAPI.currentChannel;
										for (const file of methodArguments[1]) {
											files.push({
												content: "",
												name: file.name
											});
										}
									}
								}
							);

							// Patch when an upload is sent.
							Patcher.after(
								Dispatcher,
								"dirtyDispatch",
								(thisObject, methodArguments) => {
									let event = methodArguments[0];
									let channel = DiscordAPI.currentChannel;

									if (event.type == "MESSAGE_CREATE") {
										for (const attachment of event.message.attachments) {
											let foundAttachment = files.find((file) => {
												return (
													file.name == attachment.filename &&
													file.content == methodArguments[0].message.content &&
													DiscordAPI.User.fromId(methodArguments[0].message.author.id).tag ==
														DiscordAPI.currentUser.tag
												);
											});

											// If it found the attachment...
											if (foundAttachment) {
												// Delete the message.
												let message = channel.messages.find((message) => {
													return message.id == methodArguments[0].message.id;
												});
												message.delete();
												// Make sure to remove the file.
												files.splice(files.indexOf(foundAttachment), 1);
											}
										}
									}
								}
							);
						}

						unpatch() {
							Patcher.unpatchAll();
						}

						onStop() {
							clearInterval(updateInterval);
							this.removeButton();
							this.unpatch();
							KSS.dispose();
						}

						observer({ addedNodes }) {
							for (const node of addedNodes) {
								if (
									node.className == selectors.chat ||
									node.className == selectors.chatContent
								) {
									if (enabled) {
										Toasts.info("GhostMessage: Disabled automatically.");
									}
									this.setEnabled(false);
									this.addButton();
								}
							}
						}

						addButton() {
							let channel = DiscordAPI.currentChannel;
							// console.log(channel);
							try {
								// Only add the button if the user has permissions to send messages and embed links.
								// DM check should go first so that the .checkPermissions() is not called.
								if (
									channel.type == "DM" ||
									channel.type == "GROUP_DM" ||
									channel.checkPermissions(DiscordPermissions.SEND_MESSAGES)
								) {
									if (
										document.getElementsByClassName("ghost-button-wrapper").length == 0
									) {
										var daButtons = document.querySelector(
											KSS.parse("|fontSize24Padding buttons|")
										);

										var ghostButton = document.createElement("button");
										ghostButton.setAttribute("type", "button");
										ghostButton.className = KSS.createClassName(
											"|active buttonWrapper| |button| |lookBlank| |colorBrand| |grow| ghost-button-wrapper"
										);

										var ghostButtonInner = document.createElement("div");
										ghostButtonInner.className = KSS.createClassName(
											"|contents| |pulseButton button| |fontSize24Padding button| ghost-button-inner"
										);

										//<img src="https://image.flaticon.com/icons/svg/24/24207.svg" width="224" height="224" alt="Embed free icon" title="Embed free icon">
										//<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="icon-3D60ES da-icon" viewBox="0 0 22 22" fill="currentColor"><path d="M 19.794, 3.299 H 9.765 L 8.797, 0 h -6.598 C 0.99, 0, 0, 0.99, 0, 2.199 V 16.495 c 0, 1.21, 0.99, 2.199, 2.199, 2.199 H 9.897 l 1.1, 3.299 H 19.794 c 1.21, 0, 2.199 -0.99, 2.199 -2.199 V 5.498 C 21.993, 4.289, 21.003, 3.299, 19.794, 3.299 z M 5.68, 13.839 c -2.48, 0 -4.492 -2.018 -4.492 -4.492 s 2.018 -4.492, 4.492 -4.492 c 1.144, 0, 2.183, 0.407, 3.008, 1.171 l 0.071, 0.071 l -1.342, 1.298 l -0.066 -0.06 c -0.313 -0.297 -0.858 -0.643 -1.671 -0.643 c -1.441, 0 -2.612, 1.193 -2.612, 2.661 c 0, 1.468, 1.171, 2.661, 2.612, 2.661 c 1.507, 0, 2.161 -0.962, 2.337 -1.606 h -2.43 v -1.704 h 4.344 l 0.016, 0.077 c 0.044, 0.231, 0.06, 0.434, 0.06, 0.665 C 10.001, 12.036, 8.225, 13.839, 5.68, 13.839 z M 11.739, 9.979 h 4.393 c 0, 0 -0.374, 1.446 -1.715, 3.008 c -0.588 -0.676 -0.995 -1.336 -1.254 -1.864 h -1.089 L 11.739, 9.979 z M 13.625, 13.839 l -0.588, 0.583 l -0.72 -2.452 C 12.685, 12.63, 13.13, 13.262, 13.625, 13.839 z M 20.893, 19.794 c 0, 0.605 -0.495, 1.1 -1.1, 1.1 H 12.096 l 2.199 -2.199 l -0.896 -3.041 l 1.012 -1.012 l 2.953, 2.953 l 0.803 -0.803 l -2.975 -2.953 c 0.99 -1.138, 1.759 -2.474, 2.106 -3.854 h 1.397 V 8.841 H 14.697 v -1.144 h -1.144 v 1.144 H 11.398 l -1.309 -4.443 H 19.794 c 0.605, 0, 1.1, 0.495, 1.1, 1.1 V 19.794 z"></path></svg>

										var ghostButtonMask = document.createElementNS(
											"http://www.w3.org/2000/svg",
											"svg"
										);
										ghostButtonMask.setAttribute("width", "18");
										ghostButtonMask.setAttribute("height", "18");
										ghostButtonMask.setAttribute("viewBox", "0 0 450.002 450.002");
										ghostButtonMask.setAttribute("class", "icon-3D60ES");

										var ghostButtonIcon = document.createElementNS(
											"http://www.w3.org/2000/svg",
											"path"
										);
										ghostButtonIcon.setAttribute("fill", "currentColor");
										ghostButtonIcon.setAttribute("fill-rule", "evenodd");
										ghostButtonIcon.setAttribute("clip-rule", "evenodd");
										ghostButtonIcon.setAttribute(
											"d",
											"M411.972,204.367c0-118.248-83.808-204.777-186.943-204.365C121.896-0.41,38.001,86.119,38.001,204.367L38.373,441  l62.386-29.716l62.382,38.717l62.212-38.716l62.215,38.718l62.213-38.714l62.221,29.722L411.972,204.367z M143.727,258.801  c-27.585-6.457-44.713-34.053-38.256-61.638l99.894,23.383C198.908,248.13,171.312,265.258,143.727,258.801z M306.276,258.801  c-27.585,6.457-55.181-10.671-61.638-38.256l99.894-23.383C350.988,224.748,333.861,252.344,306.276,258.801z"
										);

										ghostButtonMask.appendChild(ghostButtonIcon);
										ghostButtonInner.appendChild(ghostButtonMask);
										ghostButton.appendChild(ghostButtonInner);
										daButtons.insertBefore(ghostButton, daButtons.firstChild);

										ghostButton.onclick = () => {
											var channel = DiscordAPI.currentChannel;

											// Only send the embed if the user has permissions to embed links.
											if (
												channel.type === "DM" ||
												channel.type == "GROUP_DM" ||
												channel.checkPermissions(DiscordPermissions.SEND_MESSAGES)
											) {
												this.setEnabled(!enabled);
											} else {
												BdApi.alert(
													"GhostMessage",
													`You do not have permission to send messages in this channel.<br><br>This is <strong><u>not</u></strong> a problem with the plugin, it is a <strong><u>server setting</u></strong>.`
												);
												this.removeButton();
											}
										};
									}
								} else {
									this.removeButton();
								}
							} catch (e) {}
							this.setEnabled(enabled);
						}

						removeButton() {
							if (document.getElementsByClassName("ghost-button-wrapper").length > 0) {
								document.getElementsByClassName("ghost-button-wrapper")[0].remove();
								this.setEnabled(false);
							}
						}

						setEnabled(set) {
							enabled = set;

							// Make the ghost button stay selected if it is clicked on.
							var ghostInner = document.getElementsByClassName(
								"ghost-button-inner"
							)[0];
							if (ghostInner && ghostInner.children[0] && enabled) {
								ghostInner.setAttribute("style", "filter: contrast(2);");
								ghostInner.children[0].setAttribute("style", "transform: scale(1.2)");
							} else if (ghostInner && ghostInner.children[0] && !enabled) {
								ghostInner.setAttribute("style", "");
								ghostInner.children[0].setAttribute("style", "");
							}
						}

						FireEvent(element, eventName) {
							if (element != null) {
								const mouseoverEvent = new Event(eventName);
								element.dispatchEvent(mouseoverEvent);
							}
						}
					};
				};
				return plugin(Plugin, Api);
		  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
