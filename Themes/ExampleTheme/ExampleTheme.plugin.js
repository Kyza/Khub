//META{"name":"ExampleTheme","displayName":"ExampleTheme","website":"https://khub.kyza.gq/","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/ExampleTheme/ExampleTheme.plugin.js"}*//

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

var ExampleTheme = (() => {
  const config = {
    info: {
      name: "ExampleTheme",
      authors: [
        {
          name: "Kyza",
          discord_id: "220584715265114113",
          github_username: "KyzaGitHub"
        }
      ],
      version: "1.0.0",
      description: "ExampleTheme",
      github:
        "https://github.com/KyzaGitHub/Khub/tree/master/Plugins/ExampleTheme",
      github_raw:
        "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/ExampleTheme/ExampleTheme.plugin.js"
    },
    changelog: [
      {
        title: "New Stuff",
        items: ["Changelog!"]
      },
      {
        title: "Bugs Squashed",
        type: "fixed",
        items: ["Bugs fixed.", "Bugs fixed!!"]
      },
      {
        title: "Improvements",
        type: "improved",
        items: ["Improved!", "Improvements."]
      },
      {
        title: "On-going",
        type: "progress",
        items: ["On going..."]
      }
    ],
    main: "index.js"
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
          BdApi.showConfirmationModal(
            "Libraries Required",
            [
              `By clicking "I Agree", you agree to allow ${config.info.name} to download the two libraries `,
              BdApi.React.createElement(
                "a",
                {
                  href: "https://github.com/rauenzi/BDPluginLibrary/",
                  target: "_blank"
                },
                "ZeresPluginLibrary"
              ),
              " and ",
              BdApi.React.createElement(
                "a",
                {
                  href:
                    "https://github.com/KyzaGitHub/Khub/tree/master/Libraries/KSS",
                  target: "_blank"
                },
                "KSS"
              ),
              "."
            ],
            {
              danger: false,
              confirmText: "I Agree",
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
                    // Install KSS last.
                    require("request").get(
                      "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/KSSLibrary.plugin.js",
                      async (error, response, body) => {
                        if (error)
                          return require("electron").shell.openExternal(
                            "https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/KSSLibrary.plugin.js"
                          );
                        await new Promise((r) =>
                          require("fs").writeFile(
                            require("path").join(
                              ContentManager.pluginsFolder,
                              "KSSLibrary.plugin.js"
                            ),
                            body,
                            r
                          )
                        );
                        // Doing this because it won't work unless it is reoladed.
                        pluginModule.reloadPlugin(this.getName());
                      }
                    );
                  }
                );
              },
              onCancel: () => {
                pluginModule.disablePlugin(this.getName());
              }
            }
          );
        }
        start() {}
        stop() {}
      }
    : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
          const { PluginUpdater } = Api;

          var KSS = null;

          return class ExampleTheme extends Plugin {
            onStart() {
              PluginUpdater.checkForUpdate(
                this.getName(),
                this.getVersion(),
                "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Themes/ExampleTheme/ExampleTheme.plugin.js"
              );

              KSS = new KSSLibrary(this.getName());

              this.updateCSS();
            }

            onStop() {
              this.removeCSS();
            }

            updateCSS() {
              // Later in onStart().
              KSS.downloadStylesheet("https://khub.kyza.gq/Themes/ExampleTheme/colors.kss").then((kss) => {
                KSS.setModule(
                  "colors",
                  kss,
                  true
                );
              });
            }

            removeCSS() {
              KSS.disableModule("colors");
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
