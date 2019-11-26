//META{"name":"TypingSounds","displayName":"TypingSounds","website":"https://khub.kyza.gq/?plugin=TypingSounds","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/TypingSounds/TypingSounds.plugin.js"}*//

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

var TypingSounds = (() => {
  const config = {
    info: {
      name: "TypingSounds",
      authors: [
        {
          name: "Kyza",
          discord_id: "220584715265114113",
          github_username: "KyzaGitHub"
        }
      ],
      version: "1.1.0",
      description: "Become Sans Undertale. A redux of \"typingsound\" or \"Osu Sounds for Rai\" by Jiiks.",
      github:
        "https://github.com/KyzaGitHub/Khub/tree/master/Plugins/TypingSounds",
      github_raw:
        "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/TypingSounds/TypingSounds.plugin.js"
    },
    changelog: [
      // {
      //   title: "New Stuff",
      //   items: ["made the plugin exist."]
      // },
      // {
      //   title: "Bugs Squashed",
      //   type: "fixed",
      //   items: ["The button shows up when switching channels now."]
      // }
      // 	    ,
      {
        title: "Improvements",
        type: "improved",
        items: ["The plugin now works on all chat boxes."]
      }
      //	,
      // {
      //   title: "On-going",
      //   type: "progress",
      //   items: ["Only works with the main chat box so far."]
      // }
    ],
    main: "index.js",
    defaultConfig: [
      {
        type: "category",
        id: "sound",
        name: "Sound",
        collapsible: false,
        shown: true,
        settings: [
          {
            type: "textbox",
            id: "file",
            name: "Sound File",
            note: "The path to the sound file.",
            value: ""
          },
          {
            type: "slider",
            id: "volume",
            name: "Volume",
            note: "How loudly to play the sound.",
            value: 100,
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
              95,
              100
            ],
            stickToMarkers: true
          }
        ]
      },
      {
        type: "category",
        id: "echo",
        name: "Echo",
        collapsible: false,
        shown: true,
        settings: [
          {
            type: "switch",
            id: "enabled",
            name: "Use Echo",
            note: "Whether or not to echo the typing sound.",
            value: true
          },
          {
            type: "slider",
            id: "delay",
            name: "Echo Delay",
            note:
              "How much delay before playing the echo sound. This is in 10ths of a second.",
            value: 100,
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
              95,
              100
            ],
            stickToMarkers: true
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
            Toasts,
            DOMTools
          } = Api;

          const {
            MessageStore,
            UserStore,
            ImageResolver,
            ChannelStore,
            GuildStore,
            Dispatcher
          } = DiscordModules;

          var audioURL = "";

          var audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();

          return class TypingSounds extends Plugin {
            onStart() {
              ZLibrary.PluginUpdater.checkForUpdate(
                "TypingSounds",
                this.getVersion(),
                "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/TypingSounds/TypingSounds.plugin.js"
              );

              this.patch();
              this.readAudio(this.settings.sound.file);
              this.addTypingEvent();
            }

            onStop() {
              this.unpatch();
              this.removeTypingEvent();
            }

            onSwitch() {
              this.readySounds();
              this.addTypingEvent();
            }

            getSettingsPanel() {
              const panel = this.buildSettingsPanel();
              panel.addListener((group, id, value) => {
                try {
                  this.readAudio(this.settings.sound.file);
                  if (group == "sound" && id == "file") {
                    Toasts.success(this.getName() + ": Loaded the audio file.");
                  }
                  this.playSound();
                } catch (e) {
                  Toasts.error(
                    this.getName() + ": Couldn't find your audio file."
                  );
                }
              });
              return panel.getElement();
            }

            patch() {}

            unpatch() {
              Patcher.unpatchAll();
            }

            readAudio(filePath) {
              try {
                var fs = require("fs");
                var buffer = fs.readFileSync(filePath);

                var blob = new Blob([buffer], { type: "audio/wav" });
                var url = window.URL.createObjectURL(blob);

                audioURL = url;
              } catch (e) {
                Toasts.error(
                  this.getName() + ": Couldn't find your audio file."
                );
              }
            }

            addTypingEvent() {
              var typingarea = document.querySelector("#app-mount");
              typingarea.onkeydown = () => {
                this.playSound();
              };
            }

            removeTypingEvent() {
              var typingarea = document.querySelector("#app-mount");
              typingarea.onkeydown = () => {};
            }

            playSound() {
              var audio = new Audio(audioURL);
              audio.volume = this.settings.sound.volume / 100;
              audio.onerror = () => {
                Toasts.error(
                  this.getName() + ": Couldn't find your audio file."
                );
              };
              audio.play();
              if (this.settings.echo.enabled) {
                setTimeout(() => {
                  audio = new Audio(audioURL);
                  audio.volume = this.settings.sound.volume / 100;
                  audio.onerror = () => {
                    Toasts.error(
                      this.getName() + ": Couldn't find your audio file."
                    );
                  };
                  audio.play();
                }, this.settings.echo.delay);
              }
            }

            readySounds() {
              var audio = new Audio(audioURL);
              audio.volume = 0;
              audio.onerror = () => {
                Toasts.error(
                  this.getName() + ": Couldn't find your audio file."
                );
              };
              audio.play();
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
