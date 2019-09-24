# KSS

## Easy CSS for BetterDiscord.

## What is this?

KSS is a JavaScript library and a form of CSS made for BetterDiscord theme developers.

## Theme developers? What?

### You read that right, theme developers.

Have you ever tried styling Discord using a plugin?

It's easier than you think with KSS, even if you don't know much JavaScript as a theme developer!

## Why not just use pure CSS? Why a plugin?

Using KSS/a plugin to style Discord gives you many advantages over pure CSS.

Here is a list of just some of them.

 * Automatic updating like plugins with easy changelogs.
 * More complex theme settings.
   * Toggling entire modular stylesheets on and off.
   * A file picker to let your users upload their own background.
 * No (or at least much less) forcing your users to redownload your themes.
   * There is no main stylesheet, so no more redownloading to add/remove settings.
 * No re-disabling the cache to update your themes right away.
   * Your themes will update quickly, within minutes of an update being pushed.
 * More advanced styles using JavaScript and Discord's React data.
   * Ever been not quite able to find a solution using pure CSS? Using JavaScript you can.

## Getting Started

### WIP

Include this JavaScript in your plugin file.

### Still WIP going to make this ask first later.

```
if (!document.querySelector("#KSSLibrary")) {
  BdApi.showConfirmationModal(
    "Just a minute, there!",
    [
      `By clicking "I Agree" you agree to allow this plugin to include an external library called `,
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
        this.init();
      },
      onCancel: () => {
        var pluginName = this.getName();
        var pluginInfo = bdplugins[pluginName];
        var bIsPluginEnabled = pluginCookie[pluginName];
        try {
          if (
            bIsPluginEnabled &&
            pluginInfo.plugin &&
            pluginInfo.plugin.stop
          ) {
            pluginCookie[pluginName] = false;
            pluginInfo.plugin.stop();
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  );
} else {
  this.init();
}
```
