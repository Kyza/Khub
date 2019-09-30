# KSS

# This README.md is not up to date.
# While it still gives the basica purpose of KSS,
# it is not finished and does not cover the extent of what KSS will be.

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

First off, here is your plugin skeleton.

This starts you off with a BDv2 style plugin that handles all the dirty stuff such as including both ZeresPluginLibrary and KSS.

```

```

That combination is perfect for easily making your theme plugin.

Simply make a new file titled `ThemeName.plugin.js` and paste this code inside.

Next, `Ctrl+F` and replace `ThemeName` with your actual theme name.

Finally, fill in all the metadata and you're all set!
