// Copyright 2010 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file holds all the Urchin sitewide scripts. These files
 *     require gweb to run correctly.
 *
 * @author mrigoli@google.com (Mike Rigoli)
 */

// Create namespace, if it doesn't already exist.
var urchin = window.urchin || {};
urchin.base = urchin.base || {};

/**
 * The function changeLanguage changes the page directory
  */
urchin.base.changeLanguage = function() {
  var languageSelect = gweb.dom.getElement('language');
  window.location = languageSelect.options[languageSelect.selectedIndex].value +
      window.location.href.split('/').pop();
};

/**
 * The function urchin.base.init fires off Google Analytics and attaches a listener to
 *     the language dropdown.
  */
urchin.base.init = function() {
  var lang = gweb.dom.getElement('language');
  gweb.events.listen(lang, 'change', urchin.base.changeLanguage);
};
