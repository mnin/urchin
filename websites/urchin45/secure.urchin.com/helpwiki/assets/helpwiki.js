// Copyright 2011 Google Inc. All Rights Reserved

/**
 * @fileoverview Common client-side operations for HelpWiki.
 * @author vpodkamenyi@google.com (Valentin Podkameny)
 * @author krayilo@google.com (Alex Krayilo)
 */

/**
 * Language chooser is untended for fast switching between different languages.
 */
window.chooser = new (function() {
  /**
   * Map of available languages.
   * @enum {Object<string, string>}
   * @private
   */
  var LANGS = {
    'de': 'Deutsch',
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'it': 'Italiano',
    'ja': '日本語',
    'ko': '한국어',
    'nl': 'Nederlands',
    'pt': 'Português (Brasil)',
    'cn': '中文 (简体)',
    'tw': '中文 (繁體)'
  };

  /**
   * Create langauge chooser dropdown box.
   */
  this.create = function() {
    var options = '';
    var current = this.getCurrent();
    for (var lang in LANGS) {
      options += '<option value="' + lang + '"' +
              (lang == current ? ' selected="selected"' : '') +
              '>' + LANGS[lang] + '</option>';
    }
    document.write('<select onchange="chooser.change(this.value)">' +
                   options + '</select>');
  };

  /**
   * Changes current language to specified {lang}.
   * @param {string} lang Language to change.
   */
  this.change = function(lang) {
    var current = this.getCurrent();
    location.href = location.pathname.replace('/' + current + '/',
                                              '/' + lang + '/');
  };

  /**
   * @return {string} Returns current language.
   */
  this.getCurrent = function() {
    var matches = location.pathname.match(/\/([a-z]{2})\//);
    return (matches && matches[1]) || 'en';
  }
})();

window.menu = new (function() {
  var MENU_ID = 'navibar';
  this.init = function() {
    update();
    window.attachEvent ? detachEvent('onload', self_.init) :                                                                                                                        
                         removeEventListener('load', self_.init, false);
  };

  var self_ = this;

  function update() {
    var lang = window.chooser.getCurrent();
    var ul = document.getElementById(MENU_ID);
    if (ul) {
      var links = ul.getElementsByTagName('A');
      for (var i=0; i<links.length; i++) {
        var a = links[i];
        var href = a.getAttribute('href').replace('https://secure.urchin.com/en/', '/' + lang + '/');
        a.setAttribute('href', href);
        if (location.pathname == a.pathname) {
          a.parentNode.className = a.parentNode.className + ' current';
        }
      }
    }
  }

  window.attachEvent ? attachEvent('onload', self_.init) :
                       addEventListener('load', self_.init, false);
})();


/**
 *
 */
window.search = new (function() {
  /**
   * @const
   * @type {string}
   */
  var BASE_URL = 'https://secure.urchin.com/helpwiki/';

  /**
   * @const
   * @type {string}
   */
  var ROOT_ID = 'gcs-root';

  /**
   * @const
   * @type {string}
   */
  var CONTENT_ID = 'content';

  /**
   * @const
   * @type {string}
   */
  var CONTROL_ID = 'searchcontrol';

  /**
   * @private
   * @type {HTMLElement}
   */
  var root_ = null;

  /**
   * @private
   * @type {HTMLElement}
   */
  var content_ = null;

  /**
   * @private
   * @return {HTMLElement} Returns root element.
   */
  function getRoot_() {
    if (!root_) {
      content_ = document.getElementById(CONTENT_ID);
      if (content_) {
        root_ = content_.insertBefore(document.createElement('DIV'),
                                      content_.firstChild);
        root_.id = ROOT_ID;
      }

    }
    return root_;
  }

  /**
   * @private
   */
  function searchComplete_() {
    if (content_ && root_) {
      for (var i=0; i<content_.childNodes.length;) {
        var node = content_.childNodes[i++];
        if (node.style && node != root_) node.style.display = 'none';
      }
    }
  }

  /**
   * Initialize a search control element and its events handlers.
   * Depends on language chooser {chooser.getCurrent}.
   * @private
   */
  function init_() {
    var searchControl = new google.search.SearchControl();
    searchControl.setLinkTarget(google.search.Search.LINK_TARGET_SELF);
    searchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);

    var searchOptions = new google.search.SearcherOptions();  
    searchOptions.setExpandMode(google.search.SearchControl.EXPAND_MODE_OPEN);
    searchOptions.setRoot(getRoot_() || document.body);

    var webSearch = new google.search.WebSearch();
    webSearch.setSiteRestriction(BASE_URL + chooser.getCurrent() + '/');

    var extendedArgs = google.search.Search.RESTRICT_EXTENDED_ARGS;
    webSearch.setRestriction(extendedArgs, {gl: chooser.getCurrent()});

    searchControl.addSearcher(webSearch, searchOptions);

    searchControl.setSearchCompleteCallback(null, searchComplete_);

    var drawOptions = new google.search.DrawOptions();
    drawOptions.setDrawMode(google.search.SearchControl.DRAW_MODE_TABBED);

    searchControl.draw(document.getElementById(CONTROL_ID), drawOptions);
  }

  google.load('search', '1');
  google.setOnLoadCallback(init_);
})();