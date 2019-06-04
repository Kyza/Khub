String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

var converter = new showdown.Converter();

function addMarkdown(markdownLink, element, callback) {
  var loadingDiv = document.createElement("div");
  loadingDiv.style.backgroundImage = "url('https://kyzagithub.github.io/svgs/goo-loader.svg')";
  loadingDiv.style.backgroundPosition = "center";
  loadingDiv.style.backgroundRepeat = "no-repeat";
  loadingDiv.style.backgroundSize = "contain";
  loadingDiv.style.height = "50vw";
  loadingDiv.style.filter = "grayscale(100%)";
  element.appendChild(loadingDiv);

  $.get(markdownLink, function(response) {
    var text = response;

    var lines = text.split("\n");
    var finishedMarkdown = "";
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].indexOf("- [x]") == 0) {
        lines[i] = "<div><input type='checkbox' disabled checked style=''>" + lines[i].replace("- [x]", "") + "</div>";
      } else if (lines[i].indexOf("- [ ]") == 0) {
        lines[i] = "<div><input type='checkbox' disabled style=''>" + lines[i].replace("- [ ]", "") + "</div>";
      }
      finishedMarkdown += lines[i] + "\n";
    }

    var html = converter.makeHtml(finishedMarkdown.trim());

    html = html.replaceAll("<a", "<a class='link'");
    html = html.replaceAll("<img", "<img style='max-width: 100%;'");

    loadingDiv.remove();
    element.innerHTML += html;

    callback();
  });
}

var popupInterval;

function setDownloadSearch(downloadName, downloadLocation) {
  if (downloadLocation == "theme" && !window.location.search) {
    window.history.replaceState({}, document.title, window.location.toString().split("#")[0] + "?theme=" + downloadName + (window.location.toString().split("#")[1] ? "#" + window.location.toString().split("#")[1] : ""));
  } else if (!window.location.search) {
    window.history.replaceState({}, document.title, window.location.toString().split("#")[0] + "?plugin=" + downloadName + "&version=" + downloadLocation + (window.location.toString().split("#")[1] ? "#" + window.location.toString().split("#")[1] : ""));
  }
}

function openDownloadPopup(downloadName, downloadLocation) {
  if (!document.getElementById("fadedBackground")) {
    var fadedBackground = document.createElement("div");
    fadedBackground.setAttribute("id", "fadedBackground");
    fadedBackground.style.position = "fixed";
    fadedBackground.style.top = "0px";
    fadedBackground.style.left = "0px";
    fadedBackground.style.width = "100%";
    fadedBackground.style.height = "100%";
    fadedBackground.style.overflowX = "hidden";
    fadedBackground.style.overflowY = "scroll";
    fadedBackground.style.zIndex = "100000";
    fadedBackground.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    fadedBackground.style.opacity = "0";
    fadedBackground.style.transitionDuration = "1s";
    setTimeout(() => {
      fadedBackground.style.opacity = "1";
    }, 10);
    document.getElementById("body").style.overflow = "hidden";
    fadedBackground.addEventListener("click", (e) => {
      e = e || window.event
      var target = e.target || e.srcElement;
      if (target == document.getElementById("fadedBackground")) {
        window.history.replaceState({}, document.title, window.location.toString().replace(window.location.search, ""));
      }
    });
    var popupInner = document.createElement("div");
    popupInner.id = "popupInner";
    popupInner.style.backgroundColor = "#242424";
    popupInner.style.borderRadius = "30px";
    popupInner.style.padding = "20px";
    popupInner.style.margin = "0 auto";
    popupInner.style.marginTop = "30px";
    popupInner.style.marginBottom = "30px";
    popupInner.style.width = "80%";
    popupInner.style.overflow = "hidden";
    fadedBackground.appendChild(popupInner);
    document.getElementById("body").appendChild(fadedBackground);
    var downloadPath = "";
    if (downloadLocation == "v1") downloadPath = "v1%20Plugins";
    if (downloadLocation == "v2") downloadPath = "v1%20Plugins";
    if (downloadLocation == "theme") downloadPath = "Themes";
    addMarkdown("https://kyza.gq/Khub/" + downloadPath + "/" + downloadName + "/README.md", popupInner, () => {
      var popupInner = document.getElementById("popupInner");
      var downloadButton = document.createElement("div");
      downloadButton.id = "downloadButton";
      downloadButton.innerHTML = "DOWNLOAD";
      downloadButton.addEventListener("click", (e) => {
        var type = downloadLocation.replace("v1", "plugin").replace("v2", "plugin");
        var pluginThemeURL = "https://kyza.gq/Khub/" + downloadPath + "/" + downloadName + "/" + downloadName + "." + type + "." + type.replace("plugin", "js").replace("theme", "css");
        // Get the raw plugin/theme data and save it to a variable.
        $.get(pluginThemeURL, function(response) {
          var pluginThemeRaw = response;
          var element = document.createElement('a');
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pluginThemeRaw));

          if (getQueryVariable("theme")) {
            element.setAttribute('download', downloadName + "." + type + ".css");
          } else {
            element.setAttribute('download', downloadName + "." + type + ".js");
          }
          element.style.display = 'none';
          document.getElementById("body").appendChild(element);
          element.click();
          document.getElementById("body").removeChild(element);
        });
      });
      try {
        if (!document.getElementById("downloadButton")) {
          popupInner.prepend(downloadButton);
        }
      } catch (e) {}
    });
  }
}

function silentHash(hash) {
  window.history.replaceState({}, document.title, window.location.toString().split("#")[0] + hash);
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
}

// An interval to make sure that the popup is open or not.
// It also sets the place to scroll to.
setInterval(() => {
  if (window.location.search) {
    if (getQueryVariable("plugin") && getQueryVariable("version")) {
      openDownloadPopup(getQueryVariable("plugin"), getQueryVariable("version"))
    } else if (getQueryVariable("theme")) {
      openDownloadPopup(getQueryVariable("theme"), "theme")
    }
  } else if (document.getElementById("fadedBackground")) {
    document.getElementById("fadedBackground").style.opacity = "0";
    window.history.replaceState({}, document.title, window.location.toString().replace(window.location.search, ""));
    setTimeout(() => {
      if (document.getElementById("fadedBackground")) {
        document.body.style.overflowY = "scroll";
        document.getElementById("fadedBackground").remove();
      }
    }, 1000);
  } else if (!window.location.search) {
    document.getElementById("body").style.overflowY = "scroll";
  }
}, 100);

function getVersionFromPlugin(pluginText) {
  var lines = pluginText.split("\n");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(".prototype.getVersion = function() {") > -1) {
      return lines[i + 1].replace("return", "").replaceAll("\"", "").replaceAll("'", "").replace(";", "").trim();
    }
  }
  return "";
}

function getDescriptionFromPlugin(pluginText) {
  var lines = pluginText.split("\n");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(".prototype.getDescription = function() {") > -1) {
      return lines[i + 1].replace("return", "").replaceAll("\"", "").replaceAll("'", "").replace(";", "").trim();
    }
  }
  return "";
}

function offset(elem) {
  if (!elem) elem = this;

  var x = elem.offsetLeft;
  var y = elem.offsetTop;

  while (elem = elem.offsetParent) {
    x += elem.offsetLeft;
    y += elem.offsetTop;
  }

  return {
    left: x,
    top: y
  };
}

$(window).bind('load', () => {
  // If the user has navigated to one of the plugins or themes, open the popup for it right away.
  if (window.location.search) {
    if (getQueryVariable("plugin") && getQueryVariable("version")) {
      openDownloadPopup(getQueryVariable("plugin"), getQueryVariable("version"));
    } else if (getQueryVariable("theme")) {
      openDownloadPopup(getQueryVariable("theme"), "theme");
    }
  }

  // Change the hash to the closest hashable place.
  // The hashable place should be on the top half of the screen.
  // I am using an interval here because onscroll events don't account for the scrollbar being dragged.
  setInterval(() => {
    // Reserve the first 300 pixels of the screen for no hash.
    if (document.getElementById("body").scrollTop < 300) {
      silentHash("");
      return;
    }
    var locations = ["faq", "plugins", "themes"];

    var setHash = false;

    var smallest = {
      location: "",
      distance: 999999999999999999999999
    };

    for (var i = 0; i < locations.length; i++) {
      var location = locations[i];

      var distance = Math.abs(offset(document.getElementById(location)).top - document.getElementById("body").scrollTop);
      if (distance < smallest.distance) {
        smallest = {
          location: location,
          distance: distance
        };
      }
    }

    if (smallest.distance < $(document).height() / 2) {
      silentHash("#" + smallest.location);
    } else {
      silentHash("");
    }
  }, 100);

  // Get the latest plugin and theme info.
  $.get("https://kyza.gq/Khub/v1%20Plugins/SafeEmbedGenerator/SafeEmbedGenerator.plugin.js", function(response) {
    response = js_beautify(response, { indent_size: 2, space_in_empty_paren: false });
    var versionNumber = getVersionFromPlugin(response);
    var description = getDescriptionFromPlugin(response);

    document.getElementById("SafeEmbedGenerator-info").innerHTML = "Version: " + versionNumber;
    document.getElementById("SafeEmbedGenerator-info").innerHTML += "<br><br>";
    document.getElementById("SafeEmbedGenerator-info").innerHTML += description;
    document.getElementById("SafeEmbedGenerator-info").style.backgroundImage = "none";
    document.getElementById("SafeEmbedGenerator-info").style.height = "auto";
  });
  $.get("https://kyza.gq/Khub/v1%20Plugins/GhostMessage/GhostMessage.plugin.js", function(response) {
    response = js_beautify(response, { indent_size: 2, space_in_empty_paren: false });
    var versionNumber = getVersionFromPlugin(response);
    var description = getDescriptionFromPlugin(response);

    document.getElementById("GhostMessage-info").innerHTML = "Version: " + versionNumber;
    document.getElementById("GhostMessage-info").innerHTML += "<br><br>";
    document.getElementById("GhostMessage-info").innerHTML += description;
    document.getElementById("GhostMessage-info").style.backgroundImage = "none";
    document.getElementById("GhostMessage-info").style.height = "auto";
  });
  $.get("https://kyza.gq/Khub/v1%20Plugins/CustomDiscordIcon/CustomDiscordIcon.plugin.js", function(response) {
    response = js_beautify(response, { indent_size: 2, space_in_empty_paren: false });
    var versionNumber = getVersionFromPlugin(response);
    var description = getDescriptionFromPlugin(response);

    document.getElementById("CustomDiscordIcon-info").innerHTML = "Version: " + versionNumber;
    document.getElementById("CustomDiscordIcon-info").innerHTML += "<br><br>";
    document.getElementById("CustomDiscordIcon-info").innerHTML += description;
    document.getElementById("CustomDiscordIcon-info").style.backgroundImage = "none";
    document.getElementById("CustomDiscordIcon-info").style.height = "auto";
  });
  document.getElementById("DarkDarkTheme-info").style.backgroundImage = "none";
  document.getElementById("DarkDarkTheme-info").style.height = "auto";

  // Make sure the user is scrolled to the right position.
  if (window.location.toString().split("#")[1]) {
    // If the hash exists as an element, scroll to it.
    if (document.getElementById(window.location.toString().split("#")[1])) {
      $("#body").animate({
        scrollTop: $("#" + window.location.toString().split("#")[1]).offset().top
      });
      // If the hash does not exist as an element, remove it.
    } else {
      window.location.replace(window.location.toString().split("#")[0]);
    }
  }

  // Don't allow access to the page until it has been completely loaded.
  var transitionPanel1 = document.getElementById("transitionPanel1");
  var transitionPanel2 = document.getElementById("transitionPanel2");
  var transitionPanel3 = document.getElementById("transitionPanel3");
  var transitionPanel4 = document.getElementById("transitionPanel4");

  transitionPanel1.style.animationDuration = "1s";
  transitionPanel1.style.animationTimingFunction = "ease-in-out";
  transitionPanel1.style.animationDelay = "0s";
  transitionPanel1.style.animationIterationCount = "1";
  transitionPanel1.style.animationName = "slideAway1";
  transitionPanel1.style.animationFillMode = "forwards";

  transitionPanel2.style.animationDuration = "1s";
  transitionPanel2.style.animationTimingFunction = "ease-in-out";
  transitionPanel2.style.animationDelay = "0s";
  transitionPanel2.style.animationIterationCount = "1";
  transitionPanel2.style.animationName = "slideAway2";
  transitionPanel2.style.animationFillMode = "forwards";

  transitionPanel3.style.animationDuration = "1s";
  transitionPanel3.style.animationTimingFunction = "ease-in-out";
  transitionPanel3.style.animationDelay = "0s";
  transitionPanel3.style.animationIterationCount = "1";
  transitionPanel3.style.animationName = "slideAway3";
  transitionPanel3.style.animationFillMode = "forwards";

  transitionPanel4.style.animationDuration = "1s";
  transitionPanel4.style.animationTimingFunction = "ease-in-out";
  transitionPanel4.style.animationDelay = "0s";
  transitionPanel4.style.animationIterationCount = "1";
  transitionPanel4.style.animationName = "slideAway4";
  transitionPanel4.style.animationFillMode = "forwards";
});
