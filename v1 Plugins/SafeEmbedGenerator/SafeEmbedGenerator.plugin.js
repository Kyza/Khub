//META{"name":"SafeEmbedGenerator","website":"https://github.com/KyzaGitHub/SafeEmbedGenerator","source":"https://raw.githubusercontent.com/KyzaGitHub/SafeEmbedGenerator/master/SafeEmbedGenerator.plugin.js"}*//

var SafeEmbedGenerator = function() {};

var embedOpen = false;
var recentEmbeds = [];

var updateInterval;
var makeSureClosedInterval;
SafeEmbedGenerator.prototype.start = function() {
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
    ZLibrary.PluginUpdater.checkForUpdate("SafeEmbedGenerator", this.getVersion(), "https://raw.githubusercontent.com/KyzaGitHub/SafeEmbedGenerator/master/SafeEmbedGenerator.plugin.js");
  }, 5000);

  makeSureClosedInterval = setInterval(() => {
    if (!embedOpen) {
      closeEmbedPopup();
    }
  }, 1000);

  addButton();

  // loadRecentEmbeds();
};

SafeEmbedGenerator.prototype.load = function() {
  addButton();
  // loadRecentEmbeds();
};

SafeEmbedGenerator.prototype.unload = function() {
  removeButton();
};

SafeEmbedGenerator.prototype.stop = function() {
  clearInterval(updateInterval);
  clearInterval(makeSureClosedInterval);
  removeButton();
};

SafeEmbedGenerator.prototype.onMessage = function() {
  //called when a message is received
};

SafeEmbedGenerator.prototype.onSwitch = function() {
  addButton();
};

function loadRecentEmbeds() {
  try {
    // Load the recent embeds.
    var pluginsFolder = ZLibrary.PluginUtilities.getBDFolder("plugins");

    var fs = require("fs");
    recentEmbeds = JSON.parse(fs.readFileSync(pluginsFolder + "/SafeEmbedGenerator.recentEmbeds.json"));
  } catch (e) {
    recentEmbeds = [];
  }
}

function generateEmbedPreview() {
  /*
  <div class="embed-IeVjo6 da-embed embedWrapper-3AbfJJ da-embedWrapper" aria-hidden="false">
      <div class="embedPill-1Zntps da-embedPill" style="background-color: rgb(79, 84, 92);"></div>
      <div class="embedInner-1-fpTo da-embedInner">
          <div class="embedContent-3fnYWm da-embedContent">
              <div class="embedContentInner-FBnk7v da-embedContentInner markup-2BOw-j da-markup">
                  <div class=""><span class="embedProvider-3k5pfl da-embedProvider">pname</span></div>
                  <div class="embedAuthor-3l5luH da-embedAuthor embedMargin-UO5XwE da-embedMargin"><span class="embedAuthorName-3mnTWj da-embedAuthorName">aname</span></div>
                  <div class="embedMargin-UO5XwE da-embedMargin"><a tabindex="0" class="anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover embedTitleLink-1Zla9e embedLink-1G1K1D embedTitle-3OXDkz da-embedTitleLink da-embedLink da-embedTitle" href="https://em.0x71.cc/aulari" rel="noreferrer noopener" target="_blank">title</a></div>
                  <div class="embedDescription-1Cuq9a da-embedDescription embedMargin-UO5XwE da-embedMargin">rweqfd</div>
              </div>
          </div>
      </div>
  </div>
  */
}

function addButton() {
  try {
    var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
    var channel = ZLibrary.DiscordAPI.Channel.from(ZLibrary.DiscordAPI.Channel.fromId(channelId));
    var permissions = channel.discordObject.permissions;

    // Only add the button if the user has permissions to send messages and embed links.
		console.log("isAllowed()", isAllowed());
    if (isAllowed() && (hasPermission("textEmbedLinks") && hasPermission("textSendMessages")) || channel.type != "GUILD_TEXT") {
      if (document.getElementsByClassName("embed-button-wrapper").length == 0) {
        var daButtons = document.getElementsByClassName("da-buttons")[0];
        var embedButton = document.createElement("button");
        embedButton.setAttribute("type", "button");
        embedButton.setAttribute("class", "buttonWrapper-1ZmCpA da-buttonWrapper button-38aScr da-button lookBlank-3eh9lL da-lookBlank colorBrand-3pXr91 da-colorBrand grow-q77ONN da-grow normal embed-button-wrapper");

        var embedButtonInner = document.createElement("div");
        embedButtonInner.setAttribute("class", "contents-18-Yxp da-contents button-3AYNKb da-button button-2vd_v_ da-button embed-button-inner");

        //<img src="https://image.flaticon.com/icons/svg/24/24207.svg" width="224" height="224" alt="Embed free icon" title="Embed free icon">
        //<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="icon-3D60ES da-icon" viewBox="0 0 22 22" fill="currentColor"><path d="M 19.794, 3.299 H 9.765 L 8.797, 0 h -6.598 C 0.99, 0, 0, 0.99, 0, 2.199 V 16.495 c 0, 1.21, 0.99, 2.199, 2.199, 2.199 H 9.897 l 1.1, 3.299 H 19.794 c 1.21, 0, 2.199 -0.99, 2.199 -2.199 V 5.498 C 21.993, 4.289, 21.003, 3.299, 19.794, 3.299 z M 5.68, 13.839 c -2.48, 0 -4.492 -2.018 -4.492 -4.492 s 2.018 -4.492, 4.492 -4.492 c 1.144, 0, 2.183, 0.407, 3.008, 1.171 l 0.071, 0.071 l -1.342, 1.298 l -0.066 -0.06 c -0.313 -0.297 -0.858 -0.643 -1.671 -0.643 c -1.441, 0 -2.612, 1.193 -2.612, 2.661 c 0, 1.468, 1.171, 2.661, 2.612, 2.661 c 1.507, 0, 2.161 -0.962, 2.337 -1.606 h -2.43 v -1.704 h 4.344 l 0.016, 0.077 c 0.044, 0.231, 0.06, 0.434, 0.06, 0.665 C 10.001, 12.036, 8.225, 13.839, 5.68, 13.839 z M 11.739, 9.979 h 4.393 c 0, 0 -0.374, 1.446 -1.715, 3.008 c -0.588 -0.676 -0.995 -1.336 -1.254 -1.864 h -1.089 L 11.739, 9.979 z M 13.625, 13.839 l -0.588, 0.583 l -0.72 -2.452 C 12.685, 12.63, 13.13, 13.262, 13.625, 13.839 z M 20.893, 19.794 c 0, 0.605 -0.495, 1.1 -1.1, 1.1 H 12.096 l 2.199 -2.199 l -0.896 -3.041 l 1.012 -1.012 l 2.953, 2.953 l 0.803 -0.803 l -2.975 -2.953 c 0.99 -1.138, 1.759 -2.474, 2.106 -3.854 h 1.397 V 8.841 H 14.697 v -1.144 h -1.144 v 1.144 H 11.398 l -1.309 -4.443 H 19.794 c 0.605, 0, 1.1, 0.495, 1.1, 1.1 V 19.794 z"></path></svg>

        var embedButtonIcon = document.createElement("img");
        //version="1.1" xmlns="http://www.w3.org/2000/svg" class="icon-3D60ES da-icon" viewBox="0 0 22 22" fill="currentColor"
        embedButtonIcon.setAttribute("src", "https://image.flaticon.com/icons/svg/25/25463.svg");
        embedButtonIcon.setAttribute("class", "icon-3D60ES da-icon");
        embedButtonIcon.setAttribute("style", "filter: invert(100%) !important;");
        embedButtonIcon.setAttribute("width", "22");
        embedButtonIcon.setAttribute("height", "22");

        embedButtonInner.appendChild(embedButtonIcon);
        embedButton.appendChild(embedButtonInner);
        daButtons.insertBefore(embedButton, daButtons.firstChild);

        embedButton.onclick = () => {
          var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
          var channel = ZLibrary.DiscordAPI.Channel.from(ZLibrary.DiscordAPI.Channel.fromId(channelId));

          // Only send the embed if the user has permissions to embed links.
          if (hasPermission("textEmbedLinks") || channel.type != "GUILD_TEXT") {
            openEmbedPopup();
          } else {
            BdApi.alert("SafeEmbedGenerator", `You do not have permissions to send embedded links in this channel.<br><br>This is <strong><u>not</u></strong> a problem with the plugin, it is a <strong><u>server setting</u></strong>.`);
          }
        };
      }
    } else {
      removeButton();
    }
  } catch (e) {
    console.log(e);
  }
}


function isAllowed() {
  // Must be one of the following requirements.
  // Be myself.
  // Have any role in the BetterDiscord servers.

  var guildId = window.location.toString().split("/")[window.location.toString().split("/").length - 2];
  var betterDiscordServer1;
  try {
    betterDiscordServer1 = ZLibrary.DiscordAPI.Guild.fromId("86004744966914048")
  } catch (e) {}
  var betterDiscordServer2;
  try {
    betterDiscordServer2 = ZLibrary.DiscordAPI.Guild.fromId("86004744966914048")
  } catch (e) {}

  if (!betterDiscordServer1 || !betterDiscordServer2) {
    return true;
  }

	var currentUser1 = betterDiscordServer1.currentUser;
	var currentUser2 = betterDiscordServer2.currentUser;

  if (guildId.toString() == "86004744966914048" || guildId.toString() == "280806472928198656") {
    if (!betterDiscordServer1) {
      if (currentUser2.userId == "220584715265114113") {
        // The user is Kyza, return true right away.
        return true;
      }

      if (currentUser2.roles.length > 0) {
        // The user is in a BetterDiscord server but has a role.
        return true;
      } else {
        // The user is in a BetterDiscord server but does not have a role.
        return false;
      }
    } else if (!betterDiscordServer2) {
      if (currentUser1.userId == "220584715265114113") {
        // The user is Kyza, return true right away.
        return true;
      }

      if (currentUser1.roles.length > 0) {
        // The user is in a BetterDiscord server but has a role.
        return true;
      } else {
        // The user is in a BetterDiscord server but does not have a role.
        return false;
      }
    } else {
			if (currentUser1.userId == "220584715265114113") {
        // The user is Kyza, return true right away.
        return true;
      }

			if (currentUser1.roles.length > 0 || currentUser2.roles.length > 0) {
				// The user is in a BetterDiscord server but has a role.
				return true;
			} else {
				// The user is in a BetterDiscord server but does not have a role.
				return false;
			}
		}
  }

  // The user doesn't have any of the BetterDiscord servers selected, so return true.
  return true;
}


function removeButton() {
  if (document.getElementsByClassName("embed-button-wrapper").length > 0) {
    document.getElementsByClassName("embed-button-wrapper")[0].remove();
  }
}



function sendEmbed(providerName, providerUrl, authorName, authorUrl, title, description, image, imageType, color) {
  var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
  var channel = ZLibrary.DiscordAPI.Channel.from(ZLibrary.DiscordAPI.Channel.fromId(channelId));

  // Only send the embed if the user has permissions to embed links.
  if (isAllowed() && hasPermission("textEmbedLinks") || channel.type != "GUILD_TEXT") {
    const obj = {};
    obj.providerName = providerName;
    obj.providerUrl = providerUrl; // The link on the Provider Name.
    obj.authorName = authorName + (imageType == "true" ? " " : "");
    obj.authorUrl = authorUrl; // The link on the Author Name.
    obj.title = title;
    obj.description = description;
    obj.isBanner = (imageType == "true" ? true : false); // Photo is a banner, nothing is a small image on the right.
    obj.image = image; // The image displayed on the right.
    obj.color = color.replace("#", ""); // The color on the left of the embed.

    var request = require("request");

    // Everything was successful, so add the embed to the recent embeds.
    recentEmbeds.unshift(obj);
    // Save the recent embeds.
    var pluginsFolder = ZLibrary.PluginUtilities.getBDFolder("plugins");

    // var fs = require("fs");
    // fs.writeFile(pluginsFolder + "/SafeEmbedGenerator.recentEmbeds.json", JSON.stringify(recentEmbeds, null, 2), function(err) {
    //   if (err) {
    //     console.log(err);
    //   }
    // });

    request({
      url: "https://em.0x71.cc/",
      method: "POST",
      json: obj
    }, (err, res, body) => {
      if (err) {
        console.error(err);
        return;
      }
      ZLibrary.DiscordAPI.Channel.fromId(channelId).sendMessage(`http://em.0x71.cc/${body.id}`, true);
    });
  } else {
    BdApi.alert("SafeEmbedGenerator", `You do not have permissions to send embedded links in this channel.<br><br>Because of this your message was not sent in order to prevent the embarrassment of 1,000 deaths.<br><br>This is <strong><u>not</u></strong> a problem with the plugin, it is a <strong><u>server setting</u></strong>.`);
  }
}

var popupWrapperWidth = 320;
var popupWrapperHeight = 620;

function openEmbedPopup() {
  if (!document.getElementById("embedPopupWrapper")) {
    embedOpen = true;

    var popupWrapper = document.createElement("div");
    popupWrapper.setAttribute("id", "embedPopupWrapper");

    var embedButton = document.getElementsByClassName("embed-button-wrapper")[0].getBoundingClientRect();
    var positionInterval = setInterval(() => {
      if (!document.getElementById("embedPopupWrapper")) {
        window.clearInterval(positionInterval);
      }
      popupWrapper.setAttribute("style", "text-align: center; border-radius: 10px; width: " + popupWrapperWidth + "px; height: " + popupWrapperHeight + "px; position: absolute; top: " + ((window.innerHeight / 2) - (popupWrapperHeight / 2)) + "px; left: " + ((window.innerWidth / 2) - (popupWrapperWidth / 2)) + "px; background-color: #36393F; z-index: 999999999999999999999; text-rendering: optimizeLegibility;");
    }, 100);

    // Exit button: <svg width="18" height="18" class="button-1w5pas da-button dropdown-33sEFX da-dropdown open-1Te94t da-open"><g fill="none" fill-rule="evenodd"><path d="M0 0h18v18H0"></path><path stroke="#FFF" d="M4.5 4.5l9 9" stroke-linecap="round"></path><path stroke="#FFF" d="M13.5 4.5l-9 9" stroke-linecap="round"></path></g></svg>
    var exitButton = document.createElement("div");
    exitButton.setAttribute("style", "position: absolute; width: 18px; height: 18px; right: 10px; top: 10px;");
    exitButton.innerHTML = `<svg width="18" height="18" class="button-1w5pas dropdown-33sEFX open-1Te94t"><g fill="none" fill-rule="evenodd"><path d="M0 0h18v18H0"></path><path stroke="#FFF" d="M4.5 4.5l9 9" stroke-linecap="round"></path><path stroke="#FFF" d="M13.5 4.5l-9 9" stroke-linecap="round"></path></g></svg>`;


    var providerName = document.createElement("input");
    providerName.setAttribute("id", "providerName");

    var providerUrl = document.createElement("input");
    providerUrl.setAttribute("id", "providerUrl");

    var authorName = document.createElement("input");
    authorName.setAttribute("id", "authorName");

    var authorUrl = document.createElement("input");
    authorUrl.setAttribute("id", "authorUrl");

    var title = document.createElement("input");
    title.setAttribute("id", "title");

    var description = document.createElement("textarea");
    description.setAttribute("id", "description");

    var imageUrl = document.createElement("input");
    imageUrl.setAttribute("id", "imageUrl");

    var imageType = document.createElement("div");
    imageType.setAttribute("id", "imageType");

    var imageTypeText = document.createElement("div");
    imageTypeText.setAttribute("id", "imageTypeText");

    var imageTypeInput = document.createElement("input");
    imageTypeInput.setAttribute("id", "imageTypeInput");

    var colorPicker = document.createElement("input");
    colorPicker.setAttribute("id", "colorPicker");

    var submitButton = document.createElement("input");
    var fadeOutBackground = document.createElement("div");

    var inputStyle = "width: 275px; margin: auto auto 10px auto;";
    var textInputStyle = "background-color: #484B52; border: none; border-radius: 5px; height: 30px; padding-left: 10px;";

    providerName.setAttribute("type", "text");
    providerName.setAttribute("placeholder", "Provider Name");
    providerName.setAttribute("style", inputStyle + "margin-top: 10px;" + textInputStyle);
    providerName.oninput = () => {
      oldProviderName = providerName.value;

      createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
    };

    providerUrl.setAttribute("type", "text");
    providerUrl.setAttribute("placeholder", "Provider URL");
    providerUrl.setAttribute("style", inputStyle + textInputStyle);
    providerUrl.oninput = () => {
      createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
    };

    authorName.setAttribute("type", "text");
    authorName.setAttribute("placeholder", "Author Name");
    authorName.setAttribute("style", inputStyle + textInputStyle);
    authorName.oninput = () => {
      if (authorName.value.trim() == "" && imageTypeInput.getAttribute("checked") == "true") {
        disableUnusableInputs(authorName, description, providerName);
      } else {
        reenableNowUsableInputs(authorName, description, providerName);
      }

      createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
    };

    authorUrl.setAttribute("type", "text");
    authorUrl.setAttribute("placeholder", "Author URL");
    authorUrl.setAttribute("style", inputStyle + textInputStyle);
    authorUrl.oninput = () => {
      createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
    };

    title.setAttribute("type", "text");
    title.setAttribute("placeholder", "Title");
    title.setAttribute("style", inputStyle + textInputStyle);
    title.oninput = () => {
      createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
    };

    description.setAttribute("placeholder", "Description");
    description.setAttribute("style", inputStyle + "height: 250px !important; resize: none;" + textInputStyle);
    description.oninput = () => {
      oldDescription = description.value;

      createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
    };

    imageUrl.setAttribute("type", "text");
    imageUrl.setAttribute("placeholder", "Image URL");
    imageUrl.setAttribute("style", inputStyle + textInputStyle);
    imageUrl.oninput = () => {
      createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
    };

    // Checked   = valueChecked-m-4IJZ
    // Unchecked = valueUnchecked-2lU_20
    imageType.setAttribute("class", "flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueUnchecked-2lU_20 value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
    imageType.setAttribute("tabindex", "0");
    imageType.setAttribute("style", "flex: 0 0 auto;" + inputStyle);
    imageType.onclick = () => {
      if (imageType.getAttribute("class") == "flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX") {
        imageType.setAttribute("class", "flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueUnchecked-2lU_20 value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
        imageTypeInput.setAttribute("checked", "false");

        reenableNowUsableInputs(authorName, description, providerName);
      } else {
        imageType.setAttribute("class", "flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX");
        imageTypeInput.setAttribute("checked", "true");

        disableUnusableInputs(authorName, description, providerName);
      }

      createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
    };
    imageTypeText.innerHTML = "Banner Image Mode";
    imageTypeText.setAttribute("style", "position: absolute; text-align: center; width: 100%; height: 100%; line-height: 22.5px;");
    imageTypeInput.setAttribute("class", "checkboxEnabled-CtinEn checkbox-2tyjJg da-checkboxEnabled da-checkbox");
    imageTypeInput.setAttribute("type", "checkbox");
    imageTypeInput.setAttribute("tabindex", "-1");
    imageTypeInput.setAttribute("checked", "false");
    imageTypeInput.setAttribute("style", "margin-left: auto; margin-right: auto;");
    imageType.appendChild(imageTypeText);
    imageType.appendChild(imageTypeInput);

    /*
			<div class="flexChild-faoVW3 da-flexChild switchEnabled-V2WDBB switch-3wwwcV da-switchEnabled da-switch valueChecked-m-4IJZ value-2hFrkk sizeDefault-2YlOZr size-3rFEHg themeDefault-24hCdX" tabindex="0" style="flex: 0 0 auto;">
			<input class="checkboxEnabled-CtinEn checkbox-2tyjJg da-checkboxEnabled da-checkbox" type="checkbox" tabindex="-1" checked="">
			</div>
		*/

    colorPicker.setAttribute("type", "color");
    colorPicker.setAttribute("style", inputStyle + "background-color: #484B52; border: none; border-radius: 5px;");
    colorPicker.oninput = () => {
      createEmbedPreviewPopup(popupWrapperWidth + 100, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);
    };

    submitButton.setAttribute("type", "button");
    submitButton.setAttribute("value", "Send");
    submitButton.setAttribute("style", inputStyle + "background-color: #484B52; border: none; border-radius: 5px; color: #99AAB5; height: 30px;");

    submitButton.onclick = () => {
      if (!(providerName.value.trim() == "" && providerUrl.value.trim() == "" && authorName.value.trim() == "" && authorUrl.value.trim() == "" && description.value.trim() == "" && imageUrl.value.trim() == "")) {
        var img = new Image();
        if ((providerName.value.trim() == "" && authorName.value.trim() == "" && description.value.trim() == "" && imageUrl.value.trim() != "")) {
          img.onload = function() {
            sendEmbed(providerName.value, providerUrl.value, authorName.value, authorUrl.value, "", description.value, imageUrl.value, imageTypeInput.getAttribute("checked"), colorPicker.value);
            closeEmbedPopup();
          };
          img.src = imageUrl.value;
        } else {
          sendEmbed(providerName.value, providerUrl.value, authorName.value, authorUrl.value, "", description.value, imageUrl.value, imageTypeInput.getAttribute("checked"), colorPicker.value);
          closeEmbedPopup();
        }
      }
    };

    //    popupWrapper.appendChild(exitButton);
    popupWrapper.appendChild(providerName);
    popupWrapper.appendChild(providerUrl);
    popupWrapper.appendChild(authorName);
    popupWrapper.appendChild(authorUrl);
    //    popupWrapper.appendChild(title);
    popupWrapper.appendChild(description);
    popupWrapper.appendChild(imageUrl);
    popupWrapper.appendChild(imageType);
    popupWrapper.appendChild(colorPicker);
    popupWrapper.appendChild(submitButton);

    // var jQColoPicker = $(colorPicker);
    // jQColorPicker.spectrum({
    //   color: "#000000",
    //   flat: true,
    //   cancelText: "",
    //   showInput: true
    // });

    // Add the fadeout for the background.
    fadeOutBackground.setAttribute("id", "fadeOutBackground");
    fadeOutBackground.setAttribute("style", "position: absolute; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); z-index: 999999999999999999998;");
    fadeOutBackground.onclick = () => {
      closeEmbedPopup();
    };


    document.body.appendChild(fadeOutBackground);

    // createRecentEmbedPopup(300);
    createEmbedPreviewPopup(popupWrapperWidth + 80, providerName.value, providerUrl.value, authorName.value, authorUrl.value, description.value, colorPicker.value, imageTypeInput.getAttribute("checked"), imageUrl.value);

    document.body.appendChild(popupWrapper);
  }
}

function createRecentEmbedPopup(offset) {
  if (!document.getElementById("recentEmbedsWrapper")) {
    var recentEmbedsWrapper = document.createElement("div");
    var recentEmbedsWidth = 200;
    var recentEmbedsHeight = 600;
    recentEmbedsWrapper.setAttribute("id", "recentEmbedsWrapper");
    recentEmbedsWrapper.setAttribute("class", "theme-dark");

    var positionInterval = setInterval(() => {
      if (!document.getElementById("embedPreviewWrapper")) {
        window.clearInterval(positionInterval);
      }
      recentEmbedsWrapper.setAttribute("style", "border-radius: 10px; width: " + recentEmbedsWidth + "px; height: " + recentEmbedsHeight + "px; position: absolute; top: " + ((window.innerHeight / 2) - (recentEmbedsHeight / 2) - 10) + "px; left: " + ((window.innerWidth / 2) - (recentEmbedsWidth / 2) - offset) + "px; background-color: #36393F; z-index: 999999999999999999999; padding: 10px; text-rendering: optimizeLegibility;");
    }, 100);

    var recentEmbedsInner = document.createElement("div");
    recentEmbedsInner.setAttribute("style", "overflow-y: scroll; width: " + recentEmbedsWidth + "px; height: " + recentEmbedsHeight + "px;");

    for (var i = 0; i < recentEmbeds.length; i++) {
      var embed = recentEmbeds[i];

      var embedElement = document.createElement("div");
      embedElement.setAttribute("id", "embedNumber" + i);
      embedElement.setAttribute("class", "embed-IeVjo6 da-embed embedWrapper-3AbfJJ da-embedWrapper");
      embedElement.setAttribute("aria-hidden", "false");
      embedElement.setAttribute("style", "margin-bottom: 10px; max-width: 426px; width: auto; height: auto;");

      embedElement.ondblclick = (e) => {
        var target = (e || window.event).target;

        while (!target.id.startsWith("embedNumber")) {
          target = target.parentElement;
        }

        var elementIndex = parseInt(target.id.replace("embedNumber", ""));

        document.getElementById("providerName").value = recentEmbeds[elementIndex].providerName;
        document.getElementById("providerUrl").value = recentEmbeds[elementIndex].providerUrl;
        document.getElementById("authorName").value = recentEmbeds[elementIndex].authorName;
        document.getElementById("authorUrl").value = recentEmbeds[elementIndex].authorUrl;
        // Title isn't being used right now.
        //				document.getElementById("title").value = recentEmbeds[elementIndex].title;
        document.getElementById("description").value = recentEmbeds[elementIndex].description;
        document.getElementById("imageType").setAttribute("checked", (recentEmbeds[elementIndex].isBanner ? "true" : "false"));
        document.getElementById("colorPicker").value = "#" + recentEmbeds[elementIndex].color;

        createEmbedPreviewPopup(popupWrapperWidth + 80, document.getElementById("providerName").value, document.getElementById("providerUrl").value, document.getElementById("authorName").value, document.getElementById("authorUrl").value, document.getElementById("description").value, document.getElementById("colorPicker").value, document.getElementById("authorUrl").getAttribute("checked"), document.getElementById("imageUrl").value);
      };

      embedElement.innerHTML = `<div class="embedPill-1Zntps da-embedPill" style="background-color: ` + (embed.color == "000000" ? "#4f545c" : "#" + embed.color) + `;"></div><div class="embedInner-1-fpTo da-embedInner"><div class="embedContent-3fnYWm da-embedContent"><div class="embedContentInner-FBnk7v da-embedContentInner markup-2BOw-j da-markup" style="clear: right;">` + (embed.providerName.trim() != "" ? `<div class=""><` + (embed.providerUrl.trim() == "" ? "span" : "a") + ` tabindex="0" class="` + (embed.providerUrl.trim() == "" ? "embedProvider-3k5pfl da-embedProvider" : `anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover embedProviderLink-2Pq1Uw embedLink-1G1K1D embedProvider-3k5pfl da-embedProviderLink da-embedLink da-embedProvider`) + `" href=` + embed.providerUrl + `" rel="noreferrer noopener" target="_blank">` + embed.providerName + `</` + (embed.providerUrl.trim() == "" ? "span" : "a") + `></div>` : "") + `` + (embed.authorName.trim() != "" ? `<div class="embedAuthor-3l5luH da-embedAuthor embedMargin-UO5XwE da-embedMargin"><` + (embed.authorUrl.trim() == "" ? "span" : "a") + ` tabindex="0" class="` + (embed.authorUrl.trim() == "" ? "embedAuthorName-3mnTWj da-embedAuthorName" : `anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover embedAuthorNameLink-1gVryT embedLink-1G1K1D embedAuthorName-3mnTWj da-embedAuthorNameLink da-embedLink da-embedAuthorName`) + `" href="` + embed.authorUrl + `" rel="noreferrer noopener" target="_blank">` + embed.authorName + `</` + (embed.providerUrl.trim() == "" ? "span" : "a") + `></div>` : "") + `` + (embed.description.trim() != "" ? `<div class="embedDescription-1Cuq9a da-embedDescription embedMargin-UO5XwE da-embedMargin">` + embed.description + `</div>` : "") + `</div></div></div>`;

      recentEmbedsInner.appendChild(embedElement);
    }

    recentEmbedsWrapper.appendChild(recentEmbedsInner);
    document.body.appendChild(recentEmbedsWrapper);
  }
}

var oldImageUrl;
var oldImageWidth = -1;
var oldImageHeight = -1;

function createEmbedPreviewPopup(offset, providerName, providerUrl, authorName, authorUrl, description, color, imageType, imageUrl) {
  var img = new Image();

  var create = (useImage, oldImage) => {

    var imageWidth = 0;
    var imageHeight = 0;
    if (useImage && !oldImage) {
      oldImageUrl = imageUrl;

      imageWidth = img.width;
      imageHeight = img.height;

      oldImageWidth = imageWidth;
      oldImageHeight = imageHeight;
    } else if (oldImage) {
      imageUrl = oldImageUrl;
      imageWidth = oldImageWidth;
      imageHeight = oldImageHeight;
    }

    imageType = (imageType == "true" ? "photo" : "thumbnail");

    var imageString = "";


    var embedImageLink = document.createElement("a");
    if (imageType == "photo") {
      embedImageLink.setAttribute("class", "anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover imageWrapper-2p5ogY da-imageWrapper imageZoom-1n-ADA da-imageZoom clickable-3Ya1ho da-clickable embedImage-2W1cML da-embedImage embedMarginLarge-YZDCEs da-embedMarginLarge embedWrapper-3AbfJJ da-embedWrapper");
    } else {
      embedImageLink.setAttribute("class", "anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover imageWrapper-2p5ogY da-imageWrapper imageZoom-1n-ADA da-imageZoom clickable-3Ya1ho da-clickable embedThumbnail-2Y84-K da-embedThumbnail");
    }
    embedImageLink.setAttribute("href", imageUrl);
    embedImageLink.setAttribute("ref", "noreferrer noopener");
    embedImageLink.setAttribute("target", "_blank");
    embedImageLink.setAttribute("role", "button");

    var embedImage = document.createElement("img");
    embedImage.setAttribute("src", imageUrl);

    var scaledImageWidth = -1;
    var scaledImageHeight = -1;

    if (imageType == "photo") {
      //			` + (imageType == "photo" ? `float: right; max-width: 400px; max-height: 400px;` : `float: default; max-width: 80px; max-height: 80px;`) + ("width: " + imageWidth + "px; height: " + imageHeight + "px;") + `

      var countDownScale = 1000.0;
      if (imageWidth >= imageHeight) {
        while (scaledImageWidth > 400 || scaledImageWidth == -1) {
          scaledImageWidth = imageWidth * (countDownScale / 1000);
          countDownScale--;
        }
        scaledImageHeight = imageHeight * (countDownScale / 1000);
      } else {
        while (scaledImageHeight > 400 || scaledImageHeight == -1) {
          scaledImageHeight = imageHeight * (countDownScale / 1000);
          countDownScale--;
        }
        scaledImageWidth = imageWidth * (countDownScale / 1000);
      }

      embedImageLink.setAttribute("style", "float: default; max-width: 400px; max-height: 400px; width: " + scaledImageWidth + "px; height: " + scaledImageHeight + "px;");
      embedImage.setAttribute("style", "max-width: 400px; max-height: 400px; width: " + scaledImageWidth + "px; height: " + scaledImageHeight + "px;" + `background-image: url("https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336"); background-size: cover; background-repeat: none; background-position: center;`);
    } else {
      var countDownScale = 1000.0;
      if (imageWidth >= imageHeight) {
        while (scaledImageWidth > 80 || scaledImageWidth == -1) {
          scaledImageWidth = imageWidth * (countDownScale / 1000);
          countDownScale--;
        }
        scaledImageHeight = imageHeight * (countDownScale / 1000);
      } else {
        while (scaledImageHeight > 80 || scaledImageHeight == -1) {
          scaledImageHeight = imageHeight * (countDownScale / 1000);
          countDownScale--;
        }
        scaledImageWidth = imageWidth * (countDownScale / 1000);
      }

      embedImageLink.setAttribute("style", "float: right; max-width: 80px; max-height: 80px; width: " + scaledImageWidth + "px; height: " + scaledImageHeight + "px;");
      embedImage.setAttribute("style", "max-width: 80px; max-height: 80px; width: " + scaledImageWidth + "px; height: " + scaledImageHeight + "px;" + `background-image: url("https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336"); background-size: cover; background-repeat: none; background-position: center;`);
    }

    embedImageLink.appendChild(embedImage);

    imageString = embedImageLink.outerHTML;


    var tmpString = `<div class="embed-IeVjo6 da-embed embedWrapper-3AbfJJ da-embedWrapper" aria-hidden="false" style="max-width: 426px; width: auto; height: auto;"><div class="embedPill-1Zntps da-embedPill" style="background-color: ` + (color == "#000000" ? "#4f545c" : color) + `;"></div><div class="embedInner-1-fpTo da-embedInner">` + (useImage ? (imageType == "thumbnail" ? imageString : "") : "") + `<div class="embedContent-3fnYWm da-embedContent"><div class="embedContentInner-FBnk7v da-embedContentInner markup-2BOw-j da-markup" style="clear: right;">` + (providerName.trim() != "" ? `<div class=""><` + (providerUrl.trim() == "" ? "span" : "a") + ` tabindex="0" class="` + (providerUrl.trim() == "" ? "embedProvider-3k5pfl da-embedProvider" : `anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover embedProviderLink-2Pq1Uw embedLink-1G1K1D embedProvider-3k5pfl da-embedProviderLink da-embedLink da-embedProvider`) + `" href=` + providerUrl + `" rel="noreferrer noopener" target="_blank">` + providerName + `</` + (providerUrl.trim() == "" ? "span" : "a") + `></div>` : "") + `` + (authorName.trim() != "" ? `<div class="embedAuthor-3l5luH da-embedAuthor embedMargin-UO5XwE da-embedMargin"><` + (authorUrl.trim() == "" ? "span" : "a") + ` tabindex="0" class="` + (authorUrl.trim() == "" ? "embedAuthorName-3mnTWj da-embedAuthorName" : `anchor-3Z-8Bb da-anchor anchorUnderlineOnHover-2ESHQB da-anchorUnderlineOnHover embedAuthorNameLink-1gVryT embedLink-1G1K1D embedAuthorName-3mnTWj da-embedAuthorNameLink da-embedLink da-embedAuthorName`) + `" href="` + authorUrl + `" rel="noreferrer noopener" target="_blank">` + authorName + `</` + (providerUrl.trim() == "" ? "span" : "a") + `></div>` : "") + `` + (description.trim() != "" ? `<div class="embedDescription-1Cuq9a da-embedDescription embedMargin-UO5XwE da-embedMargin">` + description + `</div>` : "") + `</div></div>` + (useImage ? (imageType == "photo" ? imageString : "") : "") + `</div></div>`;

    var htmlString = (providerName.trim() == "" && authorName.trim() == "" && description.trim() == "" && imageType == "photo" ? (providerName.trim() == "" && authorName.trim() == "" && description.trim() == "" && imageUrl.trim() == "" ? tmpString : imageString) : tmpString);
    if (!document.getElementById("embedPreviewWrapper")) {
      var previewWrapper = document.createElement("div");
      var previewWrapperWidth = 446;
      var previewWrapperHeight = 446;
      previewWrapper.setAttribute("id", "embedPreviewWrapper");
      previewWrapper.setAttribute("class", "theme-dark");

      var embedButton = document.getElementsByClassName("embed-button-wrapper")[0].getBoundingClientRect();
      var positionInterval = setInterval(() => {
        if (!document.getElementById("embedPreviewWrapper")) {
          window.clearInterval(positionInterval);
        }
        previewWrapper.setAttribute("style", "border-radius: 10px; width: auto; height: auto; position: absolute; top: " + ((window.innerHeight / 2) - (previewWrapperHeight / 2)) + "px; left: " + ((window.innerWidth / 2) - (previewWrapperWidth / 2) + offset) + "px; background-color: #36393F; z-index: 999999999999999999999; padding: 10px; text-rendering: optimizeLegibility;");
      }, 100);

      previewWrapper.innerHTML = htmlString;

      document.body.appendChild(previewWrapper);

      return previewWrapper;
    } else {
      // Refresh the embed preview because it is already there.
      var previewWrapper = document.getElementById("embedPreviewWrapper");
      previewWrapper.innerHTML = htmlString;
      return embedPreviewWrapper;
    }
  };

  if (oldImageUrl != imageUrl) {
    img.onload = function() {
      create(true, false);
    };
    img.onerror = function() {
      create(false, false);
    };

    img.src = imageUrl;
  } else {
    create(true, true);
  }
}

function testImage(imageUrl) {
  return (imageUrl.trim() != "" ? true : false);
}

var oldDescription = "";
var oldProviderName = "";
var disabledDescription = "You must have an author name to use the description or provider name with image banner mode on.";
var disabledProviderName = "Read the description box.";

function reenableNowUsableInputs(authorName, description, providerName) {
  description.disabled = false;
  if (oldDescription != "") {
    description.value = oldDescription;
  }
  description.setAttribute("placeholder", "Description");

  providerName.disabled = false;
  if (oldProviderName != "") {
    providerName.value = oldProviderName;
  }
  providerName.setAttribute("placeholder", "Provider Name");
}

function disableUnusableInputs(authorName, description, providerName) {
  if (authorName.value.trim() == "") {
    description.disabled = true;
    description.value = "";
    description.setAttribute("placeholder", disabledDescription);

    providerName.disabled = true;
    oldProviderName = providerName.value;
    providerName.value = "";
    providerName.setAttribute("placeholder", disabledProviderName);
  }
}

function closeEmbedPopup() {
  try {
    document.getElementById("embedPopupWrapper").remove();
  } catch (e) {}
  try {
    document.getElementById("embedPreviewWrapper").remove();
  } catch (e) {}
  try {
    document.getElementById("recentEmbedsWrapper").remove();
  } catch (e) {}
  try {
    document.getElementById("fadeOutBackground").remove();
  } catch (e) {}
  oldDescription = "";
  oldProviderName = "";

  embedOpen = false;
}

SafeEmbedGenerator.prototype.observer = function(e) {
  //raw MutationObserver event for each mutation
};

SafeEmbedGenerator.prototype.getSettingsPanel = function() {
  return "<h3>Settings Panel</h3>\n\nSettings coming soon.";
};

SafeEmbedGenerator.prototype.getName = function() {
  return "SafeEmbedGenerator";
};

SafeEmbedGenerator.prototype.getDescription = function() {
  return "This BetterDiscord plugin adds a button which allows you to create safe embeds with ease.";
};

SafeEmbedGenerator.prototype.getVersion = function() {
  return "1.2.12";
};

SafeEmbedGenerator.prototype.getAuthor = function() {
  return "Kyza#9994";
};


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
