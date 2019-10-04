//META{"name":"KSSLibrary","displayName":"KSSLibrary","website":"https://khub.kyza.gq/?plugin=KSSLibrary","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/1KSSLibrary.plugin.js"}*//

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

/* START: Utility Functions */
String.prototype.replaceAll = function(find, replace) {
  var str = this;
  return str.replace(
    new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),
    replace
  );
};
String.prototype.splice = function(start, delCount, newSubStr) {
  return (
    this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount))
  );
};
/* STOP: Utility Functions */

/* START: Library */
function KSSLibrary(plugin) {
  if (!plugin) throw `Pass the plugin instance as an argument.`;
  this.plugin = plugin;

  this.selectors = {
    pluginVersion: plugin.getVersion(),
    pluginName: plugin.getName()
  };

  this.parse = (kss) => {
    if (!kss) kss = "";
    for (let selector in this.selectors) {
      kss = kss.replaceAll(
        `|${selector}|`,
        (this.selectors[selector].value
          ? this.selectors[selector].value
          : this.selectors[selector]
        ).trim()
      );
    }

    // Lighty
    const parsed = kss.match(/\|.*?\|/g);
    if (parsed) {
      for (const i of parsed) {
        const search = i.substr(1, i.length - 2).split(" ");
        const res = ZLibrary.WebpackModules.getByProps(...search);
        if (!res || !res[search[search.length - 1]]) {
          ZLibrary.Logger.warn(
            plugin.getName(),
            `Could not find selector for "${search.join(", ")}"!`
          );
          ZLibrary.Toasts.error(
            `${plugin.getName()}: Could not find selector for "${search.join(
              ", "
            )}"!`
          );
        } else {
          try {
            const result = "." + res[search[search.length - 1]].split(" ")[0];
            const escaped = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            kss = kss.replace(new RegExp(escaped, "g"), result);
          } catch (e) {}
        }
      }
    }

    return kss;
  };

  this.addSelector = (name, selector) => {
    if (this.selectors[name]) throw "Selector already exists.";
    this.selectors[name] = selector;
  };

  this.removeSelector = (name) => {
    if (!this.selectors[name]) throw "Selector does not exist.";
    this.selectors[name] = null;
  };

  this.getSelector = (name) => {
    return this.selectors[name];
  };

  this.selectDarkTheme = () => {
    ZLibrary.DiscordModules.UserSettingsUpdater.updateLocalSettings({
      theme: "dark"
    });
  };

  this.selectLightTheme = () => {
    ZLibrary.DiscordModules.UserSettingsUpdater.updateLocalSettings({
      theme: "light"
    });
  };

  this.selectShitTheme = () => {
    ZLibrary.DiscordModules.UserSettingsUpdater.updateLocalSettings({
      theme: "shit"
    });
  };

  this.selectCozyMode = () => {
    ZLibrary.DiscordModules.UserSettingsUpdater.updateLocalSettings({
      displayCompact: false
    });
  };

  this.selectCompactMode = () => {
    ZLibrary.DiscordModules.UserSettingsUpdater.updateLocalSettings({
      displayCompact: true
    });
  };

  this.modules = {};

  this.setModule = (moduleName, kss, updateURL, enabled = true) => {
    this.modules[moduleName] = {
      enabled: enabled,
      kss: kss,
      updateURL: updateURL,
      updateInterval: setInterval(() => {
        if (this.modules[moduleName] && updateURL) {
          try {
            this.downloadStylesheet(this.modules[moduleName].updateURL).then(
              (newKSS) => {
                if (newKSS != this.modules[moduleName].kss) {
                  ZLibrary.Logger.info(
                    plugin.getName(),
                    `Updated ${moduleName} automatically!`
                  );
                  ZLibrary.Toasts.success(
                    `${plugin.getName()}: Updated the ${moduleName} module.`
                  );
                  this.modules[moduleName].kss = newKSS;
                  this.reloadModule(moduleName);
                }
              }
            );
          } catch (e) {}
        } else {
          //   console.log("Can't update.");
        }
      }, 30e3)
    };
    if (enabled) {
      this.enableModule(moduleName);
    }
  };

  this.getModule = (moduleName) => {
    return this.modules[moduleName];
  };

  this.reloadModule = (moduleName) => {
    if (!this.modules[moduleName]) throw `Module ${moduleName} doesn't exist.`;
    var wasEnabled = this.modules[moduleName].enabled;
    this.disableModule(moduleName);
    if (wasEnabled) {
      this.enableModule(moduleName);
    }
  };

  this.enableModule = (moduleName) => {
    if (!this.modules[moduleName]) throw `Module ${moduleName} doesn't exist.`;
    if (this.modules[moduleName].enabled) {
      this.clearCSS(`${this.plugin.getName()}-${moduleName}`);
    }
    this.modules[moduleName].enabled = true;
    this.injectCSS(
      `${this.plugin.getName()}-${moduleName}`,
      this.parse(this.modules[moduleName].kss)
    );
  };

  this.disableModule = (moduleName) => {
    if (!this.modules[moduleName]) throw `Module ${moduleName} doesn't exist.`;
    this.modules[moduleName].enabled = false;
    this.clearCSS(`${this.plugin.getName()}-${moduleName}`);
  };

  this.disposeModule = (moduleName) => {
    if (!this.modules[moduleName]) throw `Module ${moduleName} doesn't exist.`;
    console.log(`Disposed ${moduleName}.`);

    this.disableModule(moduleName);
    clearInterval(this.modules[moduleName].updateInterval);
    this.modules[moduleName] = null;
  };

  this.downloadStylesheet = (url) => {
    if (!url) return "";
    if (!url.endsWith(".css") && !url.endsWith(".kss"))
      throw "You can only download CSS or KSS stylesheets.";

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr);
      };
      xhr.onerror = reject;
      xhr.open("GET", url);
      xhr.send();
    }).then(function(xhr) {
      return xhr.response;
    });
  };

  this.injectCSS = (id, css) => {
    if (!document.querySelector(`#${id}`)) {
      let element = document.createElement("style");
      element.id = id;
      element.innerHTML = css;
      document.head.appendChild(element);
    }
  };

  this.clearCSS = (id) => {
    let elements = document.querySelectorAll(`#${id}`);
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
  };

  this.currentPlatform = () => {
    var platform = "";
    if (document.querySelector(".platform-win")) platform = "win";
    if (document.querySelector(".platform-osx")) platform = "osx";
    if (document.querySelector(".platform-lin")) platform = "lin";
    if (document.querySelector(".platform-web")) platform = "web";
    return platform;
  };

  this.currentTheme = () => {
    var theme = "shit";
    if (document.querySelector(".theme-dark")) theme = "dark";
    if (document.querySelector(".theme-light")) theme = "light";
    return theme;
  };

  // Lighty
  this.findSelectors = (sel) => {
      if (sel.indexOf('-') === -1) return "";
    let ret = "";
    const selector = sel.split("-")[0];
    const matches = (mod) =>
      mod &&
      typeof mod[selector] === "string" &&
      mod[selector].split(" ")[0] === sel;
    if (matches(ZLibrary.WebpackModules.getByProps(selector)))
      return console.info(selector), selector;
    ZLibrary.WebpackModules.find((m) => {
      if (ret || !matches(m)) return false;
      const keys = Object.keys(m);
      let args = [];
      const baseIdx = keys.indexOf(selector);
      goNegative = baseIdx + 1 >= keys.length;
      const getNextIdx = (idx) => {
        let rr = idx - 1;
        if (rr === baseIdx) rr--;
        return rr;
      };
      args.push(getNextIdx(keys.length));
      const constructKeysFromArgs = () => {
        const result = [selector];
        for (let i = 0; i < args.length; i++) result.push(keys[args[i]]);
        return result;
      };
      while (1) {
        const rargs = constructKeysFromArgs();
        if (matches(ZLibrary.WebpackModules.getByProps(...rargs))) {
          const result = [];
          for (let i = 0; i < args.length; i++) result.push(keys[args[i]]);
          result.push(selector);
          ret = result.join(" ");
          break;
        }
        const incrementNext = (cur) => {
          let newVar = getNextIdx(args[cur]);
          if (newVar < 0 || newVar >= keys.length) {
            if (cur === args.length - 1) {
              const nextNewVar = getNextIdx(keys.length);
              args.push(nextNewVar);
              newVar = getNextIdx(nextNewVar);
            } else {
              incrementNext(cur + 1);
              newVar = getNextIdx(args[cur + 1]);
            }
            if (newVar < 0 || newVar >= keys.length) throw "Fuck me";
          }
          args[cur] = newVar;
        };
        try {
          incrementNext(0);
        } catch (e) {
          if (args.length >= keys.length) break;
        }
      }
      return true;
    });
    return ret && console.log(ret), ret;
  };

  // Kyza
  this.findSelectorsFast = (sel) => {
    let ret = "";

    ZLibrary.WebpackModules.find((mod) => {
      if (typeof mod[sel.split("-")[0]] === "string") {
        if (mod[sel.split("-")[0]].indexOf(sel) > -1) {
          let modKeys = Object.keys(mod);
          for (const modKey of modKeys) {
            if (
              ZLibrary.WebpackModules.getByProps(modKey, sel.split("-")[0])[
                sel.split("-")[0]
              ].indexOf(sel) > -1
            ) {
              ret = modKey + " " + sel.split("-")[0];
              return true;
            }
          }
        }
      }
      return false;
    });

    return ret;
  };
}
/* STOP: Library */

window.KSSLibrary = KSSLibrary;

/* START: Handle Overlay */

var KSS = new window.KSSLibrary({
  getVersion: () => {
    return "0.0.0";
  },
  getName: () => {
    return "ExamplePlugin";
  }
});

function updateCSS() {
  KSS.setModule("userKSS", "");
  KSS.setModule(
    "overlay-styles",
    `
  @import url("https://cdn.jsdelivr.net/gh/tonsky/FiraCode@master/distr/fira_code.css");
  
  #KSSOverlay {
  font-family: "Fira Code", monospace;
  
  top: ${KSS.currentPlatform() == "win" ? "22" : "0"}px;
  left: 1px;
  width: calc(100% - 1px);
  height: calc(100% - ${KSS.currentPlatform() == "win" ? "22" : "0"}px);
  
  background-color: black;
  
  opacity: 0.6;
  
  position: absolute;
  z-index: 999;
  
  transition-duration: 0.5s;
  pointer-events: auto;
  }
  
  .hideKSSOverlay {
  opacity: 0 !important;
  pointer-events: none !important;
  }
  
  #KSSOverlayTextarea {
  position: absolute;
  top: 44px;
  left: 0px;
  width: 100%;
  height: calc(100% - 45px);
  
  background-color: rgba(255, 255, 255, 0.0);
  border: none;
  border-top: 1px white dotted;
  padding: 0px;
  color: white;
  
  font-size: 24px;
  font-family: "Fira Code";
  overflow-x: auto;
  white-space: nowrap;
  
  resize: none;
  
  tab-size: 2;
  }
      `
  );
}

function removeCSS() {
  try {
    KSS.disposeModule("userKSS");
    KSS.disposeModule("overlay-styles");
  } catch (e) {}
}

function loadDataString(key) {
  var dataObject = ZLibrary.PluginUtilities.loadData("KSSLibrary", key, "");
  var dataString = "";
  for (let i = 0; i < Object.keys(dataObject).length; i++) {
    dataString += dataObject[i];
  }
  return dataString;
}

function saveData(key, data) {
  ZLibrary.PluginUtilities.saveData("KSSLibrary", key, data);
}

function addOverlay() {
  if (document.querySelector("#KSSOverlay")) return;
  var overlay = document.createElement("div");
  overlay.id = "KSSOverlay";
  overlay.className = "hideKSSOverlay";

  var textarea = document.createElement("textarea");
  textarea.id = "KSSOverlayTextarea";

  textarea.value = loadDataString("editorKSS");
  textarea.selectionStart = loadDataString("editorSelectionStart");
  textarea.selectionEnd = loadDataString("editorSelectionEnd");

  // Format and convert KSS.
  textarea.oninput = (e) => {
    // Maybe help it to not kill itself.
    setTimeout(() => {
      if (e.data != null) {
        if (
          e.data.toLowerCase() == "v" &&
          textarea.value[textarea.selectionStart - 1] == "{"
        ) {
          textarea.value = textarea.value.splice(
            textarea.selectionStart,
            0,
            `\n\t\n}`
          );
          textarea.selectionStart = textarea.selectionStart - 2;
          textarea.selectionEnd = textarea.selectionEnd - 2;
        }
      }

      try {
        const matched = textarea.value.match(/(\b(?:\w+(?:-|_)|\w)+\b-?)/g);
        var content = textarea.value;
        for (const m of matched) {
          const findPlz = m.startsWith(".") ? m.substr(1) : m;
          const matches = KSS.findSelectors(findPlz);
          if (!matches) {
            // console.warn(findPlz, "not found!");
            continue;
          }

          content = content.replace(
            "." + (m.startsWith(".") ? m.substr(1) : m),
            `|${matches}|`
          );
          content = content.replace(
            m.startsWith(".") ? m.substr(1) : m,
            `|${matches}|`
          );
        }
        textarea.value = content;
      } catch (e) {
        console.error(e);
      }

      saveData("editorKSS", textarea.value);

      setTimeout(() => {
        KSS.setModule("userKSS", textarea.value);
      }, 1e2);
    }, 0);
  };

  textarea.onkeyup = saveSelection;
  textarea.onmouseup = saveSelection;

  // Handle tabs.
  textarea.onkeydown = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();

      var oldStart = textarea.selectionStart;
      var oldEnd = textarea.selectionEnd;

      textarea.value = textarea.value.splice(textarea.selectionStart, 0, `\t`);
      saveData("editorKSS", textarea.value);

      textarea.selectionStart = oldStart + 1;
      textarea.selectionEnd = oldEnd + 1;

      saveSelection();
    }
  };

  overlay.appendChild(textarea);

  overlay.onmouseout = () => {
    overlay.setAttribute("style", "pointer-events: none;");
    saveSelection();
  };

  document.onmouseover = () => {
    overlay.setAttribute("style", "");
  };

  document.body.appendChild(overlay);

  if (loadDataString("KSSOverlayOpen") == "true") {
    toggleOverlay();
  }
}

function saveSelection() {
  saveData(
    "editorSelectionStart",
    document.querySelector("#KSSOverlayTextarea").selectionStart + ""
  );
  saveData(
    "editorSelectionEnd",
    document.querySelector("#KSSOverlayTextarea").selectionEnd + ""
  );

  document.querySelector("#KSSOverlayTextarea").selectionStart = loadDataString(
    "editorSelectionStart"
  );
  document.querySelector("#KSSOverlayTextarea").selectionEnd = loadDataString(
    "editorSelectionEnd"
  );
}

function removeOverlay() {
  try {
    document.querySelector("#KSSOverlay").remove();
  } catch (e) {}
}

function toggleOverlay() {
  if (
    document.querySelector("#KSSOverlay").className.indexOf("hideKSSOverlay") <
    0
  ) {
    KSSOverlayEnabled = true;
    document.querySelector("#KSSOverlay").className += " hideKSSOverlay";
    document.querySelector("#KSSOverlay").className = document
      .querySelector("#KSSOverlay")
      .className.trim();
    document.querySelector("#KSSOverlayTextarea").blur();
    saveData("KSSOverlayOpen", "false");
  } else {
    document.querySelector("#KSSOverlay").className = document
      .querySelector("#KSSOverlay")
      .className.replaceAll("hideKSSOverlay", "")
      .trim();
    document.querySelector("#KSSOverlayTextarea").focus();
    saveData("KSSOverlayOpen", "true");
  }
}

document.onkeydown = () => {
  var evtobj = window.event ? event : e;
  if (evtobj.keyCode == 75 && evtobj.altKey) {
    toggleOverlay();
  }
};

removeOverlay();
removeCSS();

addOverlay();
updateCSS();

/* STOP: Handle Overlay */

/* START: Handle KSS Theme Loading */
/*
    if (window.OldKSSWatcher) {
      window.OldKSSWatcher.close();
    }
    
    if (!window.loadedThemes) {
      window.loadedThemes = {};
    } else {
      reloadAllThemes();
    }
    
    const fs = require('fs');
    
    const themesFolder = ContentManager.themesFolder;
    
    // console.log(`Watching for file changes on ${themesFolder}`);
    
    var firstRename = true;
    const themeWatcher = fs.watch(themesFolder, (event, filename) => {
      if (filename) {
        if (filename.endsWith(".theme.kss")) {
          setTimeout(() => {
            if (event == "rename") {
              // The file was renamed.
              if (firstRename) {
                // The file was deleted.
                if (!fs.existsSync(themesFolder + "/" + filename)) {
                  firstRename = !firstRename;
                }
                unloadTheme(filename);
              } else {
                // The file was added or changed.
                firstRename = !firstRename;
                loadTheme(filename);
              }
            } else {
              // The file was changed.
              unloadTheme(filename);
              loadTheme(filename);
            }
          }, 1e3);
        }
      }
    });
    
    window.OldKSSWatcher = themeWatcher;
    
    function loadTheme(filename) {
      window.loadedThemes[filename] = new window.KSSLibrary({
        getVersion: () => {
          return "";
        },
        getName: () => {
          return "KSSThemeLoader";
        }
      });
      window.loadedThemes[filename].setModule("main", fs.readFileSync(themesFolder + "/" + filename).toString());
      console.log(window.loadedThemes);
    }
    
    function unloadTheme(filename) {
      console.log(window.loadedThemes[filename]);
      if (window.loadedThemes[filename]) {
        window.loadedThemes[filename].disableModule("main");
        window.loadedThemes[filename] = null;
        console.log(window.loadedThemes);
      }
    }
    
    function reloadAllThemes() {
    
    }
    */

/* STOP: Handle KSS Theme Loading */

var KSSLibrary = (() => {
  const config = {
    info: {
      name: "KSSLibrary",
      authors: [
        {
          name: "Kyza",
          discord_id: "220584715265114113",
          github_username: "KyzaGitHub"
        }
      ],
      version: "0.1.10",
      description: "Easy CSS for BetterDiscord.",
      github: "https://github.com/KyzaGitHub/Khub/tree/master/Libraries/KSS",
      github_raw:
        "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/1KSSLibrary.plugin.js"
    },
    changelog: [
      //   {
      //     title: "New Stuff",
      //     items: ["Added a simple KSS editor. Try Alt+K."]
      //   }
      // ,
      {
        title: "Bugs Squashed",
        type: "fixed",
        items: ["The editor converts classes to KSS again."]
      }
      // ,
      //   {
      //     title: "Improvements",
      //     type: "improved",
      //     items: [
      //       ""
      //     ]
      //   }
      // ,
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
          ZLibrary.PluginUpdater.checkForUpdate(
            "KSSLibrary",
            this.getVersion(),
            "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/1KSSLibrary.plugin.js"
          );

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
                  // ,
                  // onCancel: () => {
                  //   window.KSSLibrary = null;
                  // }
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
          const { Modals } = Api;

          return class KSSLibrary extends Plugin {
            onStart() {
              Modals.showAlertModal(
                "You don't need to enable this plugin.",
                "It has been disabled for you automatically."
              );
              pluginModule.disablePlugin(this.getName());
            }

            onStop() {}
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
