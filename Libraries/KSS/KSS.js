String.prototype.replaceAll = function(find, replace) {
    var str = this;
    return str.replace(
      new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),
      replace
    );
  };
  
  KSS.selectors = {
    chat: new ZLibrary.DOMTools.Selector(ZLibrary.WebpackModules.getByProps("chat").chat),
    channelTextArea: `${new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("channelTextArea").channelTextArea
    )} > [class*="inner"]`,
    titleBar: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("titleBar").titleBar
    ),
    searchBar: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("searchBar").searchBar
    ),
    autocomplete: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("autocomplete").autocomplete
    ),
    autocompleteRow: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("autocompleteRow").autocompleteRow
    ),
    autocompleteSelectorSelected: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("autocomplete").selectorSelected
    ),
    channelTitleBar: `.title-3qD0b-`,
    serverTitleBar: `.container-2Rl01u.clickable-2ap7je`,
    emojiPicker: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("emojiPicker").emojiPicker
    ),
    category: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("category").category
    ),
    emojiSearchBar: `.inner-3ErfOT`,
    emojiItem: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("emojiItem").emojiItem
    ),
    emojiItemSelected: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("emojiItem").selected
    ),
    emojiItemCategories: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("emojiItem").categories
    ),
    emojiItemItem: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("emojiItem").item
    )
  };
  
  KSS.parse = (kss) => {
    for (const selector in KSS.selectors) {
      kss = kss.replaceAll(
        `|${selector}|`,
        (KSS.selectors[selector].value
          ? KSS.selectors[selector].value
          : KSS.selectors[selector]
        ).trim()
      );
    }
    return kss;
  };
  
  KSS.parse("what");
  