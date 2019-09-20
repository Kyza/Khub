//META{"name":"GhostMessage","website":"https://khub.kyza.gq/?plugin=GhostMessage","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/GhostMessage/GhostMessage.plugin.js"}*//

var GhostMessage = function() {};

var updateInterval;
var getMessagePatch;
var getUploadPatch;

var enabled = false;

GhostMessage.prototype.start = function() {
  /* Start Libraries */

  let libraryScript = document.getElementById("ZLibraryScript");
  if (!libraryScript || !window.ZLibrary) {
    if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
    libraryScript = document.createElement("script");
    libraryScript.setAttribute("type", "text/javascript");
    libraryScript.setAttribute("src", "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js");
    libraryScript.setAttribute("id", "ZLibraryScript");
    document.head.appendChild(libraryScript);
  }

  updateInterval = setInterval(() => {
    ZLibrary.PluginUpdater.checkForUpdate("GhostMessage", this.getVersion(), "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/GhostMessage/GhostMessage.plugin.js");
  }, 5000);

  addButton();

  patch();
};

function patch() {
  try {
    unpatch();
  } catch (e) {}

  getMessagePatch = BdApi.monkeyPatch(BdApi.findModuleByProps("sendMessage"), "sendMessage", {
    after: e => {
      if (enabled) {
        e.returnValue.then((result) => {
          var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
          e.thisObject.deleteMessage(channelId, result.body.id);
        });
      }
    }
  });
  getUploadPatch = BdApi.monkeyPatch(BdApi.findModuleByProps("instantBatchUpload"), "instantBatchUpload", {
    before: e => {
      console.log("eeee");
      if (enabled) {
        console.log(e);
      }
      return e;
    }
  });
}

function unpatch() {
  getMessagePatch();
  getUploadPatch();
}

GhostMessage.prototype.load = function() {
//   addButton();
  patch();
};

GhostMessage.prototype.unload = function() {
  removeButton();
  unpatch();
};

GhostMessage.prototype.stop = function() {
  clearInterval(updateInterval);
  removeButton();
  unpatch();
};

GhostMessage.prototype.onMessage = function() {
  //called when a message is received
};

GhostMessage.prototype.onSwitch = function() {
  addButton();
};

function addButton() {
  try {
    var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
    var channel = ZLibrary.DiscordAPI.Channel.from(ZLibrary.DiscordAPI.Channel.fromId(channelId));
    var permissions = channel.discordObject.permissions;

    // Only add the button if the user has permissions to send messages and embed links.
    if (hasPermission("textSendMessages") || channel.type != "GUILD_TEXT") {
      if (document.getElementsByClassName("ghost-button-wrapper").length == 0) {
        var daButtons = document.getElementsByClassName("buttons-205you")[0];
        var ghostButton = document.createElement("button");
        ghostButton.setAttribute("type", "button");
        ghostButton.setAttribute("class", "buttonWrapper-1ZmCpA button-38aScr lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN ghost-button-wrapper");

        var ghostButtonInner = document.createElement("div");
        ghostButtonInner.setAttribute("class", "contents-18-Yxp button-3AYNKb button-2vd_v_ ghost-button-inner");

        //<img src="https://image.flaticon.com/icons/svg/24/24207.svg" width="224" height="224" alt="Embed free icon" title="Embed free icon">
        //<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="icon-3D60ES da-icon" viewBox="0 0 22 22" fill="currentColor"><path d="M 19.794, 3.299 H 9.765 L 8.797, 0 h -6.598 C 0.99, 0, 0, 0.99, 0, 2.199 V 16.495 c 0, 1.21, 0.99, 2.199, 2.199, 2.199 H 9.897 l 1.1, 3.299 H 19.794 c 1.21, 0, 2.199 -0.99, 2.199 -2.199 V 5.498 C 21.993, 4.289, 21.003, 3.299, 19.794, 3.299 z M 5.68, 13.839 c -2.48, 0 -4.492 -2.018 -4.492 -4.492 s 2.018 -4.492, 4.492 -4.492 c 1.144, 0, 2.183, 0.407, 3.008, 1.171 l 0.071, 0.071 l -1.342, 1.298 l -0.066 -0.06 c -0.313 -0.297 -0.858 -0.643 -1.671 -0.643 c -1.441, 0 -2.612, 1.193 -2.612, 2.661 c 0, 1.468, 1.171, 2.661, 2.612, 2.661 c 1.507, 0, 2.161 -0.962, 2.337 -1.606 h -2.43 v -1.704 h 4.344 l 0.016, 0.077 c 0.044, 0.231, 0.06, 0.434, 0.06, 0.665 C 10.001, 12.036, 8.225, 13.839, 5.68, 13.839 z M 11.739, 9.979 h 4.393 c 0, 0 -0.374, 1.446 -1.715, 3.008 c -0.588 -0.676 -0.995 -1.336 -1.254 -1.864 h -1.089 L 11.739, 9.979 z M 13.625, 13.839 l -0.588, 0.583 l -0.72 -2.452 C 12.685, 12.63, 13.13, 13.262, 13.625, 13.839 z M 20.893, 19.794 c 0, 0.605 -0.495, 1.1 -1.1, 1.1 H 12.096 l 2.199 -2.199 l -0.896 -3.041 l 1.012 -1.012 l 2.953, 2.953 l 0.803 -0.803 l -2.975 -2.953 c 0.99 -1.138, 1.759 -2.474, 2.106 -3.854 h 1.397 V 8.841 H 14.697 v -1.144 h -1.144 v 1.144 H 11.398 l -1.309 -4.443 H 19.794 c 0.605, 0, 1.1, 0.495, 1.1, 1.1 V 19.794 z"></path></svg>

        var ghostButtonMask = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        ghostButtonMask.setAttribute("width", "18");
        ghostButtonMask.setAttribute("height", "18");
        ghostButtonMask.setAttribute("viewBox", "0 0 450.002 450.002");
        ghostButtonMask.setAttribute("class", "icon-3D60ES");

        var ghostButtonIcon = document.createElementNS("http://www.w3.org/2000/svg", "path");
        ghostButtonIcon.setAttribute("fill", "currentColor");
        ghostButtonIcon.setAttribute("fill-rule", "evenodd");
        ghostButtonIcon.setAttribute("clip-rule", "evenodd");
        ghostButtonIcon.setAttribute("d", "M411.972,204.367c0-118.248-83.808-204.777-186.943-204.365C121.896-0.41,38.001,86.119,38.001,204.367L38.373,441  l62.386-29.716l62.382,38.717l62.212-38.716l62.215,38.718l62.213-38.714l62.221,29.722L411.972,204.367z M143.727,258.801  c-27.585-6.457-44.713-34.053-38.256-61.638l99.894,23.383C198.908,248.13,171.312,265.258,143.727,258.801z M306.276,258.801  c-27.585,6.457-55.181-10.671-61.638-38.256l99.894-23.383C350.988,224.748,333.861,252.344,306.276,258.801z");

        ghostButtonMask.appendChild(ghostButtonIcon);
        ghostButtonInner.appendChild(ghostButtonMask);
        ghostButton.appendChild(ghostButtonInner);
        daButtons.insertBefore(ghostButton, daButtons.firstChild);

        ghostButton.onclick = () => {
          var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
          var channel = ZLibrary.DiscordAPI.Channel.from(ZLibrary.DiscordAPI.Channel.fromId(channelId));

          // Only send the embed if the user has permissions to embed links.
          if (hasPermission("textSendMessages") || channel.type != "GUILD_TEXT") {
            setEnabled(!enabled);
          } else {
            BdApi.alert("GhostMessage", `You do not have permission to send messages in this channel.<br><br>This is <strong><u>not</u></strong> a problem with the plugin, it is a <strong><u>server setting</u></strong>.`);
            removeButton();
          }
        };
      }
    } else {
      removeButton();
    }
  } catch (e) {
//     console.log(e);
  }
  setEnabled(enabled);
}

function removeButton() {
  if (document.getElementsByClassName("ghost-button-wrapper").length > 0) {
    document.getElementsByClassName("ghost-button-wrapper")[0].remove();
    setEnabled(false);
  }
}

function setEnabled(set) {
  enabled = set;

  // Make the ghost button stay selected if it is clicked on.
  var ghostInner = document.getElementsByClassName("ghost-button-inner")[0];
  if (ghostInner && ghostInner.children[0] && enabled) {
    ghostInner.setAttribute("style", "opacity: 1; filter: contrast(2);");
    ghostInner.children[0].setAttribute("style", "transform: scale(1.2)");
  } else if (ghostInner && ghostInner.children[0] && !enabled) {
    ghostInner.setAttribute("style", "opacity: 0.5");
    ghostInner.children[0].setAttribute("style", "");
  }
}


function FireEvent(element, eventName) {
  if (element != null) {
    const mouseoverEvent = new Event(eventName);
    element.dispatchEvent(mouseoverEvent);
  }
}

function hasPermission(permission) {
  var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
  var channel = ZLibrary.DiscordAPI.Channel.from(ZLibrary.DiscordAPI.Channel.fromId(channelId));
  var permissions = channel.discordObject.permissions;

  var hexCode;

  // General
  if (permission == "generalCreateInstantInvite") hexCode = 0x1;
  if (permission == "generalKickMembers") hexCode = 0x2;
  if (permission == "generalBanMembers") hexCode = 0x4;
  if (permission == "generalAdministrator") hexCode = 0x8;
  if (permission == "generalManageChannels") hexCode = 0x10;
  if (permission == "generalManageServer") hexCode = 0x20;
  if (permission == "generalChangeNickname") hexCode = 0x4000000;
  if (permission == "generalManageNicknames") hexCode = 0x8000000;
  if (permission == "generalManageRoles") hexCode = 0x10000000;
  if (permission == "generalManageWebhooks") hexCode = 0x20000000;
  if (permission == "generalManageEmojis") hexCode = 0x40000000;
  if (permission == "generalViewAuditLog") hexCode = 0x80;
  // Text
  if (permission == "textAddReactions") hexCode = 0x40;
  if (permission == "textReadMessages") hexCode = 0x400;
  if (permission == "textSendMessages") hexCode = 0x800;
  if (permission == "textSendTTSMessages") hexCode = 0x1000;
  if (permission == "textManageMessages") hexCode = 0x2000;
  if (permission == "textEmbedLinks") hexCode = 0x4000;
  if (permission == "textAttachFiles") hexCode = 0x8000;
  if (permission == "textReadMessageHistory") hexCode = 0x10000;
  if (permission == "textMentionEveryone") hexCode = 0x20000;
  if (permission == "textUseExternalEmojis") hexCode = 0x40000;
  // Voice
  if (permission == "voiceViewChannel") hexCode = 0x400;
  if (permission == "voiceConnect") hexCode = 0x100000;
  if (permission == "voiceSpeak") hexCode = 0x200000;
  if (permission == "voiceMuteMembers") hexCode = 0x400000;
  if (permission == "voiceDeafenMembers") hexCode = 0x800000;
  if (permission == "voiceMoveMembers") hexCode = 0x1000000;
  if (permission == "voiceUseVAD") hexCode = 0x2000000;

  return (permissions & hexCode) != 0;
}


GhostMessage.prototype.observer = function(e) {
  //raw MutationObserver event for each mutation
};

GhostMessage.prototype.getSettingsPanel = function() {
  return "<h3>Settings Panel</h3>\n\nSettings coming soon.";
};

GhostMessage.prototype.getName = function() {
  return "GhostMessage";
};

GhostMessage.prototype.getDescription = function() {
  return "This BetterDiscord plugin allows you to send a message which instantly deletes itself.";
};

GhostMessage.prototype.getVersion = function() {
  return "1.0.6";
};

GhostMessage.prototype.getAuthor = function() {
  return "Kyza#9994";
};
