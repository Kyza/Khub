//META{"name":"AntiGhostPing","displayName":"AntiGhostPing","website":"https://khub.kyza.gq/?plugin=AntiGhostPing&version=v1","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/v1%20Plugins/AntiGhostPing/AntiGhostPing.plugin.js"}*//

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
    "info": {
      "name": "AntiGhostPing",
      "authors": [{
        "name": "Kyza",
        "discord_id": "220584715265114113",
        "github_username": "KyzaGitHub"
      }, {
        "name": "Zerebos",
        "discord_id": "249746236008169473",
        "github_username": "rauenzi",
        "twitter_username": "ZackRauen"
      }],
      "version": "1.0.1",
      "description": "AntiGhostPing is a BetterDiscord plugin that detects ghostpings and allows you to take action on them.",
      "github": "",
      "github_raw": ""
    },
    "changelog": [{
        "title": "New Stuff",
        "items": ["Added this changelog."]
      },
      {
        "title": "Bugs Squashed",
        "type": "fixed",
        "items": ["Fixed a bug where the plugin would detect if you ghostpinged yourself."]
      },
      {
        "title": "Improvements",
        "type": "improved",
        "items": []
      },
      {
        "title": "On-going",
        "type": "progress",
        "items": []
      }
    ],
    "main": "index.js"
  };

  return !global.ZeresPluginLibrary ? class {
    constructor() {
      this._config = config;
    }
    getName() {
      return config.info.name;
    }
    getAuthor() {
      return config.info.authors.map(a => a.name).join(", ");
    }
    getDescription() {
      return config.info.description;
    }
    getVersion() {
      return config.info.version;
    }
    load() {
      const title = "Library Missing";
      const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
      const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
      const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
      if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
      ModalStack.push(function(props) {
        return BdApi.React.createElement(ConfirmationModal, Object.assign({
          header: title,
          children: [TextElement({
            color: TextElement.Colors.PRIMARY,
            children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]
          })],
          red: false,
          confirmText: "Download Now",
          cancelText: "Cancel",
          onConfirm: () => {
            require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
              if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
              await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
            });
          }
        }, props));
      });
    }
    start() {}
    stop() {}
  } : (([Plugin, Api]) => {
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

      var userID = DiscordAPI.currentUser.id;

      return class AntiGhostPing extends Plugin {

        onStart() {
          updateInterval = setInterval(() => {
            PluginUpdater.checkForUpdate("AntiGhostPing", this.getVersion(), "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/v1%20Plugins/AntiGhostPing/AntiGhostPing.plugin.js");
          }, 5000);

          // console.log(Patcher._patches.find(p => p.name.includes("dispatch")));

          this.patch();
          this.addPanel();
          this.addButton();
        }

        onStop() {
          this.removeButton();
          this.removePanel();
          this.unpatch();
          this.removeIntervals();
        }

        removeIntervals() {
          clearInterval(updateInterval);
        }

        patch() {
          // Zerebos' godly fix for some strange bug.
          Patcher.before(Storer.prototype, "remove", (thisObject, [messageId]) => {
            const message = thisObject.get(messageId);
            if (message.mentioned && !message.blocked && message.author.id != userID) {
              this.addGhostPing(message);
            }
          });

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
          //           if (mention.id == userID) {
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
          const icon = ImageResolver.getUserAvatarURL(UserStore.getUser(user.id));
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
            "padding": "5px",
            "color": "white",
            "margin-bottom": "10px"
          });

          ghostPingWrapper.html(body + "<br><br>");

          // The button to jump to the channel which had the ghostping.
          var jumpToButton = $(document.createElement("button"));

          jumpToButton.attr("type", "button");
          jumpToButton.css({
            "display": "inline",
            "margin-right": "5px"
          });
          jumpToButton.attr("class", "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN");

          jumpToButton.html(`<div class="contents-18-Yxp">Jump To Channel</div>`);

          jumpToButton.click(() => {
            try {
              var discordChannel = DiscordAPI.Channel.fromId(message.channel_id);
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
            "display": "inline",
            "margin-right": "5px"
          });
          askButton.attr("class", "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN");

          askButton.html(`<div class="contents-18-Yxp">Ask Why</div>`);

          askButton.click(() => {
            try {
              askButton.prop("disabled", true);
              // Send a ghostping to the user in the same channel.
              var discordChannel = DiscordAPI.Channel.fromId(message.channel_id);
              discordChannel.sendMessage("<@" + message.author.id + ">, why did you ghostping me?", true);
            } catch (e) {
              console.error("Failed to jump to the channel.\n" + channel);
            }
          });

          askButton.appendTo(ghostPingWrapper);

          // The button to ghostping in pure revenge.
          var revengePingButton = $(document.createElement("button"));

          revengePingButton.attr("type", "button");
          revengePingButton.css({
            "display": "inline",
            "margin-right": "5px"
          });
          revengePingButton.attr("class", "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN");

          revengePingButton.html(`<div class="contents-18-Yxp">Revenge Ping</div>`);

          revengePingButton.click(() => {
            try {
              revengePingButton.prop("disabled", true);
              // Send a ghostping to the user in the same channel.
              var discordChannel = DiscordAPI.Channel.fromId(message.channel_id);
              discordChannel.sendMessage("<@" + message.author.id + ">", true).then((sentMessage) => {
                sentMessage.delete();
              });
            } catch (e) {
              console.error("Failed to jump to the channel.\n" + channel);
            }
          });

          revengePingButton.appendTo(ghostPingWrapper);

          // The button to ghostping in pure revenge.
          var blockButton = $(document.createElement("button"));

          blockButton.attr("type", "button");
          blockButton.css({
            "display": "inline",
            "margin-right": "5px"
          });
          blockButton.attr("class", "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN");

          var userToBlock = DiscordAPI.User.fromId(message.author.id);

          blockButton.html(`<div class="contents-18-Yxp block-button id-` + message.author.id + `">` + (userToBlock.isBlocked ? `Unblock` : `Block`) + `</div>`);

          blockButton.click(() => {
            try {
              // Block the user.
              let userToBlock = DiscordAPI.User.fromId(message.author.id);
              if (!userToBlock.isBlocked) {
                userToBlock.block();
              } else {
                userToBlock.unblock();
              }

              var buttonQuery = "." + $(blockButton[0].children[0]).attr("class");
              while (buttonQuery.indexOf(" ") > -1) {
                buttonQuery = buttonQuery.replace(" ", ".");
              }
              console.log(buttonQuery);

              // Update all the block buttons.
              var buttonsToChange = $(buttonQuery);
              console.log(buttonsToChange);
              for (let i = 0; i < buttonsToChange.length; i++) {
                console.log(buttonsToChange[i]);
                $(buttonsToChange[i]).html(`<div class="contents-18-Yxp block-button id-` + message.author.id + `">` + (!userToBlock.isBlocked ? `Unblock` : `Block`) + `</div>`);
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
            "display": "inline",
            "margin-right": "5px"
          });
          dismissButton.attr("class", "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN");

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
            if (document.getElementsByClassName("ghostping-button-wrapper").length == 0) {
              //flex-1xMQg5 flex-1O1GKY da-flex da-flex horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignStretch-DpGPf3 noWrap-3jynv6
              var ghostButton = document.createElement("button");
              var daButtons = document.querySelector("div.container-3baos1 > div.flex-1xMQg5.flex-1O1GKY.horizontal-1ae9ci.horizontal-2EEEnY.flex-1O1GKY.directionRow-3v3tfG.justifyStart-2NDFzi.alignStretch-DpGPf3.noWrap-3jynv6");
              ghostButton.setAttribute("type", "button");
              ghostButton.setAttribute("class", "button-2JbWXs button-38aScr lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN ghostping-button-wrapper");

              var ghostButtonInner = document.createElement("div");
              ghostButtonInner.setAttribute("class", "contents-18-Yxp da-contents ghostping-button-inner");

              var ghostButtonMask = document.createElement("mask");
              ghostButtonMask.setAttribute("id", "ghostping-button-mask");

              var ghostButtonIcon = document.createElement("img");
              ghostButtonIcon.setAttribute("src", "https://image.flaticon.com/icons/svg/121/121202.svg");
              ghostButtonIcon.setAttribute("class", "icon-3D60ES da-icon ghostping-button-icon");
              ghostButtonIcon.setAttribute("style", "filter: invert(100%) !important;");
              ghostButtonIcon.setAttribute("width", "22");
              ghostButtonIcon.setAttribute("height", "22");

              ghostButtonMask.appendChild(ghostButtonIcon);
              ghostButtonInner.appendChild(ghostButtonMask);
              ghostButton.appendChild(ghostButtonInner);
              daButtons.insertBefore(ghostButton, daButtons.firstChild);

              ghostButton.onclick = () => {
                this.togglePanel(true);
              };
              this.updateButton();
            }
          } catch (e) {
            console.log(e);
          }
        }

        updateButton() {
          var ghostButton = document.getElementsByClassName("ghostping-button-wrapper")[0];
          if (ghostPings.length > 0) {
            ghostButton.setAttribute("style", "filter: brightness(50%) sepia(100) saturate(100) hue-rotate(25deg);");
          } else {
            ghostButton.setAttribute("style", "");
          }
        }

        removeButton() {
          if (document.getElementsByClassName("ghostping-button-wrapper").length > 0) {
            document.getElementsByClassName("ghostping-button-wrapper")[0].remove();
            this.togglePanel(false);
          }
        }

        addPanel() {
          if (!document.getElementById("ghostping-panel")) {
            var ghostPingPanel = $(document.createElement("div"));
            ghostPingPanel.attr("id", "ghostping-panel");
            ghostPingPanel.css({
              "opacity": "0.9",
              "transition-duration": "1s",
              "padding": "10px",
              "position": "absolute",
              "background-color": "rgba(0, 0, 0, 1)",
              "z-index": "999999999999",
              "top": "22px",
              "left": "0px",
              "width": "calc(100% - 20px)",
              "height": "calc(100% - 42px)",
              "overflow-y": "scroll"
            });

            ghostPingPanel.hide();

            var ghostPingPanelCloseButton = $(document.createElement("div"));
            ghostPingPanelCloseButton.attr("id", "ghostping-panel-close-button");
            ghostPingPanelCloseButton.css({
              "position": "absolute",
              "top": "10px",
              "right": "10px",
              "width": "25px",
              "height": "25px",
              "background-color": "red",
              "border-radius": "5px"
            });
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
            $("#ghostping-panel").show();
          } else {
            $("#ghostping-panel").hide();
          }
        }

      };
    };
    return plugin(Plugin, Api);
  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/

// function FireEvent(element, eventName) {
//   if (element != null) {
//     const mouseoverEvent = new Event(eventName);
//     element.dispatchEvent(mouseoverEvent);
//   }
// }
//
// function hasPermission(permission) {
//   var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
//   var channel = ZLibrary.DiscordAPI.Channel.from(ZLibrary.DiscordAPI.Channel.fromId(channelId));
//   var permissions = channel.discordObject.permissions;
//
//   var hexCode;
//
//   // General
//   if (permission == "generalCreateInstantInvite") hexCode = 0x1;
//   if (permission == "generalKickMembers") hexCode = 0x2;
//   if (permission == "generalBanMembers") hexCode = 0x4;
//   if (permission == "generalAdministrator") hexCode = 0x8;
//   if (permission == "generalManageChannels") hexCode = 0x10;
//   if (permission == "generalManageServer") hexCode = 0x20;
//   if (permission == "generalChangeNickname") hexCode = 0x4000000;
//   if (permission == "generalManageNicknames") hexCode = 0x8000000;
//   if (permission == "generalManageRoles") hexCode = 0x10000000;
//   if (permission == "generalManageWebhooks") hexCode = 0x20000000;
//   if (permission == "generalManageEmojis") hexCode = 0x40000000;
//   if (permission == "generalViewAuditLog") hexCode = 0x80;
//   // Text
//   if (permission == "textAddReactions") hexCode = 0x40;
//   if (permission == "textReadMessages") hexCode = 0x400;
//   if (permission == "textSendMessages") hexCode = 0x800;
//   if (permission == "textSendTTSMessages") hexCode = 0x1000;
//   if (permission == "textManageMessages") hexCode = 0x2000;
//   if (permission == "textEmbedLinks") hexCode = 0x4000;
//   if (permission == "textAttachFiles") hexCode = 0x8000;
//   if (permission == "textReadMessageHistory") hexCode = 0x10000;
//   if (permission == "textMentionEveryone") hexCode = 0x20000;
//   if (permission == "textUseExternalEmojis") hexCode = 0x40000;
//   // Voice
//   if (permission == "voiceViewChannel") hexCode = 0x400;
//   if (permission == "voiceConnect") hexCode = 0x100000;
//   if (permission == "voiceSpeak") hexCode = 0x200000;
//   if (permission == "voiceMuteMembers") hexCode = 0x400000;
//   if (permission == "voiceDeafenMembers") hexCode = 0x800000;
//   if (permission == "voiceMoveMembers") hexCode = 0x1000000;
//   if (permission == "voiceUseVAD") hexCode = 0x2000000;
//
//   return (permissions & hexCode) != 0;
// }
