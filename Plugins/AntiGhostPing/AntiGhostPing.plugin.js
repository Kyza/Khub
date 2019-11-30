//META{"name":"AntiGhostPing","displayName":"AntiGhostPing","website":"https://khub.kyza.gq/?plugin=AntiGhostPing","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/AntiGhostPing/AntiGhostPing.plugin.js"}*//

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

var AntiGhostPing = (() => {
  const config = {
    info: {
      name: "AntiGhostPing",
      authors: [
        {
          name: "Kyza",
          discord_id: "220584715265114113",
          github_username: "KyzaGitHub"
        }
      ],
      version: "1.2.7",
      description:
        "AntiGhostPing is a BetterDiscord plugin that detects ghostpings and allows you to take action on them.",
      github:
        "https://github.com/KyzaGitHub/Khub/tree/master/Plugins/AntiGhostPing",
      github_raw:
        "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/AntiGhostPing/AntiGhostPing.plugin.js"
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
          'Fixed updating.'
        ]
      }
      // 	    ,
      // {
      //   title: "Improvements",
      //   type: "improved",
      //   items: ["Removed a console.log()."]
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

          const Storer = WebpackModules.getByProps("commit");

          var ghostPings = [];

          var updateInterval;

          var panelOpen = false;

          var bound = false;

          const selectors = {
            chat: WebpackModules.getByProps("chat").chat,
            chatContent: WebpackModules.getByProps("chatContent").chatContent
          };

          return class AntiGhostPing extends Plugin {
            onStart() {
              PluginUpdater.checkForUpdate(
                "AntiGhostPing",
                this.getVersion(),
                "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/AntiGhostPing/AntiGhostPing.plugin.js"
              );

              BdApi.linkJS(
                "KeyboardJS",
                "https://raw.githubusercontent.com/RobertWHurst/KeyboardJS/master/dist/keyboard.min.js"
              );

              this.patch();
              this.addPanel();
              this.addButton();
              this.bindKeyboard();
              BdApi.injectCSS(
                "AntiGhostPing-css",
                `
              .ghostping-button-unread .ghostping-button-icon {
              color: #D51400;
              };
              `
              );
            }

            onStop() {
              this.unbindKeyboard();
              this.removeButton();
              this.removePanel();
              this.unpatch();
              this.removeIntervals();
              BdApi.clearCSS("AntiGhostPing-css");
            }

            removeIntervals() {
              clearInterval(updateInterval);
            }

            onSwitch() {
              // Use this as a backup.
              this.addButton();
            }

            observer({ addedNodes }) {
              for (const node of addedNodes) {
                if (
                  node.className == selectors.chat ||
                  node.className == selectors.chatContent
                ) {
                  this.addButton();
                }
              }
            }

            bindKeyboard() {
              if (!bound) {
                bound = true;
                keyboardJS.bind("esc", function(e) {
                  // TODO: For some reason this.togglePanel(false); is undefined.
                  panelOpen = false;
                  $("#ghostping-panel").css({
                    opacity: "0",
                    "pointer-events": "none"
                  });
                });
              }
            }

            unbindKeyboard() {
              keyboardJS.reset();
              BdApi.unlinkJS("KeyboardJS");
            }

            patch() {
              // Zerebos' godly fix for some strange bug.
              Patcher.before(
                Storer.prototype,
                "remove",
                (thisObject, [messageId]) => {
                  const message = thisObject.get(messageId);
                  console.log("Might be a ghostping: ", message);
                  if (
                    message.mentioned &&
                    !message.blocked &&
                    message.author.id != DiscordAPI.currentUser.id
                  ) {
                    console.log("It is a ghostping!".toUpperCase());
                    this.addGhostPing(message);
                  }
                }
              );

              // Old code, keeping this here for reference.
              // Patcher.before(BdApi.findModuleByProps("receiveMessage"), "receiveMessage", (thisObject, args, originalFunction) => {
              //   messages.unshift(args[1]);
              //   if (messages.length >= 500) {
              //     messages.pop();
              //   }
              // });
              //
              // Patcher.after(Dispatcher, "dispatch", (thisObject, args) => {
              //   const event = args[0];
              //   if (!event || !event.type || event.type !== "MESSAGE_DELETE") return;
              //
              //   try {
              //     console.timeEnd("Time since last");
              //   } catch (e) {}
              //   console.log("Started checking.");
              //   console.time('Check time');
              //   // Loop through all the messages.
              //   for (let i = 0; i < messages.length; i++) {
              //     var message = messages[i];
              // 		console.log(message.mentioned);
              //     // If the message is the same as the deleted message...
              //     if (message.channel_id == event.channelId && message.id == event.id) {
              //       // Message was deleted quickly-ish.
              //
              //       var isAdded = false;
              //
              //       // Check for @everyone.
              //       if (message.mention_everyone) {
              //         this.addGhostPing(message);
              //         isAdded = true;
              //       }
              //
              //       // Check for user directly being mentioned.
              //       if (!isAdded) {
              //         for (let j = 0; j < message.mentions.length; j++) {
              //           if (isAdded) break;
              //
              //           var mention = message.mentions[j];
              //
              //           if (mention.id == DiscordAPI.currentUser.id) {
              //             this.addGhostPing(message);
              //             isAdded = true;
              //           }
              //         }
              //       }
              //       // Get all of the user's roles on the server the message is located in.
              //       if (message.guild_id) {
              //         var roleIDs = DiscordAPI.Guild.fromId(message.guild_id).currentUser.roleIds;
              //         // Check for user being role mentioned.
              //         if (!isAdded) {
              //           for (let j = 0; j < roleIDs.length; j++) {
              //             if (isAdded) break;
              //
              //             var roleID = roleIDs[i];
              //
              //             for (let k = 0; k < message.mention_roles; k++) {
              //               if (isAdded) break;
              //
              //               var roleMention = message.mention_roles[k];
              //
              //               if (roleID = roleMention) {
              //                 this.addGhostPing(message);
              //                 isAdded = true;
              //               }
              //             }
              //           }
              //         }
              //       }
              //     }
              //   }
              //   console.timeEnd('Check time');
              //   console.log("Finished checking.");
              //   console.time("Time since last");
              // });
            }

            unpatch() {
              Patcher.unpatchAll();
            }

            addGhostPing(message) {
              // Save the ghostping for later.
              ghostPings.unshift(message);

              // Notify the user of the ghostping.
              const user = UserStore.getUser(message.author.id);
              const icon = ImageResolver.getUserAvatarURL(
                UserStore.getUser(user.id)
              );
              const channel = ChannelStore.getChannel(message.channel_id);
              var body = "";
              if (channel.name.trim() != "") {
                body = `New ghostping from @${user.tag} in #${channel.name}.`;
              } else {
                body = `New ghostping from @${user.tag} in your DMs.`;
              }

              Toasts.show(body, {
                type: "warning",
                icon: icon,
                timeout: 10000
              });

              body += "<br><br>Sent and deleted at:";
              body += "<br>" + message.timestamp._d;
              body += "<br>" + new Date();

              // Update the button to show how many ghostpings are unchecked.
              this.updateButton();

              // Add the ghostping to the panel.
              var ghostPingWrapper = $(document.createElement("div"));

              ghostPingWrapper.css({
                "background-color": "rgba(255, 255, 255, 0.3)",
                "border-radius": "5px",
                padding: "5px",
                color: "white",
                "margin-bottom": "10px"
              });

              ghostPingWrapper.html(body + "<br><br>");

              // The button to jump to the channel which had the ghostping.
              var jumpToButton = $(document.createElement("button"));

              jumpToButton.attr("type", "button");
              jumpToButton.css({
                display: "inline",
                "margin-right": "5px"
              });
              jumpToButton.attr(
                "class",
                "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN"
              );

              jumpToButton.html(
                `<div class="contents-18-Yxp">Jump To Channel</div>`
              );

              jumpToButton.click(() => {
                try {
                  var discordChannel = DiscordAPI.Channel.fromId(
                    message.channel_id
                  );
                  discordChannel.select();
                } catch (e) {
                  console.error("Failed to jump to the channel.\n" + channel);
                }
              });

              jumpToButton.appendTo(ghostPingWrapper);

              // The button to ghostping in pure revenge.
              var askButton = $(document.createElement("button"));

              askButton.attr("type", "button");
              askButton.css({
                display: "inline",
                "margin-right": "5px"
              });
              askButton.attr(
                "class",
                "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN"
              );

              askButton.html(`<div class="contents-18-Yxp">Ask Why</div>`);

              askButton.click(() => {
                try {
                  askButton.prop("disabled", true);
                  // Send a ghostping to the user in the same channel.
                  var discordChannel = DiscordAPI.Channel.fromId(
                    message.channel_id
                  );
                  discordChannel.sendMessage(
                    "<@" + message.author.id + ">, why did you ghostping me?",
                    true
                  );
                } catch (e) {
                  console.error("Failed to jump to the channel.\n" + channel);
                }
              });

              askButton.appendTo(ghostPingWrapper);

              var blockButton = $(document.createElement("button"));

              blockButton.attr("type", "button");
              blockButton.css({
                display: "inline",
                "margin-right": "5px"
              });
              blockButton.attr(
                "class",
                "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN"
              );

              var userToBlock = DiscordAPI.User.fromId(message.author.id);

              blockButton.html(
                `<div class="contents-18-Yxp block-button id-` +
                  message.author.id +
                  `">` +
                  (userToBlock.isBlocked ? `Unblock` : `Block`) +
                  `</div>`
              );

              blockButton.click(() => {
                try {
                  // Block the user.
                  let userToBlock = DiscordAPI.User.fromId(message.author.id);
                  if (!userToBlock.isBlocked) {
                    userToBlock.block();
                  } else {
                    userToBlock.unblock();
                  }

                  var buttonQuery =
                    "." + $(blockButton[0].children[0]).attr("class");
                  while (buttonQuery.indexOf(" ") > -1) {
                    buttonQuery = buttonQuery.replace(" ", ".");
                  }
                  console.log(buttonQuery);

                  // Update all the block buttons.
                  var buttonsToChange = $(buttonQuery);
                  console.log(buttonsToChange);
                  for (let i = 0; i < buttonsToChange.length; i++) {
                    console.log(buttonsToChange[i]);
                    $(buttonsToChange[i]).html(
                      `<div class="contents-18-Yxp block-button id-` +
                        message.author.id +
                        `">` +
                        (!userToBlock.isBlocked ? `Unblock` : `Block`) +
                        `</div>`
                    );
                  }
                } catch (e) {
                  console.error("Failed to block the user.\n" + user);
                }
              });

              blockButton.appendTo(ghostPingWrapper);

              // The button to dismiss the notification.
              var dismissButton = $(document.createElement("button"));

              dismissButton.attr("type", "button");
              dismissButton.css({
                display: "inline",
                "margin-right": "5px"
              });
              dismissButton.attr(
                "class",
                "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN"
              );

              dismissButton.html(`<div class="contents-18-Yxp">Dismiss</div>`);

              dismissButton.click(() => {
                try {
                  for (let i = 0; i < ghostPings.length; i++) {
                    let ghostPing = ghostPings[i];
                    if (ghostPing.id == message.id) {
                      ghostPings.splice(i, 1);
                      this.updateButton();
                      break;
                    }
                  }

                  ghostPingWrapper.remove();
                } catch (e) {
                  console.error("Failed to remove the notification.\n", e);
                }
              });

              dismissButton.appendTo(ghostPingWrapper);

              ghostPingWrapper.appendTo($("#ghostping-panel"));
            }

            addButton() {
              try {
                if (
                  document.getElementsByClassName("ghostping-button-wrapper")
                    .length == 0
                ) {
                  var ghostButton = document.createElement("div");
                  var daButtons = document.querySelector(".toolbar-1t6TWx");
                  ghostButton.setAttribute(
                    "class",
                    "iconWrapper-2OrFZ1 clickable-3rdHwn ghostping-button-wrapper"
                  );

                  var ghostButtonInner = document.createElement("div");
                  ghostButtonInner.setAttribute(
                    "class",
                    "icon-22AiRD ghostping-button-inner"
                  );

                  var ghostButtonMask = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                  );
                  ghostButtonMask.setAttribute("id", "ghostping-button-mask");
                  ghostButtonMask.setAttribute("width", "24");
                  ghostButtonMask.setAttribute("height", "24");
                  ghostButtonMask.setAttribute(
                    "viewBox",
                    "0 0 450.002 450.002"
                  );

                  var ghostButtonIcon = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                  );
                  ghostButtonIcon.setAttribute("fill-rule", "evenodd");
                  ghostButtonIcon.setAttribute("clip-rule", "evenodd");
                  ghostButtonIcon.setAttribute(
                    "d",
                    "M411.972,204.367c0-118.248-83.808-204.777-186.943-204.365C121.896-0.41,38.001,86.119,38.001,204.367L38.373,441  l62.386-29.716l62.382,38.717l62.212-38.716l62.215,38.718l62.213-38.714l62.221,29.722L411.972,204.367z M143.727,258.801  c-27.585-6.457-44.713-34.053-38.256-61.638l99.894,23.383C198.908,248.13,171.312,265.258,143.727,258.801z M306.276,258.801  c-27.585,6.457-55.181-10.671-61.638-38.256l99.894-23.383C350.988,224.748,333.861,252.344,306.276,258.801z"
                  );
                  ghostButtonIcon.setAttribute("fill", "currentColor");
                  ghostButtonIcon.setAttribute(
                    "class",
                    "icon-22AiRD ghostping-button-icon"
                  );

                  ghostButtonMask.appendChild(ghostButtonIcon);
                  ghostButtonInner.appendChild(ghostButtonMask);
                  ghostButton.appendChild(ghostButtonInner);
                  daButtons.insertBefore(
                    ghostButton,
                    daButtons.querySelector(`[aria-label="Mentions"]`)
                  );

                  ghostButton.onclick = () => {
                    this.togglePanel(true);
                  };
                  //   ghostButton.onmouseover = () => {
                  //     ghostButton.setAttribute(
                  //       "class",
                  //       "button-14-BFJ enabledf-2cQ-u7 button-38aScr lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN ghostping-button-wrapper"
                  //     );
                  //   };
                  //   ghostButton.onmouseout = () => {};
                  this.updateButton();
                }
              } catch (e) {
                console.log(e);
              }
            }

            updateButton() {
              var ghostButton = document.getElementsByClassName(
                "ghostping-button-inner"
              )[0];
              if (ghostPings.length > 0) {
                ghostButton.classList.add("ghostping-button-unread");
              } else {
                ghostButton.classList.remove("ghostping-button-unread");
              }
            }

            removeButton() {
              if (
                document.getElementsByClassName("ghostping-button-wrapper")
                  .length > 0
              ) {
                document
                  .getElementsByClassName("ghostping-button-wrapper")[0]
                  .remove();
                this.togglePanel(false);
              }
            }

            addPanel() {
              if (!document.getElementById("ghostping-panel")) {
                var ghostPingPanel = $(document.createElement("div"));
                ghostPingPanel.attr("id", "ghostping-panel");
                ghostPingPanel.css({
                  opacity: "0",
                  "pointer-events": "none",
                  "transition-duration": "0.4s",
                  padding: "10px",
                  position: "absolute",
                  "background-color": "rgba(0, 0, 0, 1)",
                  "z-index": "999999999999",
                  top: `${
                    document.querySelector(".platform-win") ? "22" : "0"
                  }px`,
                  left: "0px",
                  width: "calc(100% - 20px)",
                  height: `calc(100% - ${
                    document.querySelector(".platform-win") ? "22" : "0"
                  }px)`,
                  "overflow-y": "auto"
                });

                var ghostPingPanelCloseButton = $(
                  document.createElement("div")
                );
                ghostPingPanelCloseButton.attr(
                  "id",
                  "ghostping-panel-close-button"
                );
                ghostPingPanelCloseButton.css({
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: "white"
                });
                ghostPingPanelCloseButton.html(`
<div class="container-1sFeqf"><div tabindex="0" class="closeButton-1tv5uR" role="button"><svg name="Close" aria-hidden="false" width="18" height="18" viewBox="0 0 12 12"><g fill="none" fill-rule="evenodd"><path d="M0 0h12v12H0"></path><path class="fill" fill="#dcddde" d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"></path></g></svg></div><div class="keybind-KpFkfr">ESC</div></div>
							`);
                ghostPingPanelCloseButton.click(() => {
                  this.togglePanel(false);
                });
                ghostPingPanelCloseButton.appendTo(ghostPingPanel);

                ghostPingPanel.appendTo($(document.body));
              }
            }

            removePanel() {
              $("#ghostping-panel").remove();
            }

            togglePanel(set) {
              panelOpen = set;
              if (set) {
                $("#ghostping-panel").css({
                  opacity: "0.9",
                  "pointer-events": "auto"
                });
              } else {
                $("#ghostping-panel").css({
                  opacity: "0",
                  "pointer-events": "none"
                });
              }
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
