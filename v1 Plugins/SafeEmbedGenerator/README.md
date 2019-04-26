# SafeEmbedGenerator

This BetterDiscord plugin adds a button to the right of your text box which allows you to create safe embeds with ease.

<img src="media/live.gif?raw=true">

![https://imgur.com/8IGwGGa.png](https://imgur.com/8IGwGGa.png)

## Usage

 * Provider Name: The provider name field of the embed. Must be less than 256 characters.
 * Provider URL: The link associated with the provider name.
 * Author Name: The author name field of the embed. Must be less than 256 characters.
 * Author URL: The link associated with the author name.
 * Description: The string that goes into the body of the embed. Must be less than 2048 characters.
 * Image URL: A link to an image.
 * Image Banner Mode: Changes the image to a banner. Displays as a normal image if no text is in the embed. You cannot use `Provider Name` or `Description` if this is enabled unless you use `Author Name`.
 * Color: The color of the embed, in rrggbb format (without the #). Must be exactly 6 characters long if used.

## Changelog

### 1.2.12

 * Fixed a major bug in the logic which made the plugin unusable in DMs.

### 1.2.11

 * Fixed a major bug which made it so that if someone was not in one of the BetterDiscord servers they couldn't send embeds anywhere.

### 1.2.10

 * Disallowed the use of this plugin on the BetterDiscord servers to prevent spamming.

### 1.2.9

 * Fixed a major bug where the plugin crashes after restarting Discord.

### 1.2.8.5

 * Fixed a bug inside of the previous bug which still allowed blank embeds.

### 1.2.8

 * Fixed a minor bug which allowed you to send blank embeds.

### 1.2.7

 * The embed icon now only appears if you are able to send embeds.

### 1.2.6

 * Fixed a major bug where users were unable to send embedded links in DMs.

### 1.2.5

 * Added a small safeguard to prevent users from sending embed links in channels where doing so is disabled.

### 1.2.4

 * Optimized embed preview image loading.
 * Added a loading GIF for the embed preview images.
 * Fixed a major bug where the embed preview would reopen while loading large GIFs or images.

### 1.2.3

 * Optimized text for readability.

### 1.2.2

 * Removed useless code.
 
### 1.2.1

 * Lightened the color of the UI to match the dark mode standard.
 * Fixed a bug where the plugin behaves as the older version after updating until the user switches channels.

### 1.2.0

 * Added live embed previews.

### 1.1.0

 * Changed the API.
 * Added update handling.

### 1.0.0

 * Release.

## Planned Feature

 * Recently used embeds.
 * Saved embeds.
 * General settings.
 * Save the last used color.

## Credits

This plugin is currently using a [new API](https://em.0x71.cc/).
Thanks to `Qwerasd#5202`for creating this API. 


### Lucario's API is no longer used in this plugin.

Thanks to `Lucario ☉ ∝ x²#7902` for creating [the API](https://em.my.to/) that this plugin uses.
