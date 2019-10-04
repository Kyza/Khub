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
      version: "3.0.19",
      description: "DarkDarkTheme v3. A theme in plugin form.",
      github:
        "https://github.com/KyzaGitHub/Khub/tree/master/Themes/DarkDarkTheme",
      github_raw:
        "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/DarkDarkTheme.plugin.js"
    },
    changelog: [
      {
        title: "New Stuff",
        items: [
          "Optional custom backgrounds! Yes, I know the slider is broken. I can't fix that. :'("
        ]
      },
      // ,
      // {
      //   title: "Bugs Squashed",
      //   type: "fixed",
      //   items: ["Fixed a weird error (hopefully). Reload your Discord."]
      // },
      // {
      //   title: "Improvements",
      //   type: "improved",
      //   items: [
      //     "Added profile effects for contributors."
      //   ]
      // },
      {
        title: "On-going",
        type: "progress",
        items: ["Moving V2 elements to V3."]
      }
    ],
    main: "index.js",
    defaultConfig: [
      {
        type: "category",
        id: "modules",
        name: "Modules",
        collapsible: false,
        shown: true,
        settings: [
          {
            type: "switch",
            id: "background",
            name: "Background",
            note: "Enable or disable the background.",
            value: ""
          },
          {
            type: "switch",
            id: "ui",
            name: "UI Changes",
            note: "Enable or disable the UI changes.",
            value: true
          }
        ]
      },
      {
        type: "category",
        id: "background",
        name: "Background",
        collapsible: false,
        shown: true,
        settings: [
          {
            type: "textbox",
            id: "url",
            name: "Background",
            note:
              "Which image to show as the background. Leave the field blank for none. It MUST BE A URL and NOT A FILE on your computer.",
            value: ""
          },
          {
            type: "slider",
            id: "opacity",
            name: "Opacity",
            note: "The opacity of the background.",
            value: 0.1,
            minValue: 0.1,
            maxValue: 0.9,
            options: {
              markers: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
              stickToMarkers: true
            }
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
          const { Patcher, PluginUpdater, PluginUtilities } = Api;

          var KSS = null;

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
                "backgroundOpacity",
                this.settings.background.opacity
              );

              this.patch();
              this.updateCSS();
            }

            onStop() {
              this.unpatch();
              this.removeCSS();
            }

            observer({ addedNodes }) {
              if (KSS) {
                for (const node of addedNodes) {
                  if (node.className == KSS.getSelector("chat")) {
                    var effects = {
                      creator: ["220584715265114113"],
                      contributor: ["239513071272329217"]
                    };

                    var effectKeys = Object.keys(effects);
                    for (let i = 0; i < effectKeys.length; i++) {
                      let effectUser = effects[effectKeys[i]];
                      let effect = effectKeys[i];

                      var userPfps = document.querySelectorAll(
                        `img[src*="avatars/${effectUser}"]`
                      );
                      for (let userPfp of userPfps) {
                        while (userPfp.tagName.toLowerCase() != "div") {
                          userPfp = userPfp.parentNode;
                        }
                        // console.log(userPfp);
                        userPfp.setAttribute("kyza-effect", effect);
                      }
                    }
                  }
                }
              }
            }

            getSettingsPanel() {
              const panel = this.buildSettingsPanel();
              panel.addListener((group, id, value) => {
                try {
                  KSS.removeSelector("backgroundURL");
                  KSS.removeSelector("backgroundOpacity");
                } catch (e) {}
                KSS.setSelector("backgroundURL", this.settings.background.url);
                if (this.settings.background.opacity > 0.9) {
                  this.settings.background.opacity =
                    this.settings.background.opacity / 100;
                }
                KSS.setSelector(
                  "backgroundOpacity",
                  this.settings.background.opacity
                );

                this.removeCSS();
                this.updateCSS();
              });
              return panel.getElement();
            }

            patch() {}

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

              if (this.settings.modules.background) {
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

              if (this.settings.modules.ui) {
                KSS.downloadStylesheet(
                  "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/ui.kss"
                ).then((kss) => {
                  KSS.setModule(
                    "ui",
                    kss,
                    "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/ui.kss"
                  );
                });
              }
            }

            removeCSS() {
              // KSS.disposeModule("profile-effects");
              try {
                KSS.disposeModule("branding");
              } catch (e) {}
              try {
                KSS.disposeModule("colors");
              } catch (e) {}
              try {
                KSS.disposeModule("ui");
              } catch (e) {}
              try {
                KSS.disposeModule("background");
              } catch (e) {}
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
