//META{"name":"DarkDarkTheme","displayName":"DarkDarkTheme","website":"https://khub.kyza.gq/?plugin=DarkDarkTheme","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/DarkDarkTheme/DarkDarkTheme.plugin.js"}*//

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
      version: "3.0.0",
      description: "DarkDarkTheme v3. A theme in plugin form.",
      github:
        "https://github.com/KyzaGitHub/Khub/tree/master/Plugins/DarkDarkTheme",
      github_raw:
        "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/DarkDarkTheme/DarkDarkTheme.plugin.js"
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

          return class DarkDarkTheme extends Plugin {
            onStart() {
              updateInterval = setInterval(() => {
                PluginUpdater.checkForUpdate(
                  "DarkDarkTheme",
                  this.getVersion(),
                  "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/DarkDarkTheme/DarkDarkTheme.plugin.js"
                );
              }, 5000);

              this.patch();
              this.updateCSS();
            }

            onStop() {
              this.unpatch();
              this.removeIntervals();
              this.removeCSS();
            }

            removeIntervals() {
              clearInterval(updateInterval);
            }

            observer({ addedNodes }) {
              for (const node of addedNodes) {
                if (node.className == selectors.chat) {
                }
              }
            }

            patch() {
              // // Zerebos' godly fix for some strange bug.
              // Patcher.before(
              //   Storer.prototype,
              //   "remove",
              //   (thisObject, [messageId]) => {
              //     const message = thisObject.get(messageId);
              //     console.log("Might be a ghostping: ", message);
              //     if (
              //       message.mentioned &&
              //       !message.blocked &&
              //       message.author.id != userID
              //     ) {
              //       console.log("It is a ghostping!".toUpperCase());
              //       this.addGhostPing(message);
              //     }
              //   }
              // );
            }

            unpatch() {
              Patcher.unpatchAll();
            }

            updateCSS() {
              // Later in onStart().
              var colors = `
  /* START: Variables */
  /* Theme Variables */
  * {
    --dark-1: #070707;
    --dark0: #0d0d0d;
    --dark1: #111;
    --dark2: #131313;
    --dark3: #161616;
    --dark4: #1a1a1a;
    --dark5: #1f1f1f;
    --dark6: #222;
    --dark7: #2a2a2a;
    --dark-blue: #53639e;
    --dark-green: #30825d;
    --dark-yellow: #b58900;
    --dark-orange: #cb4b16;
    --dark-red: #c63f3f;
  }
  
  /* Dark Theme Variables */
  .theme-dark {
    --header-primary: #ccc;
    --header-secondary: #b9bbbe;
    --text-normal: #aaa;
    --text-muted: #72767d;
    --text-link: #00b0f4;
    --channels-default: #8e9297;
    --interactive-normal: #aaa;
    --interactive-hover: #bbb;
    --interactive-active: #ccc;
    --interactive-muted: #4f545c;
    --background-primary: var(--dark4);
    --background-secondary: var(--dark3);
    --background-tertiary: var(--dark1);
    --background-accent: var(--dark7);
    --background-floating: var(--dark1);
    --background-modifier-hover: rgba(79, 84, 92, 0.16);
    --background-modifier-active: rgba(79, 84, 92, 0.24);
    --background-modifier-selected: rgba(79, 84, 92, 0.32);
    --background-modifier-accent: hsla(0, 0%, 100%, 0.06);
    --elevation-low: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05),
      0 2px 0 rgba(4, 4, 5, 0.05);
    --elevation-high: 0 8px 16px rgba(0, 0, 0, 0.24);
    --guild-header-text-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);
    --channeltextarea-background: var(--dark2);
    --activity-card-background: var(--dark2);
    --deprecated-panel-background: var(--dark2);
    --deprecated-card-bg: rgba(32, 34, 37, 0.6);
    --deprecated-card-editable-bg: rgba(32, 34, 37, 0.3);
    --deprecated-store-bg: var(--dark4);
    --deprecated-quickswitcher-input-background: var(--dark1);
    --deprecated-quickswitcher-input-placeholder: hsla(0, 0%, 100%, 0.3);
    --deprecated-text-input-bg: rgba(0, 0, 0, 0.1);
    --deprecated-text-input-border: rgba(0, 0, 0, 0.3);
    --deprecated-text-input-border-hover: #040405;
    --deprecated-text-input-border-disabled: #202225;
    --deprecated-text-input-prefix: #dcddde;
  }
  /* STOP: Variables */
  
  
  
  /* START: Branding */
  li[data-name="DarkDarkTheme"] .bda-version:after {
    content: "2.1.2";
  }
  
  /* Titlebar */
  .platform-win |titleBar|:after {
    content: "v2.1.2 by Kyza#9994" !important;
    font-size: 14px !important;
    color: #999 !important;
    text-align: center !important;
    width: 100% !important;
  }
  
  /* Changelog */
  li[data-name="DarkDarkTheme"] .bda-description:after {
    content: "\A\AWhat's new in 2.1.2?\A\A Enabled the UI changes.\A@me if you find something broken!\A By the way, codeblocks now have a special font made just for code!\A Fixed the message edit box width.\A Added an icon to my profile picture.\A Fixed MemberCount.";
    white-space: pre;
  }
  
  /* Remove Workmark */
  svg[name="DiscordWordmark"] {
    width: 250%;
    transform: scale(0.9);
    background-image: url("https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/DarkDarkThemeLogo.png");
    background-size: contain;
    background-position: left;
    background-repeat: no-repeat;
  }
  
  svg[name="DiscordWordmark"] > path {
    display: none;
  }
  /* STOP: Branding */
  
  
  
  /* START: Scrollbars */
  .theme-dark #app-mount ::-webkit-scrollbar-track-piece {
    border-radius: 0px;
    background-color: transparent !important;
    border-color: transparent !important;
  }
  
  .theme-dark #app-mount ::-webkit-scrollbar-track {
    border-radius: 0px;
    background-color: transparent !important;
    border-color: transparent !important;
  }
  
  .theme-dark #app-mount ::-webkit-scrollbar-thumb {
    background-color: #2a2a2a !important;
    border-color: transparent !important;
  }
  /* STOP: Scrollbars */
  
  
  
  /* START: Titlebars */
  /* Main Titlebar */
  .theme-dark #app-mount {
    background-color: var(--dark0);
  }
  
  /* Server Titlebar */
  .theme-dark |serverTitleBar| {
    background-color: var(--dark2);
  }
  
  /* Channel Titlebar */
  .theme-dark |channelTitleBar| {
    background-color: var(--dark2) !important;
  }
  
  /* Search Bar */
  .theme-dark |searchBar| {
    background-color: var(--dark1);
  }
  /* STOP: Titlebars */
  
  
  
  /* START: Chat Box */
  /* Autocomplete Above Textarea */
  .theme-dark |autocomplete| {
    background-color: var(--dark2);
  }
  
  /* Autocomplete Selected */
  .theme-dark |autocompleteRow| |autocompleteSelectorSelected| {
    background-color: var(--dark4);
  }
  /* STOP: Chat Box */
  
  
  
  /* START: Emoji Picker */
  /* Top Tabs */
  /* Fixing BD's screwed up CSS. */
  .theme-dark #bda-qem button {
    margin: 0px !important;
    box-shadow: none;
    border: 1px solid hsla(0, 0%, 74.9%, 0.2);
  }
  
  .theme-dark #bda-qem {
    border: none !important;
    padding: 0px !important;
  }
  
  .theme-dark #bda-qem,
  .theme-dark #bda-qem > * {
    background-color: var(--dark2) !important;
    color: var(--header-primary) !important;
  }
  
  /* Main Panel */
  .theme-dark |emojiPicker| {
    background-color: var(--dark3);
  }
  
  /* Frequently Used */
  .theme-dark |category| {
    background-color: var(--dark3);
  }
  
  /* Search Bar */
  .theme-dark |emojiSearchBar| {
    background-color: var(--dark4);
  }
  
  /* Twitch Panel */
  .theme-dark #bda-qem-twitch-container {
    background-color: var(--dark3);
  }
  
  /* Favorite Panel */
  .theme-dark #bda-qem-favourite-container {
    background-color: var(--dark3);
  }
  
  .theme-dark |emojiItem||emojiItemSelected| {
    background-color: var(--dark7) !important;
  }
  
  .theme-dark |categories| |emojiItemItem| {
    filter: brightness(60%);
  }
  /* STOP: Emoji Picker */
  
                `.trim();

              for (const selector in selectors) {
                colors = colors.replaceAll(
                  `|${selector}|`,
                  (selectors[selector].value
                    ? selectors[selector].value
                    : selectors[selector]
                  ).trim()
                );
                console.log(
                  (selectors[selector].value
                    ? selectors[selector].value
                    : selectors[selector]
                  ).trim()
                );
              }

              console.log(colors);

              BdApi.injectCSS("DarkDarkTheme-colors", colors);
            }

            removeCSS() {
              BdApi.clearCSS("DarkDarkTheme-colors");
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
