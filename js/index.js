String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

function getQueryParams() {
  let search = window.location.search;
  let queries = search.split("&");
  let params = {};
  for (let i = 0; i < queries.length; i++) {
    params[queries[i].split("=")[0].replace("?", "")] = queries[i].split("=")[1];
  }
  return params;
}

function getBase() {
  return window.location.href.replace(window.location.search, "");
}

if (getQueryParams().plugin) {
  console.log("in");
  
  let button = document.querySelector(
    "#" + getQueryParams().plugin + "-button"
  );
  if (button) {
    openDownloadModal(button);
  }
} else if (getQueryParams().theme) {
  let button = document.querySelector(
    "#" + getQueryParams().theme + "-button"
  );
  if (button) {
    openDownloadModal(button);
  }
}

var converter = new showdown.Converter();

var buttons = document.querySelectorAll(`#buttons [id*="-button"]`);

for (let i = 0; i < buttons.length; i++) {
  let button = buttons[i];
  button.onclick = () => {
    openDownloadModal(button);
  };
}

document.querySelector("#download-modal-close").onclick = closeDownloadModal;

function openDownloadModal(button) {
  history.replaceState({}, document.title, `${getBase()}?${button.className.indexOf("plugin") > -1 ? "plugin" : "theme"}=${button.id.replace("-button", "")}`);
  document.querySelector("#body").style =
    "transition-duration: 1s; filter: grayscale(100%); overflow: hidden;";
  get(
    `https://khub.kyza.net/${
      button.className.indexOf("plugin") > -1 ? "Plugins" : "Themes"
    }/${button.id.replace("-button", "")}/README.md`,
    (markdown) => {
      var lines = markdown.split("\n");
      var finishedMarkdown = button.className.indexOf("unofficial") > -1 ? `<h1 align="center">! Unofficial ${button.className.indexOf("plugin") > -1 ? "Plugin" : "Theme"} !</h1>\n` : "";
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("- [x]") == 0) {
          lines[i] = lines[i].replace(
            "- [x]",
            `<br><input type="checkbox" disabled checked>`
          );
        } else if (lines[i].indexOf("- [ ]") == 0) {
          lines[i] = lines[i].replace(
            "- [ ]",
            `<br><input type="checkbox" disabled>`
          );
        }
        finishedMarkdown += lines[i] + "\n";
      }

      document.querySelector(
        "#download-modal-content"
      ).innerHTML = converter.makeHtml(finishedMarkdown);
      document.querySelector("#download-modal").className = "open";
      document.querySelector("#download-modal-download").onclick = () => {
        downloadBDAddon(button);
      };
    },
    (error) => {
      closeDownloadModal();
    }
  );
}

function closeDownloadModal() {
  document.querySelector("#download-modal").className = "closed";
  document.querySelector("#body").style =
    "transition-duration: 1s; filter: grayscale(0%); overflow: auto;";
  setTimeout(() => {
    document.querySelector("#download-modal-content").innerHTML = "";
    document.querySelector("#download-modal-download").onclick = () => {};
  }, 400);
}

function downloadBDAddon(button) {
  let name = button.id.replace("-button", "");
  let type = button.className.indexOf("plugin") > -1 ? "plugin" : "theme";

  get(
    `https://raw.githubusercontent.com/KyzaGitHub/Khub/master/${
      type == "plugin" ? "Plugins" : "Themes"
    }/${name}/${name}.plugin.js`,
    (addon) => {
      // Create an invisible A element
      let a = document.createElement("a");
      a.style.display = "none";
      a.download = `${name}.plugin.js`;
      document.body.appendChild(a);

      // Set the HREF to a Blob representation of the data to be downloaded
      a.href = window.URL.createObjectURL(new Blob([addon], { type }));

      // Trigger the download by simulating click
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
      delete a;
    }
  );
}

function get(url, callback, error) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send(null);
}
