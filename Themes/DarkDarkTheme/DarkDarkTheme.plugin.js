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
      version: "3.3.0",
      description:
        "DarkDarkTheme v3. A theme in plugin form. The first KSS theme.",
      github:
        "https://github.com/KyzaGitHub/Khub/tree/master/Themes/DarkDarkTheme",
      github_raw:
        "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/DarkDarkTheme/DarkDarkTheme.plugin.js"
    },
    changelog: [
      {
        title: "New Stuff",
        items: [
          "Added codeblock language identifiers.",
          "Combined the Fira Code font with the new setting."
        ]
      }
      // ,
      // {
      //   title: "Bugs Squashed",
      //   type: "fixed",
      //   items: ["Fixed the theme not applying."]
      // }
      // ,
      // {
      //   title: "Improvements",
      //   type: "improved",
      //   items: ["Added toggling for all of the different UI changes."]
      // },
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
          const { Patcher, PluginUpdater, PluginUtilities, DiscordModules } = Api;

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
                KSS.setSelector(
                  "backgroundOpacity",
                  this.settings.background.opacity
                );

                this.removeCSS();
                this.updateCSS();
              });
              return panel.getElement();
            }

            patch() {
              Patcher.before(
                DiscordModules.MessageActions,
                "endEditMessage",
                () => {
                  let scroller = document.querySelector(
                    KSS.parse("|messagesWrapper| |themedWithTrack scroller|")
                  );
                  scrollPosition = scroller.scrollHeight - scroller.scrollTop;
                }
              );
              Patcher.after(
                DiscordModules.MessageActions,
                "endEditMessage",
                () => {
                    // Hijack scrolling for one second in intervals of 100ms.
                    // This seems to work the best.
                    for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                      let scroller = document.querySelector(
                        KSS.parse(
                          "|messagesWrapper| |themedWithTrack scroller|"
                        )
                      );
                      scroller.scrollTop = scroller.scrollHeight - scrollPosition;
                    }, 100 * i);
                  }
                }
              );
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
              // KSS.disposeModule("profile-effects");
              try {
                KSS.disposeModule("branding");
              } catch (e) {}
              try {
                KSS.disposeModule("colors");
              } catch (e) {}
              try {
                KSS.disposeModule("codeblocks");
              } catch (e) {}
              try {
                KSS.disposeModule("smalldmbuttons");
              } catch (e) {}
              try {
                KSS.disposeModule("listbuttons");
              } catch (e) {}
              try {
                KSS.disposeModule("messages");
              } catch (e) {}
              try {
                KSS.disposeModule("chatbox");
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
