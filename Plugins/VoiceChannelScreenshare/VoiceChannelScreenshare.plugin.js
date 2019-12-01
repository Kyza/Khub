//META{"name":"VoiceChannelScreenshare","displayName":"VoiceChannelScreenshare","website":"https://khub.kyza.gq/?plugin=VoiceChannelScreenshare","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/VoiceChannelScreenshare/VoiceChannelScreenshare.plugin.js"}*//

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

var VoiceChannelScreenshare = (() => {
  const config = {
    info: {
      name: "VoiceChannelScreenshare",
      authors: [
        {
          name: "Kyza",
          discord_id: "220584715265114113",
          github_username: "KyzaGitHub"
        }
      ],
      version: "1.1.0",
      description:
        "VoiceChannelScreenshare displays the total amount of members in a Discord server. A redux of MemberCount by Arashiryuu. Styleable with #VoiceChannelScreenshare just like MemberCount.",
      github:
        "https://github.com/KyzaGitHub/Khub/tree/master/Plugins/VoiceChannelScreenshare",
      github_raw:
        "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/VoiceChannelScreenshare/VoiceChannelScreenshare.plugin.js"
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
      //     "The button shows up when switching channels now."
      //   ]
      // }
      // 	    ,
      {
        title: "Improvements",
        type: "improved",
        items: [
          "Fully rewritten.",
          "Added a button to copy the channel link so others can join you."
        ]
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
            DiscordModules,
            Patcher,
            Logger,
            PluginUpdater,
            WebpackModules,
            DiscordAPI,
            Toasts,
            ReactTools,
            ReactComponents
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

          var eventedChannels = [];

          return class VoiceChannelScreenshare extends Plugin {
            onStart() {
              PluginUpdater.checkForUpdate(
                this.getName(),
                this.getVersion(),
                "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/VoiceChannelScreenshare/VoiceChannelScreenshare.plugin.js"
              );

              KSS = new KSSLibrary(this);

              this.patch(true);
            }

            onStop() {
              this.unpatch();
            }

            observer({ addedNodes }) {
              for (const node of addedNodes) {
                try {
                  if (
                    node.className.indexOf(
                      KSS.createClassName("|containerDefault|")
                    ) > -1
                  ) {
                    this.patch();
                  }
                } catch (e) {}
              }
            }

            patch(disconnect = false) {
              this.unpatch();

              let channelElements = Array.prototype.slice.call(
                document.querySelectorAll(KSS.parse("|containerDefault|"))
              );

              let removeIndex = 0;

              for (let i = 0; i < channelElements.length; i++) {
                let channelElement = channelElements[i];
                let channelReactElement = ReactTools.getOwnerInstance(
                  channelElement
                );
                if (channelReactElement.props.channel.type == 2) {
                  if (disconnect && channelReactElement.props.connected) {
                    let leaveButton = document.querySelector(
                      `[name="Nova_CallLeave"]`
                    ).parentElement.parentElement;
                    leaveButton.click();
                  }

                  Patcher.after(
                    channelReactElement,
                    "handleVoiceConnect",
                    () => {
                      if (channelReactElement.props.connected) {
                        WebpackModules.getByProps(
                          "selectChannel"
                        ).selectChannel(
                          channelReactElement.props.guild.id,
                          channelReactElement.props.channel.id
                        );
                      }
                    }
                  );

                  let buttons = channelElement.querySelector(
                    KSS.parse("|notInteractive children|")
                  );

                  if (buttons) {
                    if (!buttons.querySelector(".vcs-copy-button")) {
                      let copyButton = document.createElement("div");
                      copyButton.className = KSS.createClassName(
                        "|iconItem| |iconBase| vcs-copy-button"
                      );
                      copyButton.setAttribute(
                        "aria-label",
                        "Copy Channel Link"
                      );

                      let copyIcon = document.createElement("svg");
                      copyIcon.className = KSS.createClassName("|actionIcon|");

                      copyButton.innerHTML = `<svg class="${KSS.createClassName(
                        "|actionIcon|"
                      )}" name="Link" width="16px" height="16px" viewBox="0 0 442.246 442.246"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M409.657,32.474c-43.146-43.146-113.832-43.146-156.978,0l-84.763,84.762c29.07-8.262,60.589-6.12,88.129,6.732    l44.063-44.064c17.136-17.136,44.982-17.136,62.118,0c17.136,17.136,17.136,44.982,0,62.118l-55.386,55.386l-36.414,36.414    c-17.136,17.136-44.982,17.136-62.119,0l-47.43,47.43c11.016,11.017,23.868,19.278,37.332,24.48    c36.415,14.382,78.643,8.874,110.467-16.219c3.06-2.447,6.426-5.201,9.18-8.262l57.222-57.222l34.578-34.578    C453.109,146.306,453.109,75.926,409.657,32.474z" /><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M184.135,320.114l-42.228,42.228c-17.136,17.137-44.982,17.137-62.118,0c-17.136-17.136-17.136-44.981,0-62.118    l91.8-91.799c17.136-17.136,44.982-17.136,62.119,0l47.43-47.43c-11.016-11.016-23.868-19.278-37.332-24.48    c-38.25-15.3-83.232-8.262-115.362,20.502c-1.53,1.224-3.06,2.754-4.284,3.978l-91.8,91.799    c-43.146,43.146-43.146,113.832,0,156.979c43.146,43.146,113.832,43.146,156.978,0l82.927-83.845    C230.035,335.719,220.243,334.496,184.135,320.114z" /></svg>`;

                      copyButton.onclick = () => {
                        WebpackModules.getByProps("copy").copy(
                          `<https://discordapp.com/channels/${channelReactElement.props.guild.id}/${channelReactElement.props.channel.id}>`
                        );
                        Toasts.success("Channel link copied!");
                      };

                      !buttons.firstChild
                        ? buttons.appendChild(copyButton)
                        : buttons.insertBefore(copyButton, buttons.firstChild);
                    }
                  }
                }
              }
            }

            unpatch() {
              Patcher.unpatchAll();
              let copyButtons = document.querySelectorAll(".vcs-copy-button");
              for (let i = 0; i < copyButtons.length; i++) {
                copyButtons[i].remove();
              }
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
