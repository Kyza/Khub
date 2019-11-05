//META{"name":"TheSwitchening","displayName":"TheSwitchening","website":"https://khub.kyza.gq/?plugin=TheSwitchening","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/TheSwitchening/TheSwitchening.plugin.js"}*//

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

var TheSwitchening = (() => {
  const config = {
    info: {
      name: "!TheSwitchening",
      authors: [
        {
          name: "Kyza",
          discord_id: "220584715265114113",
          github_username: "KyzaGitHub"
        }
      ],
      version: "1.0.0",
      description: "Switch accounts with ease.",
      github:
        "https://github.com/KyzaGitHub/Khub/tree/master/Plugins/TheSwitchening",
      github_raw:
        "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/TheSwitchening/TheSwitchening.plugin.js"
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
      //   items: ["The button shows up when switching channels now."]
      // }
      // 	    ,
      {
        title: "Improvements",
        type: "improved",
        items: ["Made the plugin exist."]
      }
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

          var clearSettingsInterval;

          return class TheSwitchening extends Plugin {
            onStart() {
              PluginUpdater.checkForUpdate(
                this.getName(),
                this.getVersion(),
                "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/TheSwitchening/TheSwitchening.plugin.js"
              );
              // this.clearAccounts();
              this.patch();
            }

            onStop() {
              this.unpatch();
            }

            onSwitch() {}

            getSettingsPanel() {
              let accounts = this.getAccounts();

              let accountOptions = [
                {
                  type: "category",
                  id: "addAccount",
                  name: "Add Account",
                  collapsible: true,
                  shown: true,
                  settings: [
                    {
                      type: "switch",
                      id: "addCurrentAccount",
                      name: "Add Current Account",
                      note:
                        "Turn this switch on to add the current account. Turn this switch off to remove the current account.",
                      value: true
                    },
                    {
                      type: "textbox",
                      id: "addAccountToken",
                      name: "Add Account By Token",
                      note:
                        "Paste the account token you want to add here. This will log you into the account to test the token.",
                      value: ""
                    }
                  ]
                }
              ];

              let isCurrentAccount = false;

              for (let i = 0; i < Object.keys(accounts).length; i++) {
                if (accounts[Object.keys(accounts)[i]].id) {
                  if (
                    accounts[Object.keys(accounts)[i]].id ==
                    DiscordAPI.currentUser.id
                  ) {
                    isCurrentAccount = true;
                  }

                  accountOptions[i + 1] = {
                    type: "category",
                    id: Object.keys(accounts)[i],
                    name: accounts[Object.keys(accounts)[i]].name,
                    collapsible: true,
                    shown: true,
                    settings: [
                      {
                        type: "switch",
                        id: "login",
                        name: "Login",
                        note: `Turn this switch on to log into this account. Turn this switch off to log out of this account.`,
                        value: true
                      },
                      {
                        type: "switch",
                        id: "remove",
                        name: "Remove",
                        note: `Turn this switch on to remove this account from the list.`,
                        value: false
                      }
                    ]
                  };
                }
              }

              let accountSettings = {
                addAccount: {
                  addCurrentAccount: isCurrentAccount
                }
              };

              for (let i = 0; i < Object.keys(accounts).length; i++) {
                accountSettings[`${Object.keys(accounts)[i]}`] = {
                  login:
                    accounts[Object.keys(accounts)[i]].id ==
                    DiscordAPI.currentUser.id,
                  remove: false
                };
              }

              this._config.defaultConfig = accountOptions;

              this.settings = accountSettings;

              const panel = this.buildSettingsPanel();

              panel.addListener((group, id, value) => {
                var waitToReopen = false;

                if (group == "addAccount" && id == "addCurrentAccount") {
                  if (value) {
                    waitToReopen = true;
                    this.addAccount(
                      WebpackModules.getByProps("getToken").getToken()
                    );
                  } else {
                    this.removeAccount(DiscordAPI.currentUser.id);
                  }
                } else if (group == "addAccount" && id == "addAccountToken") {
                  waitToReopen = true;

                  Toasts.info("Logging into the token. Please wait.");

                  let oldAccountID = DiscordAPI.currentUser.id;

                  this.loginToAccount(value);
                  let timesTested = 0;
                  let testingInterval = setInterval(() => {
                    if (timesTested > 10) {
                      Toasts.error(
                        "There was an error logging into the token."
                      );
                      clearInterval(testingInterval);
                      return;
                    }

                    if (DiscordAPI.currentUser) {
                      this.addAccount(value);
                      clearInterval(testingInterval);
                      return;
                    }

                    timesTested++;
                  }, 1000);
                } else if (id == "login") {
                  if (value) {
                    this.loginToAccount(group, "");
                  } else {
                    ZLibrary.WebpackModules.getByProps("logout").logout();
                  }
                } else if (id == "remove" && value) {
                  this.removeAccount(this.getAccounts()[group].id);
                }

                // "Refresh" the settings.
                try {
                  document
                    .querySelector(`[id="plugin-settings-${this.getName()}"]`)
                    .parentElement.firstChild.click();
                } catch (e) {}
                if (!waitToReopen) {
                  try {
                    setTimeout(() => {
                      document
                        .querySelector(
                          `[data-name="${this.getName()}"] .bda-settings-button`
                        )
                        .click();
                    }, 100);
                  } catch (e) {}
                }
              });
              return panel.getElement();
            }

            patch() {}

            unpatch() {
              Patcher.unpatchAll();
            }

            getAccountProfile(token, id) {
              let url = `https://discordapp.com/api/v6/users/${id}/profile`;
              return $.ajax({
                url: url,
                headers: {
                  authorization: token
                }
              });
            }

            loginToAccount(token) {
              WebpackModules.getByProps("loginToken").loginToken(token);
            }

            getAccounts() {
              return PluginUtilities.loadData(this.getName(), "accounts", {});
            }

            addAccount(token) {
              let accounts = this.getAccounts();

              if (!accounts[token] || accounts[token] == null) {
                Toasts.info("Fetching the account info. Please wait.");
                this.getAccountProfile(
                  WebpackModules.getByProps("getToken").getToken(),
                  DiscordAPI.currentUser.id
                )
                  .done((res) => {
                    accounts[token] = {
                      id: res.user.id,
                      name: res.user.username + "#" + res.user.discriminator
                    };
                    PluginUtilities.saveData(
                      this.getName(),
                      "accounts",
                      accounts
                    );

                    // "Refresh" the settings.
                    try {
                      document
                        .querySelector(
                          `[id="plugin-settings-${this.getName()}"]`
                        )
                        .parentElement.firstChild.click();
                    } catch (e) {}
                    try {
                      setTimeout(() => {
                        document
                          .querySelector(
                            `[data-name="${this.getName()}"] .bda-settings-button`
                          )
                          .click();
                      }, 100);
                    } catch (e) {}

                    Toasts.success("Added account successfully!");
                  })
                  .fail((e) => {
                    console.error(e);
                    Toasts.error(
                      "There was an error fetching the account info."
                    );
                  });
              } else {
                Toasts.error("This account has already been added.");
              }
            }

            removeAccount(id) {
              let accounts = this.getAccounts();

              let didDelete = false;

              for (let i = 0; i < Object.keys(accounts).length; i++) {
                let account = accounts[Object.keys(accounts)[i]];

                if (account.id == id) {
                  delete accounts[Object.keys(accounts)[i]];
                  didDelete = true;
                }
              }

              PluginUtilities.saveData(this.getName(), "accounts", accounts);

              if (didDelete) {
                Toasts.success("Removed account!");
              } else {
                Toasts.error("This account has already been removed.");
              }
            }

            clearAccounts() {
              PluginUtilities.saveData(this.getName(), "accounts", {});
              this.saveSettings();
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
