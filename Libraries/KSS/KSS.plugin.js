//META{"name":"KSS","displayName":"KSS","website":"","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/KSS.plugin.js"}*//

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

String.prototype.replaceAll = function(find, replace) {
  var str = this;
  return str.replace(
    new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),
    replace
  );
};

var KSS = (() => {
  const config = {
    info: {
      name: "KSS",
      authors: [
        {
          name: "Kyza",
          discord_id: "220584715265114113",
          github_username: "KyzaGitHub"
        }
      ],
      version: "0.0.1",
      description: "Easy CSS for BetterDiscord.",
      github: "https://github.com/KyzaGitHub/Khub/tree/master/Libraries/KSS",
      github_raw:
        "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/KSS.plugin.js"
    },
    changelog: [
      // {
      //   "title": "New Stuff",
      //   "items": ["Removed the Revenge Ping button."]
      // }
      // ,
      // {
      //   title: "Bugs Squashed",
      //   type: "fixed",
      //   items: [
      //     "The ghostping panel now shows up correctly on macOS and Linux."
      //   ]
      // },
      // {
      //   title: "Improvements",
      //   type: "improved",
      //   items: [
      //     "Moved the icon to the top right.",
      //     "Added an animation to the ghostping panel."
      //   ]
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
          const title = "Library Missing";
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
                        `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`
                      ]
                    })
                  ],
                  red: false,
                  confirmText: "Download Now",
                  cancelText: "Cancel",
                  onConfirm: () => {
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
            DiscordModules,
            Patcher,
            Logger,
            PluginUpdater,
            WebpackModules,
            DiscordAPI,
            DOMTools,
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

          var updateInterval;

          const selectors = {
            chat: new DOMTools.Selector(WebpackModules.getByProps("chat").chat),
            channelTextArea: `${new DOMTools.Selector(
              WebpackModules.getByProps("channelTextArea").channelTextArea
            )} > [class*="inner"]`,
            titleBar: new DOMTools.Selector(
              WebpackModules.getByProps("titleBar").titleBar
            ),
            searchBar: new DOMTools.Selector(
              WebpackModules.getByProps("searchBar").searchBar
            ),
            autocomplete: new DOMTools.Selector(
              ZLibrary.WebpackModules.getByProps("autocomplete").autocomplete
            ),
            autocompleteRow: new DOMTools.Selector(
              ZLibrary.WebpackModules.getByProps(
                "autocompleteRow"
              ).autocompleteRow
            ),
            autocompleteSelectorSelected: new DOMTools.Selector(
              ZLibrary.WebpackModules.getByProps(
                "autocomplete"
              ).selectorSelected
            ),
            channelTitleBar: `.title-3qD0b-`,
            serverTitleBar: `.container-2Rl01u.clickable-2ap7je`,
            emojiPicker: new DOMTools.Selector(
              WebpackModules.getByProps("emojiPicker").emojiPicker
            ),
            category: new DOMTools.Selector(
              WebpackModules.getByProps("category").category
            ),
            emojiSearchBar: `.inner-3ErfOT`,
            emojiItem: new DOMTools.Selector(
              WebpackModules.getByProps("emojiItem").emojiItem
            ),
            emojiItemSelected: new DOMTools.Selector(
              WebpackModules.getByProps("emojiItem").selected
            ),
            emojiItemCategories: new DOMTools.Selector(
              WebpackModules.getByProps("emojiItem").categories
            ),
            emojiItemItem: new DOMTools.Selector(
              WebpackModules.getByProps("emojiItem").item
            )
          };

          return class KSS extends Plugin {
            onStart() {
              updateInterval = setInterval(() => {
                PluginUpdater.checkForUpdate(
                  "KSS",
                  this.getVersion(),
                  "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/KSS.plugin.js"
                );
              }, 5000);
            }

            onStop() {
              this.removeIntervals();
            }

            removeIntervals() {
              clearInterval(updateInterval);
            }



            parse(kss) {
              for (const selector in selectors) {
                kss = kss.replaceAll(
                  `|${selector}|`,
                  (selectors[selector].value
                    ? selectors[selector].value
                    : selectors[selector]
                  ).trim()
                );
              }
              return kss;
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
