//META{"name":"YouTubePopouts","displayName":"YouTubePopouts","website":"https://khub.kyza.gq/?plugin=YouTubePopouts","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/YouTubePopouts/YouTubePopouts.plugin.js"}*//

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

var YouTubePopouts = (() => {
	const config = {
		info: {
			name: "YouTubePopouts",
			authors: [
				{
					name: "Kyza",
					discord_id: "220584715265114113",
					github_username: "KyzaGitHub"
				}
			],
			version: "1.1.2",
			description:
				"Allows you to open a popout version of YouTube videos that persist across channels.\nA redux of detTube by Megamit/Mitchell.",
			github:
				"https://github.com/KyzaGitHub/Khub/tree/master/Plugins/YouTubePopouts",
			github_raw:
				"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/YouTubePopouts/YouTubePopouts.plugin.js"
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
		main: "index.js",
		defaultConfig: [
			{
				type: "category",
				id: "popout",
				name: "popout",
				collapsible: false,
				shown: true,
				settings: [
					{
						type: "switch",
						id: "externalWindow",
						name: "External Window",
						note:
							"Open the popout as an external window. This is slower, but you can drag it outside of Discord.",
						value: ""
					}
				]
			}
		]
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
						Patcher,
						Logger,
						PluginUpdater,
						PluginUtilities,
						WebpackModules,
						DiscordAPI,
						Toasts
					} = Api;

					const {
						MessageStore,
						UserStore,
						ImageResolver,
						ChannelStore,
						GuildStore,
						Dispatcher
					} = DiscordModules;

					const { remote } = require("electron");

					var KSS = null;

					var draggedOnTitlebar = false;

					var useExternalWindow = false;

					var youtubeWindow = null;

					return class YouTubePopouts extends Plugin {
						onStart() {
							if (!window.KSSLibrary) {
								getLibraries_220584715265114113();
							}

							PluginUpdater.checkForUpdate(
								this.getName(),
								this.getVersion(),
								"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/YouTubePopouts/YouTubePopouts.plugin.js"
							);

							useExternalWindow = this.settings.popout.externalWindow;
							KSS = new KSSLibrary(this);
							this.createVideoPlayer();
							this.injectCSS();
							this.patch();
						}

						onStop() {
							this.removeVideoPlayer();
							this.removeCSS();
							this.unpatch();
						}
						patch() {
							Patcher.after(
								Dispatcher,
								"dirtyDispatch",
								(thisObject, methodArguments) => {
									const event = methodArguments[0];
									if (!event || !event.type || !DiscordAPI.currentChannel) return;

									// Subscribe to all the events needed.
									// These events will be used to add the popout buttons to the DOM.
									if (
										event.type == "CHANNEL_SELECT" ||
										event.type == "LOAD_MESSAGES_SUCCESS_CACHED" ||
										(event.type.indexOf("MESSAGE") > -1 &&
											event.channelId == DiscordAPI.currentChannel.id) ||
										event.type == "UPDATE_CHANNEL_DIMENSIONS"
									) {
										this.addButtons();
									}
								}
							);
						}

						unpatch() {
							Patcher.unpatchAll();
						}

						injectCSS() {
							KSS.setModule(
								"button",
								`
                :root {
                  --youtube-popouts-button-size: 24px;
                }
                .youtube-popouts-button {
                  display: inline-block;
                  padding-left: 5px;
                  width: var(--youtube-popouts-button-size) !important;
                  background-image: url("https://image.flaticon.com/icons/svg/1907/1907464.svg");
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: contain;
                  transition-duration: 0.4s;
                  filter: invert(50%);
                  user-select: none;
                }
                .youtube-popouts-button:hover {
                  cursor: pointer;
                }
                .theme-dark .youtube-popouts-button:hover {
                  filter: invert(100%);
                }
                .theme-light .youtube-popouts-button:hover {
                  filter: invert(0%);
                }
                `
							);
							KSS.setModule(
								"video-player",
								`
                :root {
                  --youtube-popouts-titlebar-height: 22px;
                }
                #youtube-popouts-wrapper {
                  position: absolute;
                  width: 480px;
                  height: calc(270px + var(--youtube-popouts-titlebar-height));
                  background-color: #111;
                  box-shadow: 0px 0px 10px 0px black;
                  user-select: none;
                  z-index: 2147483647 !important;
                }
                #youtube-popouts-titlebar {
                  position: absolute;
                  top: 0px;
                  left: 0px;
                  width: calc(100% - 10px);
                  height: var(--youtube-popouts-titlebar-height);
                  padding-left: 10px;
                  line-height: var(--youtube-popouts-titlebar-height);
                  color: white;
                  user-select: none;
                }
                #youtube-popouts-titlebar-close {
                  position: absolute;
                  top: 0px;
                  right: 0px;
                  width: var(--youtube-popouts-titlebar-height);
                  height: var(--youtube-popouts-titlebar-height);
                  background-color: rgba(255, 0, 0, 0.6);
                  user-select: none;
                  transition-duration: 0.4s;
                }
                #youtube-popouts-titlebar-close:hover {
                  background-color: red;
                }
                #youtube-popouts-video-player {
                  position: absolute;
                  top: var(--youtube-popouts-titlebar-height);
                  left: 0px;
                  width: 480px;
                  height: 270px;
                  background-color: transparent;
                  user-select: none;
                  background-image: url("https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336");
                  background-position: center;
                  background-size: cover;
                  background-repeat: no-repeat;
                }
                #youtube-popouts-iframe-blocker {
                  position: absolute;
                  top: var(--youtube-popouts-titlebar-height);
                  left: 0px;
                  width: 480px;
                  height: 270px;
                  user-select: none;
                  background-color: transparent;
                }
                `
							);
						}

						removeCSS() {
							try {
								KSS.disposeModule("button");
							} catch (e) {}
							try {
								KSS.disposeModule("video-player");
							} catch (e) {}
						}

						getSettingsPanel() {
							const panel = this.buildSettingsPanel();
							panel.addListener((group, id, value) => {
								if (group == "popout" && id == "externalWindow") {
									useExternalWindow = value;
								}
							});
							return panel.getElement();
						}

						insertAfter(el, referenceNode) {
							referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
						}

						isYouTubeLink(url) {
							return /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(\?\S*)?$/gi.test(
								url
							);
						}

						addButtons() {
							let links = document.querySelectorAll("a");

							for (let i = 0; i < links.length; i++) {
								let link = links[i];

								// Validate that the link is a YouTube video link.
								if (
									this.isYouTubeLink(link.href.trim()) &&
									link.className
										.trim()
										.indexOf(
											KSS.parse("|anchorUnderlineOnHover anchor|").replace(/\./g, "")
										) > -1 &&
									link.href.trim() == link.innerHTML.trim()
								) {
									this.createButton(link);
								}
							}
						}

						createButton(link) {
							if (
								!link.nextSibling ||
								link.nextSibling.className != "youtube-popouts-button"
							) {
								let button = document.createElement("span");
								// Using a space here to size the height correctly.
								button.innerHTML = " ";
								button.className = "youtube-popouts-button";

								button.onclick = () => {
									this.changeVideo(link.href);
								};

								this.insertAfter(button, link);
							}
						}

						getYouTubeVideoID(url) {
							var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
							var match = url.match(regExp);
							return match && match[1].length == 11 ? match[1] : false;
						}

						getURLParameters(url) {
							var vars = {};
							var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
								m,
								key,
								value
							) {
								vars[key] = value;
							});
							return vars;
						}

						changeVideo(url) {
							if (useExternalWindow) {
								var file =
									"data:text/html;charset=UTF-8," +
									encodeURIComponent(
										this.buildWindow({
											url: this.generateFullscreenURL(url)
										})
									);
								if (youtubeWindow) {
									youtubeWindow.loadURL(file);
								} else {
									youtubeWindow = new remote.BrowserWindow({
										width: 480,
										height: 292,
										frame: false,
										show: false,
										title: "YouTube - Kyza#9994",
										alwaysOnTop: true
									});
									youtubeWindow.once("closed", () => {
										youtubeWindow = null;
									});
									youtubeWindow.once("ready-to-show", () => {
										youtubeWindow.show();
									});

									youtubeWindow.loadURL(file);
								}
							} else {
								if (!document.querySelector("#youtube-popouts-wrapper")) {
									this.createVideoPlayer();
								}
								this.showVideoPlayer();

								document.querySelector(
									"#youtube-popouts-video-player"
								).src = this.generateFullscreenURL(url);
							}
						}

						buildWindow(options) {
							let wrapper = document.createElement("div");
							wrapper.id = "youtube-popouts-wrapper";
							wrapper.style.top = "0px";
							wrapper.style.left = "0px";

							let titlebar = document.createElement("div");
							titlebar.id = "youtube-popouts-titlebar";
							titlebar.textContent = "YouTube - Kyza#9994";

							titlebar.onmousedown = this.initDrag;
							document.onmousemove = this.popoutDrag;
							document.onmouseup = this.endDrag;

							let titlebarClose = document.createElement("div");
							titlebarClose.id = "youtube-popouts-titlebar-close";

							titlebarClose.onclick = this.hideVideoPlayer;

							let videoPlayer = document.createElement("iframe");
							videoPlayer.id = "youtube-popouts-video-player";
							videoPlayer.setAttribute("allowfullscreen", "");
							videoPlayer.src = options.url;

							titlebar.appendChild(titlebarClose);

							wrapper.appendChild(titlebar);
							wrapper.appendChild(videoPlayer);

							return (
								`
              <style>
              @font-face {
                font-family: "Whitney Medium";
                src: url("https://discordapp.com/assets/e8acd7d9bf6207f99350ca9f9e23b168.woff");
              }
              :root {
                --youtube-popouts-titlebar-height: 22px;
              }
              body {
                margin: 0px !important;
                overflow: hidden !important;
                background-color: #111;
                font-family: "Whitney Medium" !important;
              }
              #youtube-popouts-wrapper {
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: #111;
                box-shadow: 0px 0px 10px 0px black;
                user-select: none;
                z-index: 2147483647 !important;
              }
              #youtube-popouts-titlebar {
                position: absolute;
                top: 0px;
                left: 0px;
                width: calc(100% - 10px);
                height: var(--youtube-popouts-titlebar-height);
                padding-left: 10px;
                line-height: var(--youtube-popouts-titlebar-height);
                color: white;
                user-select: none;
                -webkit-app-region: drag;
              }
              #youtube-popouts-titlebar-close {
                position: absolute;
                top: 0px;
                right: 0px;
                width: var(--youtube-popouts-titlebar-height);
                height: var(--youtube-popouts-titlebar-height);
                background-color: rgba(255, 0, 0, 0.6);
                user-select: none;
                transition-duration: 0.4s;
                -webkit-app-region: none;
              }
              #youtube-popouts-titlebar-close:hover {
                background-color: red;
              }
              #youtube-popouts-video-player {
                position: absolute;
                top: var(--youtube-popouts-titlebar-height);
                left: 0px;
                width: 100%;
                height: calc(100% - var(--youtube-popouts-titlebar-height));
                background-color: transparent;
                user-select: none;
                background-image: url("https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336");
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                border: none;
              }
              </style>
              <script>
              window.onload = () => {
                document.querySelector("#youtube-popouts-titlebar-close").onclick = () => {
                  const remote = require("electron").remote;
                  remote.getCurrentWindow().close();
                };
              };
              </script>
              ` + wrapper.outerHTML
							);
						}

						generateFullscreenURL(url) {
							let parametersString = "";

							for (
								let i = 0;
								i < Object.keys(this.getURLParameters(url)).length;
								i++
							) {
								let parameter = Object.keys(this.getURLParameters(url))[i];
								let value = this.getURLParameters(url)[parameter];

								if (parameter != "watch") {
									if (parameter == "t") {
										parameter = "start";
									}

									parametersString += `&${parameter}=${value}`;
								}
							}

							return (
								"https://www.youtube.com/embed/" +
								this.getYouTubeVideoID(url) +
								"?autoplay=1" +
								parametersString
							);
						}

						createVideoPlayer() {
							let wrapper = document.createElement("div");
							wrapper.id = "youtube-popouts-wrapper";
							wrapper.style.top = "22px";
							wrapper.style.left = "0px";
							wrapper.style.display = "none";

							let titlebar = document.createElement("div");
							titlebar.id = "youtube-popouts-titlebar";
							titlebar.textContent = "YouTube - Kyza#9994";

							titlebar.onmousedown = this.initDrag;
							document.onmousemove = this.popoutDrag;
							document.onmouseup = this.endDrag;

							let titlebarClose = document.createElement("div");
							titlebarClose.id = "youtube-popouts-titlebar-close";

							titlebarClose.onclick = this.hideVideoPlayer;

							let videoPlayer = document.createElement("iframe");
							videoPlayer.id = "youtube-popouts-video-player";
							videoPlayer.setAttribute("allowfullscreen", "");

							let iframeBlocker = document.createElement("div");
							iframeBlocker.id = "youtube-popouts-iframe-blocker";
							iframeBlocker.style.display = "none";

							titlebar.appendChild(titlebarClose);

							wrapper.appendChild(titlebar);
							wrapper.appendChild(videoPlayer);
							wrapper.appendChild(iframeBlocker);

							document.body.appendChild(wrapper);
						}

						removeVideoPlayer() {
							try {
								document.querySelector("#youtube-popouts-wrapper").remove();
							} catch (e) {}
						}

						showVideoPlayer() {
							document.querySelector("#youtube-popouts-wrapper").style.display =
								"block";
						}

						hideVideoPlayer() {
							document.querySelector("#youtube-popouts-wrapper").style.display =
								"none";
							document.querySelector("#youtube-popouts-video-player").src = "";
						}

						initDrag(e) {
							if (e.buttons == 1) {
								document.querySelector(
									"#youtube-popouts-iframe-blocker"
								).style.display = "block";
								draggedOnTitlebar = true;
							}
						}

						endDrag(e) {
							document.querySelector("#youtube-popouts-iframe-blocker").style.display =
								"none";
							draggedOnTitlebar = false;
						}

						popoutDrag(e) {
							if (e.buttons == 1 && draggedOnTitlebar) {
								let wrapper = document.querySelector("#youtube-popouts-wrapper");

								let leftMovement = e.movementX;
								let topMovement = e.movementY;

								wrapper.style.top =
									parseInt(wrapper.style.top.replace("px", "")) + topMovement + "px";
								wrapper.style.left =
									parseInt(wrapper.style.left.replace("px", "")) + leftMovement + "px";

								// Boundaries...
								if (parseInt(wrapper.style.top.replace("px", "")) < 22) {
									wrapper.style.top = "22px";
								}
								if (parseInt(wrapper.style.left.replace("px", "")) < 0) {
									wrapper.style.left = "0px";
								}
								if (
									parseInt(wrapper.style.left.replace("px", "")) >
									document.querySelector("#app-mount").clientWidth - wrapper.clientWidth
								) {
									wrapper.style.left =
										document.querySelector("#app-mount").clientWidth -
										wrapper.clientWidth +
										"px";
								}
								if (
									parseInt(wrapper.style.top.replace("px", "")) >
									document.querySelector("#app-mount").clientHeight -
										wrapper.clientHeight
								) {
									wrapper.style.top =
										document.querySelector("#app-mount").clientHeight -
										wrapper.clientHeight +
										"px";
								}
							}
						}
					};
				};
				return plugin(Plugin, Api);
		  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
