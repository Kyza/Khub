//META{"name":"DarkDarkTheme","displayName":"DarkDarkTheme","website":"https://khub.kyza.gq/?plugin=DarkDarkTheme","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/DarkDarkTheme.plugin.js"}*//

/*@cc_on
@if (@_jscript)

// Offer to self-install for clueless users that try to run this directly.
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%/BetterDiscord/plugins");
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

var DarkDarkTheme = (() => {
	const config = {
		info: {
			name: "DarkDarkTheme",
			authors: [
				{
					name: "Kyza",
					discord_id: "220584715265114113",
					github_username: "KyzaGitHub"
				}
			],
			version: "3.3.7",
			description:
				"DarkDarkTheme v3. A theme in plugin form. The first KSS theme.",
			github:
				"https://github.com/KyzaGitHub/Khub/tree/master/Themes/DarkDarkTheme",
			github_raw:
				"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/DarkDarkTheme.plugin.js"
		},
		changelog: [
			// {
			// 	title: "New Stuff",
			// 	items: [
			// 		"Added codeblock language identifiers.",
			// 		"Combined the Fira Code font with the new setting."
			// 	]
			// }
			// ,
			// {
			//   title: "Bugs Squashed",
			//   type: "fixed",
			//   items: ["Fixed the theme not applying."]
			// }
			// ,
			{
				title: "Improvements",
				type: "improved",
				items: ["Added `KSS.dispose()`."]
			}
			// ,
			// {
			//   title: "On-going",
			//   type: "progress",
			//   items: ["Fixing the scrolling issues with the chat box."]
			// }
		],
		main: "index.js",
		defaultConfig: [
			{
				type: "category",
				id: "background",
				name: "Background",
				collapsible: true,
				shown: true,
				settings: [
					{
						type: "switch",
						id: "enabled",
						name: "Background",
						note: "Enable or disable the background.",
						value: false
					},
					{
						type: "textbox",
						id: "url",
						name: "Background",
						note:
							"What image to show as the background. Leave the field blank for none. It MUST BE A URL and NOT A FILE on your computer.",
						value: ""
					},
					{
						type: "dropdown",
						id: "blendMode",
						name: "Blend Mode",
						note: "What blend mode you want to use on the image.",
						defaultValue: "normal",
						options: [
							{
								label: "Normal",
								value: "normal"
							},
							{
								label: "Multiply",
								value: "multiply"
							},
							{
								label: "Screen",
								value: "Screen"
							},
							{
								label: "Overlay",
								value: "overlay"
							},
							{
								label: "Darken",
								value: "darken"
							},
							{
								label: "Lighten",
								value: "Lighten"
							},
							{
								label: "Color Dodge",
								value: "color-dodge"
							},
							{
								label: "Color Burn",
								value: "color-burn"
							},
							{
								label: "Hard Light",
								value: "hard-light"
							},
							{
								label: "Soft Light",
								value: "soft-light"
							},
							{
								label: "Difference",
								value: "difference"
							},
							{
								label: "Exclusion",
								value: "exclusion"
							},
							{
								label: "Hue",
								value: "hue"
							},
							{
								label: "Saturation",
								value: "saturation"
							},
							{
								label: "Color",
								value: "color"
							},
							{
								label: "Luminosity",
								value: "luminosity"
							}
						]
					},
					{
						type: "slider",
						id: "opacity",
						name: "Opacity",
						note: "The opacity of the background.",
						value: 10,
						minValue: 0,
						maxValue: 100,
						markers: [
							0,
							5,
							10,
							15,
							20,
							25,
							30,
							35,
							40,
							45,
							50,
							55,
							60,
							65,
							70,
							75,
							80,
							85,
							90,
							95
						],
						stickToMarkers: true
					}
				]
			},
			{
				type: "category",
				id: "ui",
				name: "UI Changes",
				collapsible: true,
				shown: true,
				settings: [
					{
						type: "switch",
						id: "messages",
						name: "Animated Messages",
						note: "Enable or disable the animated messages.",
						value: true
					},
					{
						type: "switch",
						id: "listbuttons",
						name: "Channel List/Members List",
						note: "Enable or disable the channel list and member list changes.",
						value: true
					},
					{
						type: "switch",
						id: "chatbox",
						name: "Channel Textarea",
						note: "Enable or disable the large channel textarea.",
						value: true
					},
					{
						type: "switch",
						id: "codeblocks",
						name: "Codeblocks",
						note: "Enable or disable the codeblock changes.",
						value: true
					},
					{
						type: "switch",
						id: "smalldmbuttons",
						name: "Small DM Buttons",
						note: "Enable or disable the small DM buttons.",
						value: true
					}
				]
			}
		]
	};

	return !global.ZeresPluginLibrary || !window.KSSLibrary
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
														href:
															"https://github.com/KyzaGitHub/Khub/tree/master/Libraries/KSS",
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
				start() {}
				stop() {}
		  }
		: (([Plugin, Api]) => {
				const plugin = (Plugin, Api) => {
					const {
						Patcher,
						PluginUpdater,
						PluginUtilities,
						DiscordModules,
						DiscordAPI
					} = Api;

					var languageMap = BdApi.findModule((a) => a.getLanguage && a.listLanguages)
						.listLanguages()
						.reduce(function(b, c) {
							return Object.assign(
								b,
								b[c]
									? {
											[c]: []
												.concat(
													[c],
													BdApi.findModule(
														(a) => a.getLanguage && a.listLanguages
													).getLanguage(c).aliases || []
												)
												.filter((d) => !!d)
									  }
									: {
											[c]: Array.from(
												new Set(
													[].concat(
														[c],
														b[c],
														BdApi.findModule(
															(a) => a.getLanguage && a.listLanguages
														).getLanguage(c).aliases || []
													)
												)
											).filter((d) => !!d)
									  }
							);
						}, {});

					var languageKeys = Object.keys(languageMap);

					var KSS = null;

					var scrollPosition = 0;

					return class DarkDarkTheme extends Plugin {
						onStart() {
							PluginUpdater.checkForUpdate(
								"DarkDarkTheme",
								this.getVersion(),
								"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/DarkDarkTheme.plugin.js"
							);

							KSS = new KSSLibrary(this);

							KSS.setSelector("backgroundURL", this.settings.background.url);
							KSS.setSelector(
								"backgroundBlendMode",
								this.settings.background.blendMode
							);
							if (this.settings.background.opacity > 0.9) {
								this.settings.background.opacity =
									this.settings.background.opacity / 100;
								if (this.settings.background.opacity > 0.9) {
									this.settings.background.opacity = 0.9;
								}
							}
							KSS.setSelector("backgroundOpacity", this.settings.background.opacity);

							this.patch();
							this.updateCSS();
						}

						onStop() {
							this.removeIdentifications();
							this.unpatch();
							KSS.dispose();
						}

						observer({ addedNodes }) {
							if (KSS) {
								for (const node of addedNodes) {
									if (
										node.className == KSS.getSelector("chat") &&
										this.settings.ui.codeblocks
									) {
										this.identifyCodeblocks();
									}
								}
							}
						}

						getSettingsPanel() {
							const panel = this.buildSettingsPanel();
							panel.addListener((group, id, value) => {
								try {
									KSS.removeSelector("backgroundURL");
									KSS.removeSelector("backgroundBlendMode");
									KSS.removeSelector("backgroundOpacity");
								} catch (e) {}
								KSS.setSelector("backgroundURL", this.settings.background.url);
								if (this.settings.background.opacity > 0.9) {
									this.settings.background.opacity =
										this.settings.background.opacity / 100;
									if (this.settings.background.opacity > 0.9) {
										this.settings.background.opacity = 0.9;
									}
								}
								KSS.setSelector(
									"backgroundBlendMode",
									this.settings.background.blendMode
								);
								KSS.setSelector("backgroundOpacity", this.settings.background.opacity);

								this.removeCSS();
								this.updateCSS();
							});
							return panel.getElement();
						}

						patch() {
							Patcher.after(
								DiscordModules.Dispatcher,
								"dirtyDispatch",
								(thisObject, methodArguments) => {
									const event = methodArguments[0];
									if (!event || !event.type || !DiscordAPI.currentChannel) return;

									// Subscribe to all the events needed.
									if (
										(event.type == "LOAD_MESSAGES_SUCCESS_CACHED" ||
											(event.type.indexOf("MESSAGE_CREATE") > -1 &&
												event.channelId == DiscordAPI.currentChannel.id) ||
											event.type == "UPDATE_CHANNEL_DIMENSIONS") &&
										this.settings.ui.codeblocks
									) {
										this.identifyCodeblocks();
									}
								}
							);
							Patcher.before(DiscordModules.MessageActions, "endEditMessage", () => {
								let scroller = document.querySelector(
									KSS.parse("|messagesWrapper| |themedWithTrack scroller|")
								);
								scrollPosition = scroller.scrollHeight - scroller.scrollTop;
							});
							Patcher.after(DiscordModules.MessageActions, "endEditMessage", () => {
								// Hijack scrolling for one second in intervals of 100ms.
								// This seems to work the best.
								for (let i = 0; i < 10; i++) {
									setTimeout(() => {
										let scroller = document.querySelector(
											KSS.parse("|messagesWrapper| |themedWithTrack scroller|")
										);
										scroller.scrollTop = scroller.scrollHeight - scrollPosition;
									}, 100 * i);
								}
							});
						}

						unpatch() {
							Patcher.unpatchAll();
						}

						updateCSS() {
							// KSS.downloadStylesheet(
							//   "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/ThemeUtilities/ProfileEffects.kss"
							// ).then((kss) => {
							//   KSS.setModule(
							//     "profile-effects",
							//     kss,
							//     "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/ThemeUtilities/ProfileEffects.kss"
							//   );
							// });
							KSS.downloadStylesheet(
								"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/branding.kss"
							).then((kss) => {
								KSS.setModule(
									"branding",
									kss,
									"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/branding.kss"
								);
							});

							KSS.downloadStylesheet(
								"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/colors.kss"
							).then((kss) => {
								KSS.setModule(
									"colors",
									kss,
									"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/colors.kss"
								);
							});

							if (this.settings.background.enabled) {
								KSS.downloadStylesheet(
									"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/ThemeUtilities/background.kss"
								).then((kss) => {
									KSS.setModule(
										"background",
										kss,
										"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/ThemeUtilities/background.kss"
									);
								});
							}

							if (this.settings.ui.codeblocks) {
								KSS.downloadStylesheet(
									"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/codeblocks.kss"
								).then((kss) => {
									KSS.setModule(
										"codeblocks",
										kss,
										"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/codeblocks.kss"
									);
								});
								this.identifyCodeblocks();
							}
							if (this.settings.ui.smalldmbuttons) {
								KSS.downloadStylesheet(
									"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/smalldmbuttons.kss"
								).then((kss) => {
									KSS.setModule(
										"smalldmbuttons",
										kss,
										"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/smalldmbuttons.kss"
									);
								});
							}
							if (this.settings.ui.listbuttons) {
								KSS.downloadStylesheet(
									"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/listbuttons.kss"
								).then((kss) => {
									KSS.setModule(
										"listbuttons",
										kss,
										"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/listbuttons.kss"
									);
								});
							}
							if (this.settings.ui.messages) {
								KSS.downloadStylesheet(
									"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/messages.kss"
								).then((kss) => {
									KSS.setModule(
										"messages",
										kss,
										"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/messages.kss"
									);
								});
							}
							if (this.settings.ui.chatbox) {
								KSS.downloadStylesheet(
									"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/chatbox.kss"
								).then((kss) => {
									KSS.setModule(
										"chatbox",
										kss,
										"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/chatbox.kss"
									);
								});
							}
						}

						removeCSS() {
							KSS.disposeAllModules();
						}

						seedColor(s) {
							return Math.floor(
								Math.abs(
									Math.sin(
										s.split("").reduce(function(a, b) {
											a = (a << 5) - a + b.charCodeAt(0);
											return a & a;
										}, 0)
									) * 16777215
								) % 16777215
							).toString(16);
						}

						/**
						 * `languageMap` By CompletelyUnbelievable#3231
						 */
						getLanguageName(alias) {
							let language = { name: null, formatted: null };
							for (let i = 0; i < languageKeys.length; i++) {
								let lan = languageKeys[i];
								if (languageMap[lan].indexOf(alias.toLowerCase()) > -1) {
									language = { name: lan, formatted: false };
									break;
								}
							}

							switch (language.name) {
								case "apache":
									language = { name: "Apache", formatted: true };
									break;
								case "bash":
									language = { name: "Bash", formatted: true };
									break;
								case "dos":
									language = { name: "Batch", formatted: true };
									break;
								case "brainfuck":
									language = { name: "Brainfuck", formatted: true };
									break;
								case "coffeescript":
									language = { name: "CoffeeScript", formatted: true };
									break;
								case "C":
									language = { name: "C", formatted: true };
									break;
								case "cpp":
									language = { name: "C++", formatted: true };
									break;
								case "cs":
									language = { name: "C#", formatted: true };
									break;
								case "css":
									language = { name: "Cascading Style Sheets [CSS]", formatted: true };
									break;
								case "diff":
									language = { name: "Diff", formatted: true };
									break;
								case "go":
									language = { name: "Go", formatted: true };
									break;
								case "http":
									language = { name: "Hypertext Transfer Protocol", formatted: true };
									break;
								case "ini":
									language = { name: "Initialization [INI]", formatted: true };
									break;
								case "java":
									language = { name: "Java", formatted: true };
									break;
								case "javascript":
									language = { name: "JavaScript", formatted: true };
									break;
								case "json":
									language = {
										name: "JavaScript Object Notation [JSON]",
										formatted: true
									};
									break;
								case "kotlin":
									language = { name: "Kotlin", formatted: true };
									break;
								case "less":
									language = { name: "Leaner Style Sheets [LESS]", formatted: true };
									break;
								case "lua":
									language = { name: "Lua", formatted: true };
									break;
								case "makefile":
									language = { name: "Makefile", formatted: true };
									break;
								case "markdown":
									language = { name: "Markdown", formatted: true };
									break;
								case "Nginx":
									language = { name: "Nginx", formatted: true };
									break;
								case "objectivec":
									language = { name: "Objective-C", formatted: true };
									break;
								case "perl":
									language = { name: "Perl", formatted: true };
									break;
								case "php":
									language = { name: "PHP: Hypertext Preprocessor", formatted: true };
									break;
								case "plaintext":
									language = { name: "Plaintext", formatted: true };
									break;
								case "python":
									language = { name: "Python", formatted: true };
									break;
								case "Ruby":
									language = { name: "Ruby", formatted: true };
									break;
								case "Rust":
									language = { name: "Rust", formatted: true };
									break;
								case "sass":
									language = {
										name: "Syntactically Awesome Stylesheets [SASS]",
										formatted: true
									};
									break;
								case "scss":
									language = {
										name: "Sassy Cascading Stylesheets [SCSS]",
										formatted: true
									};
									break;
								case "shell":
									language = { name: "Shell Session", formatted: true };
									break;
								case "sql":
									language = {
										name: "Structured Query Language [SQL]",
										formatted: true
									};
									break;
								case "swift":
									language = { name: "Swift", formatted: true };
									break;
								case "typescript":
									language = { name: "TypeScript", formatted: true };
									break;
								case "html":
									language = {
										name: "Hypertext Markup Language [HTML]",
										formatted: true
									};
									break;
								case "xml":
									language = { name: "Extensible Markup Language", formatted: true };
									break;
								case "yaml":
									language = { name: "YAML Ain't Markup Language", formatted: true };
									break;
								default:
									break;
							}
							return language;
						}

						identifyCodeblocks() {
							let codeblocks = document.querySelectorAll("code.hljs");
							for (let i = 0; i < codeblocks.length; i++) {
								let codeblock = codeblocks[i];
								if (!codeblock.parentElement.querySelector(".codeblock-identifier")) {
									let identifier = document.createElement("div");
									let language = codeblock.className.substr(
										codeblock.className.indexOf("hljs ") + 5
									);
									let finalLanguage = this.getLanguageName(language);

									if (finalLanguage.name) {
										identifier.className = `codeblock-identifier${
											finalLanguage.formatted ? " formatted" : " unformatted"
										}`;
										identifier.style.color = `#${this.seedColor(finalLanguage.name)}`;

										identifier.textContent = finalLanguage.name;

										codeblock.parentElement.insertBefore(identifier, codeblock);
									}
								}
							}
						}

						removeIdentifications() {
							let identifiers = document.querySelectorAll(".codeblock-identifier");
							for (let i = 0; i < identifiers.length; i++) {
								identifiers[i].remove();
							}
						}
					};
				};
				return plugin(Plugin, Api);
		  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
