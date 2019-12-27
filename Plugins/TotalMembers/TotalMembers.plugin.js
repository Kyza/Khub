//META{"name":"TotalMembers","displayName":"TotalMembers","website":"https://khub.kyza.gq/?plugin=TotalMembers","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/TotalMembers/TotalMembers.plugin.js"}*//

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

var TotalMembers = (() => {
	const config = {
		info: {
			name: "TotalMembers",
			authors: [
				{
					name: "Kyza",
					discord_id: "220584715265114113",
					github_username: "KyzaGitHub"
				}
			],
			version: "1.0.3",
			description:
				"TotalMembers displays the total amount of members in a Discord server. A redux of MemberCount by Arashiryuu.",
			github:
				"https://github.com/KyzaGitHub/Khub/tree/master/Plugins/TotalMembers",
			github_raw:
				"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/TotalMembers/TotalMembers.plugin.js"
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
						Patcher,
						Logger,
						PluginUpdater,
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

					var KSS = null;

					return class TotalMembers extends Plugin {
						onStart() {
							if (!window.KSSLibrary) {
								getLibraries_220584715265114113();
							}

							PluginUpdater.checkForUpdate(
								this.getName(),
								this.getVersion(),
								"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/TotalMembers/TotalMembers.plugin.js"
							);

							KSS = new KSSLibrary(this);

							this.addMemberTotal();
						}

						onStop() {
							this.removeMemberTotal();
						}

						observer({ addedNodes }) {
							for (const node of addedNodes) {
								try {
									if (
										node.className.indexOf(KSS.parse("|membersWrap|").replace(".", "")) >
											-1 ||
										node.className.indexOf(KSS.parse("|chat|").replace(".", "")) > -1 ||
										node.className.indexOf(KSS.parse("|chatContent|").replace(".", "")) >
											-1
									) {
										this.addMemberTotal();
									}
								} catch (e) {}
							}
						}

						addMemberTotal() {
							if (!document.querySelector("#TotalMembers")) {
								let membersList = document.querySelector(KSS.parse("|members|"));
								if (!membersList) return;

								let totalMembers = document.createElement("div");
								totalMembers.id = "TotalMembers";
								totalMembers.className =
									KSS.parse("|membersGroup|").replace(".", "") + " container-2ax-kl";
								totalMembers.innerHTML =
									"Members—" + DiscordAPI.currentGuild.memberCount;

								membersList.insertBefore(totalMembers, membersList.firstChild);
							}
						}

						updateMemberTotal() {
							let memberTotal = document.querySelector("#MemberTotal");
							if (!memberTotal) {
								this.addMemberTotal();
								memberTotal = document.querySelector("#TotalMembers");
							}
							if (!memberTotal) {
								Toasts.error("Something went wrong.");
								return;
							}
						}

						removeMemberTotal() {
							try {
								document.querySelector("#TotalMembers").remove();
							} catch (e) {}
						}
					};
				};
				return plugin(Plugin, Api);
		  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
