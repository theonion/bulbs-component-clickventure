require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

(function (global, $) {

  var analyticsManager = require('bulbs-public-analytics-manager/src/analytics-manager');

  // default options to use when constructing Clickventure, can be passed in and overridden
  var defaultOptions = {
    // time in ms taken to align with top when user interaction occurs
    alignmentDuration: 300,
    // offset for alignment when user interaction occurs, should account for any
    //  nav bars that might block the top of the clickventure content
    alignmentOffset: -60,
    // use hash for location
    hashState: false,
    // prevent initial alignment with clickventure container when loading
    preventFirstAlignment: false
  };

  // custom page transitions
  $.Velocity
    .RegisterUI('transition.turnPageIn', {
      defaultDuration: 200,
      calls: [
        [{
          opacity: [1, 0.5],
          transformPerspective: [800, 800],
          rotateY: [0, 'easeInQuad', 90]
        }]
      ],
      reset: {
        transformPerspective: 0
      }
    })
    .RegisterUI('transition.turnPageOut', {
      defaultDuration: 200,
      calls: [
        [{
          opacity: [0.5, 1],
          transformPerspective: [800, 800],
          rotateY: [-90, 'easeInQuad']
        }]
      ],
      reset: {
        transformPerspective: 0,
        rotateY: 0
      }
    });

  // available node transitions
  var NODE_TRANSITIONS = {
    default: {
      show: {
        fx: 'transition.slideRightIn'
      },
      hide: {
        fx: 'transition.slideLeftOut'
      }
    },
    flipLeft: {
      show: {
        fx: 'transition.turnPageIn'
      },
      hide: {
        fx: 'transition.turnPageOut'
      }
    },
    slideLeft: {
      show: {
        fx: 'transition.slideRightIn'
      },
      hide: {
        fx: 'transition.slideLeftOut'
      }
    },
    slideRight: {
      show: {
        fx: 'transition.slideLeftIn'
      },
      hide: {
        fx: 'transition.slideRightOut'
      }
    },
    slideDown: {
      show: {
        fx: 'transition.slideDownIn'
      },
      hide: {
        fx: 'transition.slideDownOut'
      }
    },
    slideUp: {
      show: {
        fx: 'transition.slideUpIn'
      },
      hide: {
        fx: 'transition.slideUpOut'
      }
    }
  };

  // clickventure object
  var Clickventure = function (element, options) {

    this.element = $(element);
    this.options = $.extend({}, defaultOptions, options);
    this.doAlign = !this.options.preventFirstAlignment;

    // set up all node links
    var clickventure = this;
    this.element.find('.clickventure-node-link-button').each(function (i, el) {
      $(el).on('click', function (event) {
        var $dataContainer = $(this).closest('.clickventure-node-link');
        var targetNode = $dataContainer.data('targetNode');
        var transitionName = $dataContainer.data('transition');
        analyticsManager.trackPageView(false, transitionName);
        clickventure.gotoNodeId(targetNode, transitionName);
      });
    });

    // restart button
    this.element.find('.clickventure-node-finish-links-restart').click(function (event) {
      event.preventDefault();
      clickventure.gotoStartNode();
    });

    // show start element
    var hash = window.location.hash;
    if (hash && this.options.hashState) {
      this.gotoHash(hash);
    } else {
      this.gotoStartNode();
    }
  };

  /**
   * Align top of clickventure to some offset. First call to this function is
   *  skipped if preventFirstAlignment option is set to true.
   */
  Clickventure.prototype.alignWithTop = function () {
    // align only if preventFirstAlignment is false, or at least one call to this
    //  function has occurred
    if (this.doAlign) {
      // scroll the window to given offset
      this.element.velocity('scroll', {
        duration: this.options.alignmentDuration,
        offset: this.options.alignmentOffset
      });
    }
    // at least one call has been made, allow all other future calls
    this.doAlign = true;
  };

  /**
   * Send UI to node id with the given node transition provided by given hash.
   *
   * For example, the url "www.clickhole.com/clickventure/my-first-cv-123#5,slideRight"
   *  has the hash "#5,slideRight", which will tell this function to go to node
   *  number 5, with a "slideRight" transition. Note, node name can be used in
   *  place of node id.
   *
   * @param {string} hash - hash string provided in url.
   */
  Clickventure.prototype.gotoHash = function (hash) {
    // remove the pound sign
    var cleanHash = hash.substr(1, hash.length - 1);
    // split on comma to get the node id and transition type
    var parts = cleanHash.split(',');
    // extract node id
    var id = parts[0];
    if (id) {
      // extract transition
      var transition = parts[1];
      // check which transition function should be used
      if (isNaN(id)) {
        this.gotoNodeNamed(id, transition);
      } else {
        this.gotoNode(id, transition);
      }
    }
  };

  /**
   * Go to a random start node.
   *
   * @param {string} transitionName - transition to use when going to start node.
   */
  Clickventure.prototype.gotoStartNode = function (transitionName) {
    // find all start nodes and choose a random one to go to
    var startNodes = this.element.find('.clickventure-node-start');
    var node = startNodes[Math.floor(startNodes.length * Math.random())];

    if (node) {
      // have at least one node, go to it
      var nodeId = $(node).data('nodeId');
      if (nodeId) {
        this.gotoNodeId(nodeId, transitionName);
      }
    }
  };

  /**
   * Go to a node by name.
   *
   * @param {string} name - name of node to go to.
   * @param {string} transitionName - name of transition to use when going to node.
   */
  Clickventure.prototype.gotoNodeNamed = function (name, transitionName) {
    // find node with given name
    var node = this.element.find('[data-node-name="' + name + '"]');

    if (node.length) {
      // found a node by name, go to it
      var nodeId = node.data('nodeId');
      if (nodeId) {
        this.gotoNodeId(nodeId, transitionName);
      }
    }
  };

  /**
   * Go to a node by id, setting the url hash to #<nodeId>,<transitionName>.
   *
   * @param {string} nodeId - id of node to go to.
   * @param {string} transitionName - name of transition to use when going to node.
   */
  Clickventure.prototype.gotoNodeId = function (nodeId, transitionName) {
    if (this.options.hashState) {
      // using hash state, set hash in url
      document.location.hash = [nodeId, transitionName].join(',');
    }

    this.gotoNode(nodeId, transitionName);
  };

  /**
   * Use transition to show a node given by id.
   *
   * @param {string} nodeId - id of node to show.
   * @param {string} transition - transition to use for showing node.
   */
   Clickventure.prototype.showNewNode = function (nodeId, transition) {
     // node to display
    var newNode = this.element.find('#clickventure-node-' + nodeId);

    // start transition
    newNode.velocity(transition.show.fx, {
      duration: 200,
      complete: (function () {
        // make node active
        newNode.addClass('clickventure-node-active');

        // transition node in
        newNode.find('.clickventure-node-link').velocity('transition.slideDownIn', {
          duration: 300,
          stagger: 100
        });

        // prep node
        picturefill(newNode);

        // trigger page change complete event
        this.element.trigger('clickventure-page-change-complete', [this]);
      }).bind(this)
    });
  };

  /**
   * Go to a given node by id.
   *
   * @param {string} nodeId - id of node to go to.
   * @param {string} transitionName - name of transition to use when going to node.
   */
  Clickventure.prototype.gotoNode = function (nodeId, transitionName) {

    // find active node, and transition to use
    var activeNode = this.element.find('.clickventure-node-active');
    var transition = NODE_TRANSITIONS[transitionName || 'default'];

    // align with top of node
    this.alignWithTop();

    // trigger page change event
    this.element.trigger('clickventure-page-change-start', [this]);

    // hide existing page if there is one
    if (activeNode.length > 0) {
      // start transition
      activeNode.velocity(transition.hide.fx, {
        duration: 200,
        complete: (function () {

          // hide existing node
          activeNode.removeClass('clickventure-node-active');

          // transition into new node
          this.showNewNode(nodeId, transition);

        }).bind(this)
      });
    } else {
      this.showNewNode(nodeId, transition);
    }
  };

  // set clickventure object on window
  global.Clickventure = Clickventure;

})(window, jQuery);

},{"bulbs-public-analytics-manager/src/analytics-manager":4}],2:[function(require,module,exports){
/**
 * Utility functions for ad loading because we want to load the ads module ASAP,
 *  before any other JS libs that might provide these functions.
 */
var Utils = {

  /**
   * Extend given object by given non-parameterized arguments.
   *
   * @param {object} out - object to extend.
   * @returns {object} extended object.
   */
  extend: function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i])
        continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          out[key] = arguments[i][key];
      }
    }

    return out;
  },

  /**
   * Test if given element has a given class.
   *
   * @param {Element} el - element to test.
   * @param {string} className - class name to test for.
   * @returns true if element has given class, false otherwise.
   */
  hasClass: function (el, className) {
    return el.className && !!el.className.match('(^|\\s)' + className + '($|\\s)');
  },

  /**
   * Remove a given class from given element.
   *
   * @param {Element} el - element to remove class from.
   * @param {string} className - class to remove.
   */
  removeClass: function (el, className) {
    el.className = el.className.replace(new RegExp('(^|\\s)' + className + '($|\\s)', 'g'), ' ');
  },

  /**
   * Add a given class to given element.
   *
   * @param {Element} el - element to add class to.
   * @param {string} className - class name to add.
   */
  addClass: function (el, className) {
    if (!Utils.hasClass(el, className)) {
      el.className += ' ' + className;
    }
  }
};

module.exports = Utils;

},{}],3:[function(require,module,exports){
var _AnalyticsIngestError = function (message) {
  this.name = 'AnalyticsIngestError';
  this.message = message || '';

  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
};
_AnalyticsIngestError.prototype = Object.create(Error.prototype);

var AnalyticsIngest = {
  /**
   * Sends the page information to the ingestion endpoint
   */
  sendEvent: function (endpoint) {

    if (typeof(endpoint) !== 'string') {
      throw new _AnalyticsIngestError('Ingest endpoint must be set!');
    }

    var cacheBuster = (new Date()).getTime();

    var url =
      endpoint +
      '?' + cacheBuster +
      '&hostname=' + window.location.hostname +
      '&pathname=' + window.location.pathname +
      '&search=' + window.location.search;

    setTimeout(function () {
      var img = new Image();
      img.src = url;
    });
  }
};

module.exports = AnalyticsIngest;

},{}],4:[function(require,module,exports){
var Ingest = require('./analytics-ingest/analytics-ingest');

var _AnalyticsManagerError = function (message) {
  this.name = 'AnalyticsManagerError';
  this.message = message || '';

  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
};
_AnalyticsManagerError.prototype = Object.create(Error.prototype);

var AnalyticsManager = {

  init: function(options) {
    this._settings = $.extend({
      site: '',
      ingestUrl: '',
      searchQueryParam: 'q',
    }, options);

    if (!this._settings.site) {
      throw new _AnalyticsManagerError('Site name must be specified!');
    }

    this.trackedPaths = [];
    var body = document.getElementsByTagName('body');
    body[0].addEventListener('click', this.trackClick);
  },

  getWindowLocation: function () {
    return window.location;
  },

  trackClick: function(event) {
    var trackedElement = $(event.target).closest('[data-track-category]');
    var category = trackedElement.data('track-category');

    if (!category) {
      return;
    } else {
      if (AnalyticsManager.debugMode()) {
        event.preventDefault();
      }
      var trackedEvent = AnalyticsManager.trackedEvent($(event.target));
      AnalyticsManager.sendEvent(trackedEvent);
    }
  },

  debugMode: function() {
    return window.analyticsTest || false;
  },

  dataAttribute: function(element, dataAttrKey) {
    return element.data(dataAttrKey) || element.closest('[data-' + dataAttrKey + ']').data(dataAttrKey);
  },

  trackedEvent: function(trackedElement) {
    return {
      eventCategory: AnalyticsManager.dataAttribute(trackedElement, 'track-category'),
      eventAction: AnalyticsManager.dataAttribute(trackedElement, 'track-action'),
      eventLabel: AnalyticsManager.dataAttribute(trackedElement, 'track-label')
    };
  },

  comscoreBeacon: function() {
    if (window.COMSCORE) {
      COMSCORE.beacon({ c1: 2, c2: 6036328, c3: "", c4: "", c5: "", c6: "", c15: "" });
    } else {
      console.warn('COMSCORE not available');
    }
  },

  sendComscorePixel: function(freshPage, title) {
    if(freshPage) {
      this.comscoreBeacon();
    } else {
      $.get("/t/pageview_candidate.xml?title=" + encodeURIComponent( title ) + "&rand=" + Math.round(Math.random() * 10000000));
      this.comscoreBeacon();
    }
  },

  sendQuantcastPixel: function(freshPage) {
    if (!freshPage) {
      if (window._qevents) {
        _qevents.push({ qacct:"p-39FYaAGOYli_-", 'event': "refresh" });
      } else {
        console.warn('_qevents not available');
      }
    }
  },

  sendChartbeatEvent: function(title) {
    var path = this.getWindowLocation().pathname;
    if (window.pSUPERFLY) {
      window.pSUPERFLY.virtualPage(path, title);
    } else {
      console.warn('pSUPERFLY not available');
    }
  },

  getParameterByName: function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(this.getWindowLocation().search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },

  getNodeHash: function(hash) {
    if (hash) {
      var re = RegExp('#\[A-Za-z0-9-]+');
      var results = hash.match(re);
      if (results && hash.search(re) === 0) {
        return results[0];
      }
    }
  },

  pathInfo: function () {
    var pathInfo;
    var windowLocation = this.getWindowLocation();
    var path = windowLocation.pathname;
    var hash = this.getNodeHash(windowLocation.hash);
    if (hash) {
      path += hash;
    }
    var searchQuery = this.getParameterByName(this._settings.searchQueryParam);
    if (searchQuery.length) {
      pathInfo = path + '?' + this._settings.searchQueryParam + '=' + searchQuery;
    } else {
      pathInfo = path;
    }
    return pathInfo;
  },

  trackPageView: function(freshPage, optionalTitle) {
    var path = this.pathInfo();
    if (this.trackedPaths.indexOf(path) < 0) {
      ga('send', 'pageview', path);
      ga('adTracker.send', 'pageview', this._settings.site + path);

      this.sendQuantcastPixel(freshPage);
      this.sendComscorePixel(freshPage, optionalTitle);

      Ingest.sendEvent(this._settings.ingestUrl);

      if (!freshPage) {
        this.sendChartbeatEvent(optionalTitle);
      }
      this.trackedPaths.push(path);
    }
  },

  sendEvent: function(trackedEvent) {
    if ((typeof(trackedEvent.eventCategory) === 'undefined') ||
      (typeof(trackedEvent.eventAction) === 'undefined') ||
      (typeof(trackedEvent.eventLabel) === 'undefined')) {
      return;
    }

    if (AnalyticsManager.debugMode()) {
      console.log(trackedEvent);
    } else {
      ga('send', 'event', trackedEvent);
    }
  }
};

module.exports = AnalyticsManager;

},{"./analytics-ingest/analytics-ingest":3}],"bulbs.ads.units":[function(require,module,exports){
'use strict';

var utils = require('../../../../bower_components/bulbs-public-ads-manager/src/utils');

var AdUnits = {

  settings: {
    dfpSite: 'clickhole',
    filterSlotsByViewport: 400
  },

  makeAdCloseable: function(adElement) {
    var closeButton = document.createElement('div');
    utils.addClass(closeButton, 'close-btn');
    utils.addClass(adElement.parentElement, 'pinned');
    adElement.appendChild(closeButton);
    return closeButton;
  },

  closeAd: function(adElement) {
    clickholean.sendEvent({
      eventCategory: 'ads',
      eventAction: 'close',
      eventLabel: ''
    });
    adElement.parentElement.removeChild(adElement);
  },

  prependSite: function(baseSlotName) {
    return this.settings.dfpSite + '_' + baseSlotName;
  }
};

AdUnits.units = {
  'header': {
    'slotName': 'header',
    'sizes': [
      [[970, 0], [[728, 90], [970, 250], [970, 90], [970, 415]]],
      [[728, 0], [728, 90]],
      [[0, 0], [320, 50]]
    ],
    onSlotRenderEnded: function(e, el) {
      try {
        if (e.slot.getName() === '/1009948/header') {
          utils.addClass(document.getElementById(e.slot.getSlotElementId()), 'ad-loaded');
        }
        utils.removeClass(el.parentElement, 'pinned');
        if ((e.size[0] === 728) && (e.size[1] === 90)) {
          var close_button = AdUnits.makeAdCloseable(el);
          if('ontouchend' in document.documentElement) {
            close_button.addEventListener('touchend', AdUnits.closeAd.bind(null, el), false);
          } else {
            close_button.addEventListener('click', AdUnits.closeAd.bind(null, el), false);
          }
        }
      } catch(err) {
        console.error('Error with header slot', err);
      }
    }
  },

  'mobile-primary': {
    'slotName': 'sidebar-primary',
    'sizes': [
      [[600, 0], []],
      [[0, 0], [300, 250]],
    ]
  },

  'sidebar-primary': {
    'slotName': 'sidebar-primary',
    'sizes': [
      [[600, 0], [[300, 250]]],
      [[0, 0], []],
    ]
  },

  'sidebar-secondary': {
    'slotName': 'sidebar-secondary',
    'sizes': [
      [[0, 0], [300, 250]],
    ]
  }
};

module.exports = AdUnits;

},{"../../../../bower_components/bulbs-public-ads-manager/src/utils":2}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3d3dy9jbGlja2hvbGUvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2xvY2FsL2xpYi9weXRob24yLjcvc2l0ZS1wYWNrYWdlcy9idWxic19jb21wb25lbnRfY2xpY2t2ZW50dXJlX3B1YmxpYy9zdGF0aWMvY2xpY2t2ZW50dXJlL2pzL2NsaWNrdmVudHVyZS5icm93c2VyaWZ5LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vd3d3L2NsaWNraG9sZS9ib3dlcl9jb21wb25lbnRzL2J1bGJzLXB1YmxpYy1hZHMtbWFuYWdlci9zcmMvdXRpbHMuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi93d3cvY2xpY2tob2xlL2Jvd2VyX2NvbXBvbmVudHMvYnVsYnMtcHVibGljLWFuYWx5dGljcy1tYW5hZ2VyL3NyYy9hbmFseXRpY3MtaW5nZXN0L2FuYWx5dGljcy1pbmdlc3QuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi93d3cvY2xpY2tob2xlL2Jvd2VyX2NvbXBvbmVudHMvYnVsYnMtcHVibGljLWFuYWx5dGljcy1tYW5hZ2VyL3NyYy9hbmFseXRpY3MtbWFuYWdlci5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3d3dy9jbGlja2hvbGUvY2xpY2tob2xlL3N0YXRpYy9qcy9hZHMvYWRVbml0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbihmdW5jdGlvbiAoZ2xvYmFsLCAkKSB7XG5cbiAgdmFyIGFuYWx5dGljc01hbmFnZXIgPSByZXF1aXJlKCdidWxicy1wdWJsaWMtYW5hbHl0aWNzLW1hbmFnZXIvc3JjL2FuYWx5dGljcy1tYW5hZ2VyJyk7XG5cbiAgLy8gZGVmYXVsdCBvcHRpb25zIHRvIHVzZSB3aGVuIGNvbnN0cnVjdGluZyBDbGlja3ZlbnR1cmUsIGNhbiBiZSBwYXNzZWQgaW4gYW5kIG92ZXJyaWRkZW5cbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIC8vIHRpbWUgaW4gbXMgdGFrZW4gdG8gYWxpZ24gd2l0aCB0b3Agd2hlbiB1c2VyIGludGVyYWN0aW9uIG9jY3Vyc1xuICAgIGFsaWdubWVudER1cmF0aW9uOiAzMDAsXG4gICAgLy8gb2Zmc2V0IGZvciBhbGlnbm1lbnQgd2hlbiB1c2VyIGludGVyYWN0aW9uIG9jY3Vycywgc2hvdWxkIGFjY291bnQgZm9yIGFueVxuICAgIC8vICBuYXYgYmFycyB0aGF0IG1pZ2h0IGJsb2NrIHRoZSB0b3Agb2YgdGhlIGNsaWNrdmVudHVyZSBjb250ZW50XG4gICAgYWxpZ25tZW50T2Zmc2V0OiAtNjAsXG4gICAgLy8gdXNlIGhhc2ggZm9yIGxvY2F0aW9uXG4gICAgaGFzaFN0YXRlOiBmYWxzZSxcbiAgICAvLyBwcmV2ZW50IGluaXRpYWwgYWxpZ25tZW50IHdpdGggY2xpY2t2ZW50dXJlIGNvbnRhaW5lciB3aGVuIGxvYWRpbmdcbiAgICBwcmV2ZW50Rmlyc3RBbGlnbm1lbnQ6IGZhbHNlXG4gIH07XG5cbiAgLy8gY3VzdG9tIHBhZ2UgdHJhbnNpdGlvbnNcbiAgJC5WZWxvY2l0eVxuICAgIC5SZWdpc3RlclVJKCd0cmFuc2l0aW9uLnR1cm5QYWdlSW4nLCB7XG4gICAgICBkZWZhdWx0RHVyYXRpb246IDIwMCxcbiAgICAgIGNhbGxzOiBbXG4gICAgICAgIFt7XG4gICAgICAgICAgb3BhY2l0eTogWzEsIDAuNV0sXG4gICAgICAgICAgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IFs4MDAsIDgwMF0sXG4gICAgICAgICAgcm90YXRlWTogWzAsICdlYXNlSW5RdWFkJywgOTBdXG4gICAgICAgIH1dXG4gICAgICBdLFxuICAgICAgcmVzZXQ6IHtcbiAgICAgICAgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IDBcbiAgICAgIH1cbiAgICB9KVxuICAgIC5SZWdpc3RlclVJKCd0cmFuc2l0aW9uLnR1cm5QYWdlT3V0Jywge1xuICAgICAgZGVmYXVsdER1cmF0aW9uOiAyMDAsXG4gICAgICBjYWxsczogW1xuICAgICAgICBbe1xuICAgICAgICAgIG9wYWNpdHk6IFswLjUsIDFdLFxuICAgICAgICAgIHRyYW5zZm9ybVBlcnNwZWN0aXZlOiBbODAwLCA4MDBdLFxuICAgICAgICAgIHJvdGF0ZVk6IFstOTAsICdlYXNlSW5RdWFkJ11cbiAgICAgICAgfV1cbiAgICAgIF0sXG4gICAgICByZXNldDoge1xuICAgICAgICB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogMCxcbiAgICAgICAgcm90YXRlWTogMFxuICAgICAgfVxuICAgIH0pO1xuXG4gIC8vIGF2YWlsYWJsZSBub2RlIHRyYW5zaXRpb25zXG4gIHZhciBOT0RFX1RSQU5TSVRJT05TID0ge1xuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHNob3c6IHtcbiAgICAgICAgZng6ICd0cmFuc2l0aW9uLnNsaWRlUmlnaHRJbidcbiAgICAgIH0sXG4gICAgICBoaWRlOiB7XG4gICAgICAgIGZ4OiAndHJhbnNpdGlvbi5zbGlkZUxlZnRPdXQnXG4gICAgICB9XG4gICAgfSxcbiAgICBmbGlwTGVmdDoge1xuICAgICAgc2hvdzoge1xuICAgICAgICBmeDogJ3RyYW5zaXRpb24udHVyblBhZ2VJbidcbiAgICAgIH0sXG4gICAgICBoaWRlOiB7XG4gICAgICAgIGZ4OiAndHJhbnNpdGlvbi50dXJuUGFnZU91dCdcbiAgICAgIH1cbiAgICB9LFxuICAgIHNsaWRlTGVmdDoge1xuICAgICAgc2hvdzoge1xuICAgICAgICBmeDogJ3RyYW5zaXRpb24uc2xpZGVSaWdodEluJ1xuICAgICAgfSxcbiAgICAgIGhpZGU6IHtcbiAgICAgICAgZng6ICd0cmFuc2l0aW9uLnNsaWRlTGVmdE91dCdcbiAgICAgIH1cbiAgICB9LFxuICAgIHNsaWRlUmlnaHQ6IHtcbiAgICAgIHNob3c6IHtcbiAgICAgICAgZng6ICd0cmFuc2l0aW9uLnNsaWRlTGVmdEluJ1xuICAgICAgfSxcbiAgICAgIGhpZGU6IHtcbiAgICAgICAgZng6ICd0cmFuc2l0aW9uLnNsaWRlUmlnaHRPdXQnXG4gICAgICB9XG4gICAgfSxcbiAgICBzbGlkZURvd246IHtcbiAgICAgIHNob3c6IHtcbiAgICAgICAgZng6ICd0cmFuc2l0aW9uLnNsaWRlRG93bkluJ1xuICAgICAgfSxcbiAgICAgIGhpZGU6IHtcbiAgICAgICAgZng6ICd0cmFuc2l0aW9uLnNsaWRlRG93bk91dCdcbiAgICAgIH1cbiAgICB9LFxuICAgIHNsaWRlVXA6IHtcbiAgICAgIHNob3c6IHtcbiAgICAgICAgZng6ICd0cmFuc2l0aW9uLnNsaWRlVXBJbidcbiAgICAgIH0sXG4gICAgICBoaWRlOiB7XG4gICAgICAgIGZ4OiAndHJhbnNpdGlvbi5zbGlkZVVwT3V0J1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBjbGlja3ZlbnR1cmUgb2JqZWN0XG4gIHZhciBDbGlja3ZlbnR1cmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuXG4gICAgdGhpcy5lbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMuZG9BbGlnbiA9ICF0aGlzLm9wdGlvbnMucHJldmVudEZpcnN0QWxpZ25tZW50O1xuXG4gICAgLy8gc2V0IHVwIGFsbCBub2RlIGxpbmtzXG4gICAgdmFyIGNsaWNrdmVudHVyZSA9IHRoaXM7XG4gICAgdGhpcy5lbGVtZW50LmZpbmQoJy5jbGlja3ZlbnR1cmUtbm9kZS1saW5rLWJ1dHRvbicpLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAkKGVsKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyICRkYXRhQ29udGFpbmVyID0gJCh0aGlzKS5jbG9zZXN0KCcuY2xpY2t2ZW50dXJlLW5vZGUtbGluaycpO1xuICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9ICRkYXRhQ29udGFpbmVyLmRhdGEoJ3RhcmdldE5vZGUnKTtcbiAgICAgICAgdmFyIHRyYW5zaXRpb25OYW1lID0gJGRhdGFDb250YWluZXIuZGF0YSgndHJhbnNpdGlvbicpO1xuICAgICAgICBhbmFseXRpY3NNYW5hZ2VyLnRyYWNrUGFnZVZpZXcoZmFsc2UsIHRyYW5zaXRpb25OYW1lKTtcbiAgICAgICAgY2xpY2t2ZW50dXJlLmdvdG9Ob2RlSWQodGFyZ2V0Tm9kZSwgdHJhbnNpdGlvbk5hbWUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyByZXN0YXJ0IGJ1dHRvblxuICAgIHRoaXMuZWxlbWVudC5maW5kKCcuY2xpY2t2ZW50dXJlLW5vZGUtZmluaXNoLWxpbmtzLXJlc3RhcnQnKS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjbGlja3ZlbnR1cmUuZ290b1N0YXJ0Tm9kZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gc2hvdyBzdGFydCBlbGVtZW50XG4gICAgdmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcbiAgICBpZiAoaGFzaCAmJiB0aGlzLm9wdGlvbnMuaGFzaFN0YXRlKSB7XG4gICAgICB0aGlzLmdvdG9IYXNoKGhhc2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdvdG9TdGFydE5vZGUoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEFsaWduIHRvcCBvZiBjbGlja3ZlbnR1cmUgdG8gc29tZSBvZmZzZXQuIEZpcnN0IGNhbGwgdG8gdGhpcyBmdW5jdGlvbiBpc1xuICAgKiAgc2tpcHBlZCBpZiBwcmV2ZW50Rmlyc3RBbGlnbm1lbnQgb3B0aW9uIGlzIHNldCB0byB0cnVlLlxuICAgKi9cbiAgQ2xpY2t2ZW50dXJlLnByb3RvdHlwZS5hbGlnbldpdGhUb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gYWxpZ24gb25seSBpZiBwcmV2ZW50Rmlyc3RBbGlnbm1lbnQgaXMgZmFsc2UsIG9yIGF0IGxlYXN0IG9uZSBjYWxsIHRvIHRoaXNcbiAgICAvLyAgZnVuY3Rpb24gaGFzIG9jY3VycmVkXG4gICAgaWYgKHRoaXMuZG9BbGlnbikge1xuICAgICAgLy8gc2Nyb2xsIHRoZSB3aW5kb3cgdG8gZ2l2ZW4gb2Zmc2V0XG4gICAgICB0aGlzLmVsZW1lbnQudmVsb2NpdHkoJ3Njcm9sbCcsIHtcbiAgICAgICAgZHVyYXRpb246IHRoaXMub3B0aW9ucy5hbGlnbm1lbnREdXJhdGlvbixcbiAgICAgICAgb2Zmc2V0OiB0aGlzLm9wdGlvbnMuYWxpZ25tZW50T2Zmc2V0XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gYXQgbGVhc3Qgb25lIGNhbGwgaGFzIGJlZW4gbWFkZSwgYWxsb3cgYWxsIG90aGVyIGZ1dHVyZSBjYWxsc1xuICAgIHRoaXMuZG9BbGlnbiA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNlbmQgVUkgdG8gbm9kZSBpZCB3aXRoIHRoZSBnaXZlbiBub2RlIHRyYW5zaXRpb24gcHJvdmlkZWQgYnkgZ2l2ZW4gaGFzaC5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRoZSB1cmwgXCJ3d3cuY2xpY2tob2xlLmNvbS9jbGlja3ZlbnR1cmUvbXktZmlyc3QtY3YtMTIzIzUsc2xpZGVSaWdodFwiXG4gICAqICBoYXMgdGhlIGhhc2ggXCIjNSxzbGlkZVJpZ2h0XCIsIHdoaWNoIHdpbGwgdGVsbCB0aGlzIGZ1bmN0aW9uIHRvIGdvIHRvIG5vZGVcbiAgICogIG51bWJlciA1LCB3aXRoIGEgXCJzbGlkZVJpZ2h0XCIgdHJhbnNpdGlvbi4gTm90ZSwgbm9kZSBuYW1lIGNhbiBiZSB1c2VkIGluXG4gICAqICBwbGFjZSBvZiBub2RlIGlkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGFzaCAtIGhhc2ggc3RyaW5nIHByb3ZpZGVkIGluIHVybC5cbiAgICovXG4gIENsaWNrdmVudHVyZS5wcm90b3R5cGUuZ290b0hhc2ggPSBmdW5jdGlvbiAoaGFzaCkge1xuICAgIC8vIHJlbW92ZSB0aGUgcG91bmQgc2lnblxuICAgIHZhciBjbGVhbkhhc2ggPSBoYXNoLnN1YnN0cigxLCBoYXNoLmxlbmd0aCAtIDEpO1xuICAgIC8vIHNwbGl0IG9uIGNvbW1hIHRvIGdldCB0aGUgbm9kZSBpZCBhbmQgdHJhbnNpdGlvbiB0eXBlXG4gICAgdmFyIHBhcnRzID0gY2xlYW5IYXNoLnNwbGl0KCcsJyk7XG4gICAgLy8gZXh0cmFjdCBub2RlIGlkXG4gICAgdmFyIGlkID0gcGFydHNbMF07XG4gICAgaWYgKGlkKSB7XG4gICAgICAvLyBleHRyYWN0IHRyYW5zaXRpb25cbiAgICAgIHZhciB0cmFuc2l0aW9uID0gcGFydHNbMV07XG4gICAgICAvLyBjaGVjayB3aGljaCB0cmFuc2l0aW9uIGZ1bmN0aW9uIHNob3VsZCBiZSB1c2VkXG4gICAgICBpZiAoaXNOYU4oaWQpKSB7XG4gICAgICAgIHRoaXMuZ290b05vZGVOYW1lZChpZCwgdHJhbnNpdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdvdG9Ob2RlKGlkLCB0cmFuc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEdvIHRvIGEgcmFuZG9tIHN0YXJ0IG5vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmFuc2l0aW9uTmFtZSAtIHRyYW5zaXRpb24gdG8gdXNlIHdoZW4gZ29pbmcgdG8gc3RhcnQgbm9kZS5cbiAgICovXG4gIENsaWNrdmVudHVyZS5wcm90b3R5cGUuZ290b1N0YXJ0Tm9kZSA9IGZ1bmN0aW9uICh0cmFuc2l0aW9uTmFtZSkge1xuICAgIC8vIGZpbmQgYWxsIHN0YXJ0IG5vZGVzIGFuZCBjaG9vc2UgYSByYW5kb20gb25lIHRvIGdvIHRvXG4gICAgdmFyIHN0YXJ0Tm9kZXMgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmNsaWNrdmVudHVyZS1ub2RlLXN0YXJ0Jyk7XG4gICAgdmFyIG5vZGUgPSBzdGFydE5vZGVzW01hdGguZmxvb3Ioc3RhcnROb2Rlcy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKV07XG5cbiAgICBpZiAobm9kZSkge1xuICAgICAgLy8gaGF2ZSBhdCBsZWFzdCBvbmUgbm9kZSwgZ28gdG8gaXRcbiAgICAgIHZhciBub2RlSWQgPSAkKG5vZGUpLmRhdGEoJ25vZGVJZCcpO1xuICAgICAgaWYgKG5vZGVJZCkge1xuICAgICAgICB0aGlzLmdvdG9Ob2RlSWQobm9kZUlkLCB0cmFuc2l0aW9uTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBHbyB0byBhIG5vZGUgYnkgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIG5vZGUgdG8gZ28gdG8uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmFuc2l0aW9uTmFtZSAtIG5hbWUgb2YgdHJhbnNpdGlvbiB0byB1c2Ugd2hlbiBnb2luZyB0byBub2RlLlxuICAgKi9cbiAgQ2xpY2t2ZW50dXJlLnByb3RvdHlwZS5nb3RvTm9kZU5hbWVkID0gZnVuY3Rpb24gKG5hbWUsIHRyYW5zaXRpb25OYW1lKSB7XG4gICAgLy8gZmluZCBub2RlIHdpdGggZ2l2ZW4gbmFtZVxuICAgIHZhciBub2RlID0gdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLW5vZGUtbmFtZT1cIicgKyBuYW1lICsgJ1wiXScpO1xuXG4gICAgaWYgKG5vZGUubGVuZ3RoKSB7XG4gICAgICAvLyBmb3VuZCBhIG5vZGUgYnkgbmFtZSwgZ28gdG8gaXRcbiAgICAgIHZhciBub2RlSWQgPSBub2RlLmRhdGEoJ25vZGVJZCcpO1xuICAgICAgaWYgKG5vZGVJZCkge1xuICAgICAgICB0aGlzLmdvdG9Ob2RlSWQobm9kZUlkLCB0cmFuc2l0aW9uTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBHbyB0byBhIG5vZGUgYnkgaWQsIHNldHRpbmcgdGhlIHVybCBoYXNoIHRvICM8bm9kZUlkPiw8dHJhbnNpdGlvbk5hbWU+LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbm9kZUlkIC0gaWQgb2Ygbm9kZSB0byBnbyB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRyYW5zaXRpb25OYW1lIC0gbmFtZSBvZiB0cmFuc2l0aW9uIHRvIHVzZSB3aGVuIGdvaW5nIHRvIG5vZGUuXG4gICAqL1xuICBDbGlja3ZlbnR1cmUucHJvdG90eXBlLmdvdG9Ob2RlSWQgPSBmdW5jdGlvbiAobm9kZUlkLCB0cmFuc2l0aW9uTmFtZSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuaGFzaFN0YXRlKSB7XG4gICAgICAvLyB1c2luZyBoYXNoIHN0YXRlLCBzZXQgaGFzaCBpbiB1cmxcbiAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhhc2ggPSBbbm9kZUlkLCB0cmFuc2l0aW9uTmFtZV0uam9pbignLCcpO1xuICAgIH1cblxuICAgIHRoaXMuZ290b05vZGUobm9kZUlkLCB0cmFuc2l0aW9uTmFtZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVzZSB0cmFuc2l0aW9uIHRvIHNob3cgYSBub2RlIGdpdmVuIGJ5IGlkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbm9kZUlkIC0gaWQgb2Ygbm9kZSB0byBzaG93LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJhbnNpdGlvbiAtIHRyYW5zaXRpb24gdG8gdXNlIGZvciBzaG93aW5nIG5vZGUuXG4gICAqL1xuICAgQ2xpY2t2ZW50dXJlLnByb3RvdHlwZS5zaG93TmV3Tm9kZSA9IGZ1bmN0aW9uIChub2RlSWQsIHRyYW5zaXRpb24pIHtcbiAgICAgLy8gbm9kZSB0byBkaXNwbGF5XG4gICAgdmFyIG5ld05vZGUgPSB0aGlzLmVsZW1lbnQuZmluZCgnI2NsaWNrdmVudHVyZS1ub2RlLScgKyBub2RlSWQpO1xuXG4gICAgLy8gc3RhcnQgdHJhbnNpdGlvblxuICAgIG5ld05vZGUudmVsb2NpdHkodHJhbnNpdGlvbi5zaG93LmZ4LCB7XG4gICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgY29tcGxldGU6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIG1ha2Ugbm9kZSBhY3RpdmVcbiAgICAgICAgbmV3Tm9kZS5hZGRDbGFzcygnY2xpY2t2ZW50dXJlLW5vZGUtYWN0aXZlJyk7XG5cbiAgICAgICAgLy8gdHJhbnNpdGlvbiBub2RlIGluXG4gICAgICAgIG5ld05vZGUuZmluZCgnLmNsaWNrdmVudHVyZS1ub2RlLWxpbmsnKS52ZWxvY2l0eSgndHJhbnNpdGlvbi5zbGlkZURvd25JbicsIHtcbiAgICAgICAgICBkdXJhdGlvbjogMzAwLFxuICAgICAgICAgIHN0YWdnZXI6IDEwMFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBwcmVwIG5vZGVcbiAgICAgICAgcGljdHVyZWZpbGwobmV3Tm9kZSk7XG5cbiAgICAgICAgLy8gdHJpZ2dlciBwYWdlIGNoYW5nZSBjb21wbGV0ZSBldmVudFxuICAgICAgICB0aGlzLmVsZW1lbnQudHJpZ2dlcignY2xpY2t2ZW50dXJlLXBhZ2UtY2hhbmdlLWNvbXBsZXRlJywgW3RoaXNdKTtcbiAgICAgIH0pLmJpbmQodGhpcylcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogR28gdG8gYSBnaXZlbiBub2RlIGJ5IGlkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbm9kZUlkIC0gaWQgb2Ygbm9kZSB0byBnbyB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRyYW5zaXRpb25OYW1lIC0gbmFtZSBvZiB0cmFuc2l0aW9uIHRvIHVzZSB3aGVuIGdvaW5nIHRvIG5vZGUuXG4gICAqL1xuICBDbGlja3ZlbnR1cmUucHJvdG90eXBlLmdvdG9Ob2RlID0gZnVuY3Rpb24gKG5vZGVJZCwgdHJhbnNpdGlvbk5hbWUpIHtcblxuICAgIC8vIGZpbmQgYWN0aXZlIG5vZGUsIGFuZCB0cmFuc2l0aW9uIHRvIHVzZVxuICAgIHZhciBhY3RpdmVOb2RlID0gdGhpcy5lbGVtZW50LmZpbmQoJy5jbGlja3ZlbnR1cmUtbm9kZS1hY3RpdmUnKTtcbiAgICB2YXIgdHJhbnNpdGlvbiA9IE5PREVfVFJBTlNJVElPTlNbdHJhbnNpdGlvbk5hbWUgfHwgJ2RlZmF1bHQnXTtcblxuICAgIC8vIGFsaWduIHdpdGggdG9wIG9mIG5vZGVcbiAgICB0aGlzLmFsaWduV2l0aFRvcCgpO1xuXG4gICAgLy8gdHJpZ2dlciBwYWdlIGNoYW5nZSBldmVudFxuICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCdjbGlja3ZlbnR1cmUtcGFnZS1jaGFuZ2Utc3RhcnQnLCBbdGhpc10pO1xuXG4gICAgLy8gaGlkZSBleGlzdGluZyBwYWdlIGlmIHRoZXJlIGlzIG9uZVxuICAgIGlmIChhY3RpdmVOb2RlLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIHN0YXJ0IHRyYW5zaXRpb25cbiAgICAgIGFjdGl2ZU5vZGUudmVsb2NpdHkodHJhbnNpdGlvbi5oaWRlLmZ4LCB7XG4gICAgICAgIGR1cmF0aW9uOiAyMDAsXG4gICAgICAgIGNvbXBsZXRlOiAoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgLy8gaGlkZSBleGlzdGluZyBub2RlXG4gICAgICAgICAgYWN0aXZlTm9kZS5yZW1vdmVDbGFzcygnY2xpY2t2ZW50dXJlLW5vZGUtYWN0aXZlJyk7XG5cbiAgICAgICAgICAvLyB0cmFuc2l0aW9uIGludG8gbmV3IG5vZGVcbiAgICAgICAgICB0aGlzLnNob3dOZXdOb2RlKG5vZGVJZCwgdHJhbnNpdGlvbik7XG5cbiAgICAgICAgfSkuYmluZCh0aGlzKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd05ld05vZGUobm9kZUlkLCB0cmFuc2l0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gc2V0IGNsaWNrdmVudHVyZSBvYmplY3Qgb24gd2luZG93XG4gIGdsb2JhbC5DbGlja3ZlbnR1cmUgPSBDbGlja3ZlbnR1cmU7XG5cbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsIi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbnMgZm9yIGFkIGxvYWRpbmcgYmVjYXVzZSB3ZSB3YW50IHRvIGxvYWQgdGhlIGFkcyBtb2R1bGUgQVNBUCxcbiAqICBiZWZvcmUgYW55IG90aGVyIEpTIGxpYnMgdGhhdCBtaWdodCBwcm92aWRlIHRoZXNlIGZ1bmN0aW9ucy5cbiAqL1xudmFyIFV0aWxzID0ge1xuXG4gIC8qKlxuICAgKiBFeHRlbmQgZ2l2ZW4gb2JqZWN0IGJ5IGdpdmVuIG5vbi1wYXJhbWV0ZXJpemVkIGFyZ3VtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IG91dCAtIG9iamVjdCB0byBleHRlbmQuXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IGV4dGVuZGVkIG9iamVjdC5cbiAgICovXG4gIGV4dGVuZDogZnVuY3Rpb24gKG91dCkge1xuICAgIG91dCA9IG91dCB8fCB7fTtcblxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50c1tpXSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBhcmd1bWVudHNbaV0pIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50c1tpXS5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICAgIG91dFtrZXldID0gYXJndW1lbnRzW2ldW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfSxcblxuICAvKipcbiAgICogVGVzdCBpZiBnaXZlbiBlbGVtZW50IGhhcyBhIGdpdmVuIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsIC0gZWxlbWVudCB0byB0ZXN0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIC0gY2xhc3MgbmFtZSB0byB0ZXN0IGZvci5cbiAgICogQHJldHVybnMgdHJ1ZSBpZiBlbGVtZW50IGhhcyBnaXZlbiBjbGFzcywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaGFzQ2xhc3M6IGZ1bmN0aW9uIChlbCwgY2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIGVsLmNsYXNzTmFtZSAmJiAhIWVsLmNsYXNzTmFtZS5tYXRjaCgnKF58XFxcXHMpJyArIGNsYXNzTmFtZSArICcoJHxcXFxccyknKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIGEgZ2l2ZW4gY2xhc3MgZnJvbSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsIC0gZWxlbWVudCB0byByZW1vdmUgY2xhc3MgZnJvbS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSAtIGNsYXNzIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoZWwsIGNsYXNzTmFtZSkge1xuICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxzKScgKyBjbGFzc05hbWUgKyAnKCR8XFxcXHMpJywgJ2cnKSwgJyAnKTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIGEgZ2l2ZW4gY2xhc3MgdG8gZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbCAtIGVsZW1lbnQgdG8gYWRkIGNsYXNzIHRvLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIC0gY2xhc3MgbmFtZSB0byBhZGQuXG4gICAqL1xuICBhZGRDbGFzczogZnVuY3Rpb24gKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoIVV0aWxzLmhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSB7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVdGlscztcbiIsInZhciBfQW5hbHl0aWNzSW5nZXN0RXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICB0aGlzLm5hbWUgPSAnQW5hbHl0aWNzSW5nZXN0RXJyb3InO1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8ICcnO1xuXG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcih0aGlzLm1lc3NhZ2UpO1xuICBlcnJvci5uYW1lID0gdGhpcy5uYW1lO1xuICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2s7XG59O1xuX0FuYWx5dGljc0luZ2VzdEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblxudmFyIEFuYWx5dGljc0luZ2VzdCA9IHtcbiAgLyoqXG4gICAqIFNlbmRzIHRoZSBwYWdlIGluZm9ybWF0aW9uIHRvIHRoZSBpbmdlc3Rpb24gZW5kcG9pbnRcbiAgICovXG4gIHNlbmRFdmVudDogZnVuY3Rpb24gKGVuZHBvaW50KSB7XG5cbiAgICBpZiAodHlwZW9mKGVuZHBvaW50KSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBfQW5hbHl0aWNzSW5nZXN0RXJyb3IoJ0luZ2VzdCBlbmRwb2ludCBtdXN0IGJlIHNldCEnKTtcbiAgICB9XG5cbiAgICB2YXIgY2FjaGVCdXN0ZXIgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgdmFyIHVybCA9XG4gICAgICBlbmRwb2ludCArXG4gICAgICAnPycgKyBjYWNoZUJ1c3RlciArXG4gICAgICAnJmhvc3RuYW1lPScgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgK1xuICAgICAgJyZwYXRobmFtZT0nICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICtcbiAgICAgICcmc2VhcmNoPScgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWcuc3JjID0gdXJsO1xuICAgIH0pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFuYWx5dGljc0luZ2VzdDtcbiIsInZhciBJbmdlc3QgPSByZXF1aXJlKCcuL2FuYWx5dGljcy1pbmdlc3QvYW5hbHl0aWNzLWluZ2VzdCcpO1xuXG52YXIgX0FuYWx5dGljc01hbmFnZXJFcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gIHRoaXMubmFtZSA9ICdBbmFseXRpY3NNYW5hZ2VyRXJyb3InO1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8ICcnO1xuXG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcih0aGlzLm1lc3NhZ2UpO1xuICBlcnJvci5uYW1lID0gdGhpcy5uYW1lO1xuICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2s7XG59O1xuX0FuYWx5dGljc01hbmFnZXJFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbnZhciBBbmFseXRpY3NNYW5hZ2VyID0ge1xuXG4gIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHtcbiAgICAgIHNpdGU6ICcnLFxuICAgICAgaW5nZXN0VXJsOiAnJyxcbiAgICAgIHNlYXJjaFF1ZXJ5UGFyYW06ICdxJyxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmICghdGhpcy5fc2V0dGluZ3Muc2l0ZSkge1xuICAgICAgdGhyb3cgbmV3IF9BbmFseXRpY3NNYW5hZ2VyRXJyb3IoJ1NpdGUgbmFtZSBtdXN0IGJlIHNwZWNpZmllZCEnKTtcbiAgICB9XG5cbiAgICB0aGlzLnRyYWNrZWRQYXRocyA9IFtdO1xuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKTtcbiAgICBib2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy50cmFja0NsaWNrKTtcbiAgfSxcblxuICBnZXRXaW5kb3dMb2NhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb247XG4gIH0sXG5cbiAgdHJhY2tDbGljazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgdHJhY2tlZEVsZW1lbnQgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnW2RhdGEtdHJhY2stY2F0ZWdvcnldJyk7XG4gICAgdmFyIGNhdGVnb3J5ID0gdHJhY2tlZEVsZW1lbnQuZGF0YSgndHJhY2stY2F0ZWdvcnknKTtcblxuICAgIGlmICghY2F0ZWdvcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKEFuYWx5dGljc01hbmFnZXIuZGVidWdNb2RlKCkpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICAgIHZhciB0cmFja2VkRXZlbnQgPSBBbmFseXRpY3NNYW5hZ2VyLnRyYWNrZWRFdmVudCgkKGV2ZW50LnRhcmdldCkpO1xuICAgICAgQW5hbHl0aWNzTWFuYWdlci5zZW5kRXZlbnQodHJhY2tlZEV2ZW50KTtcbiAgICB9XG4gIH0sXG5cbiAgZGVidWdNb2RlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gd2luZG93LmFuYWx5dGljc1Rlc3QgfHwgZmFsc2U7XG4gIH0sXG5cbiAgZGF0YUF0dHJpYnV0ZTogZnVuY3Rpb24oZWxlbWVudCwgZGF0YUF0dHJLZXkpIHtcbiAgICByZXR1cm4gZWxlbWVudC5kYXRhKGRhdGFBdHRyS2V5KSB8fCBlbGVtZW50LmNsb3Nlc3QoJ1tkYXRhLScgKyBkYXRhQXR0cktleSArICddJykuZGF0YShkYXRhQXR0cktleSk7XG4gIH0sXG5cbiAgdHJhY2tlZEV2ZW50OiBmdW5jdGlvbih0cmFja2VkRWxlbWVudCkge1xuICAgIHJldHVybiB7XG4gICAgICBldmVudENhdGVnb3J5OiBBbmFseXRpY3NNYW5hZ2VyLmRhdGFBdHRyaWJ1dGUodHJhY2tlZEVsZW1lbnQsICd0cmFjay1jYXRlZ29yeScpLFxuICAgICAgZXZlbnRBY3Rpb246IEFuYWx5dGljc01hbmFnZXIuZGF0YUF0dHJpYnV0ZSh0cmFja2VkRWxlbWVudCwgJ3RyYWNrLWFjdGlvbicpLFxuICAgICAgZXZlbnRMYWJlbDogQW5hbHl0aWNzTWFuYWdlci5kYXRhQXR0cmlidXRlKHRyYWNrZWRFbGVtZW50LCAndHJhY2stbGFiZWwnKVxuICAgIH07XG4gIH0sXG5cbiAgY29tc2NvcmVCZWFjb246IGZ1bmN0aW9uKCkge1xuICAgIGlmICh3aW5kb3cuQ09NU0NPUkUpIHtcbiAgICAgIENPTVNDT1JFLmJlYWNvbih7IGMxOiAyLCBjMjogNjAzNjMyOCwgYzM6IFwiXCIsIGM0OiBcIlwiLCBjNTogXCJcIiwgYzY6IFwiXCIsIGMxNTogXCJcIiB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdDT01TQ09SRSBub3QgYXZhaWxhYmxlJyk7XG4gICAgfVxuICB9LFxuXG4gIHNlbmRDb21zY29yZVBpeGVsOiBmdW5jdGlvbihmcmVzaFBhZ2UsIHRpdGxlKSB7XG4gICAgaWYoZnJlc2hQYWdlKSB7XG4gICAgICB0aGlzLmNvbXNjb3JlQmVhY29uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQuZ2V0KFwiL3QvcGFnZXZpZXdfY2FuZGlkYXRlLnhtbD90aXRsZT1cIiArIGVuY29kZVVSSUNvbXBvbmVudCggdGl0bGUgKSArIFwiJnJhbmQ9XCIgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMCkpO1xuICAgICAgdGhpcy5jb21zY29yZUJlYWNvbigpO1xuICAgIH1cbiAgfSxcblxuICBzZW5kUXVhbnRjYXN0UGl4ZWw6IGZ1bmN0aW9uKGZyZXNoUGFnZSkge1xuICAgIGlmICghZnJlc2hQYWdlKSB7XG4gICAgICBpZiAod2luZG93Ll9xZXZlbnRzKSB7XG4gICAgICAgIF9xZXZlbnRzLnB1c2goeyBxYWNjdDpcInAtMzlGWWFBR09ZbGlfLVwiLCAnZXZlbnQnOiBcInJlZnJlc2hcIiB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignX3FldmVudHMgbm90IGF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBzZW5kQ2hhcnRiZWF0RXZlbnQ6IGZ1bmN0aW9uKHRpdGxlKSB7XG4gICAgdmFyIHBhdGggPSB0aGlzLmdldFdpbmRvd0xvY2F0aW9uKCkucGF0aG5hbWU7XG4gICAgaWYgKHdpbmRvdy5wU1VQRVJGTFkpIHtcbiAgICAgIHdpbmRvdy5wU1VQRVJGTFkudmlydHVhbFBhZ2UocGF0aCwgdGl0bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ3BTVVBFUkZMWSBub3QgYXZhaWxhYmxlJyk7XG4gICAgfVxuICB9LFxuXG4gIGdldFBhcmFtZXRlckJ5TmFtZTogZnVuY3Rpb24obmFtZSkge1xuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtdLywgXCJcXFxcW1wiKS5yZXBsYWNlKC9bXFxdXS8sIFwiXFxcXF1cIik7XG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIltcXFxcPyZdXCIgKyBuYW1lICsgXCI9KFteJiNdKilcIiksXG4gICAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHRoaXMuZ2V0V2luZG93TG9jYXRpb24oKS5zZWFyY2gpO1xuICAgIHJldHVybiByZXN1bHRzID09PSBudWxsID8gXCJcIiA6IGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xuICB9LFxuXG4gIGdldE5vZGVIYXNoOiBmdW5jdGlvbihoYXNoKSB7XG4gICAgaWYgKGhhc2gpIHtcbiAgICAgIHZhciByZSA9IFJlZ0V4cCgnI1xcW0EtWmEtejAtOS1dKycpO1xuICAgICAgdmFyIHJlc3VsdHMgPSBoYXNoLm1hdGNoKHJlKTtcbiAgICAgIGlmIChyZXN1bHRzICYmIGhhc2guc2VhcmNoKHJlKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0c1swXTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcGF0aEluZm86IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF0aEluZm87XG4gICAgdmFyIHdpbmRvd0xvY2F0aW9uID0gdGhpcy5nZXRXaW5kb3dMb2NhdGlvbigpO1xuICAgIHZhciBwYXRoID0gd2luZG93TG9jYXRpb24ucGF0aG5hbWU7XG4gICAgdmFyIGhhc2ggPSB0aGlzLmdldE5vZGVIYXNoKHdpbmRvd0xvY2F0aW9uLmhhc2gpO1xuICAgIGlmIChoYXNoKSB7XG4gICAgICBwYXRoICs9IGhhc2g7XG4gICAgfVxuICAgIHZhciBzZWFyY2hRdWVyeSA9IHRoaXMuZ2V0UGFyYW1ldGVyQnlOYW1lKHRoaXMuX3NldHRpbmdzLnNlYXJjaFF1ZXJ5UGFyYW0pO1xuICAgIGlmIChzZWFyY2hRdWVyeS5sZW5ndGgpIHtcbiAgICAgIHBhdGhJbmZvID0gcGF0aCArICc/JyArIHRoaXMuX3NldHRpbmdzLnNlYXJjaFF1ZXJ5UGFyYW0gKyAnPScgKyBzZWFyY2hRdWVyeTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0aEluZm8gPSBwYXRoO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aEluZm87XG4gIH0sXG5cbiAgdHJhY2tQYWdlVmlldzogZnVuY3Rpb24oZnJlc2hQYWdlLCBvcHRpb25hbFRpdGxlKSB7XG4gICAgdmFyIHBhdGggPSB0aGlzLnBhdGhJbmZvKCk7XG4gICAgaWYgKHRoaXMudHJhY2tlZFBhdGhzLmluZGV4T2YocGF0aCkgPCAwKSB7XG4gICAgICBnYSgnc2VuZCcsICdwYWdldmlldycsIHBhdGgpO1xuICAgICAgZ2EoJ2FkVHJhY2tlci5zZW5kJywgJ3BhZ2V2aWV3JywgdGhpcy5fc2V0dGluZ3Muc2l0ZSArIHBhdGgpO1xuXG4gICAgICB0aGlzLnNlbmRRdWFudGNhc3RQaXhlbChmcmVzaFBhZ2UpO1xuICAgICAgdGhpcy5zZW5kQ29tc2NvcmVQaXhlbChmcmVzaFBhZ2UsIG9wdGlvbmFsVGl0bGUpO1xuXG4gICAgICBJbmdlc3Quc2VuZEV2ZW50KHRoaXMuX3NldHRpbmdzLmluZ2VzdFVybCk7XG5cbiAgICAgIGlmICghZnJlc2hQYWdlKSB7XG4gICAgICAgIHRoaXMuc2VuZENoYXJ0YmVhdEV2ZW50KG9wdGlvbmFsVGl0bGUpO1xuICAgICAgfVxuICAgICAgdGhpcy50cmFja2VkUGF0aHMucHVzaChwYXRoKTtcbiAgICB9XG4gIH0sXG5cbiAgc2VuZEV2ZW50OiBmdW5jdGlvbih0cmFja2VkRXZlbnQpIHtcbiAgICBpZiAoKHR5cGVvZih0cmFja2VkRXZlbnQuZXZlbnRDYXRlZ29yeSkgPT09ICd1bmRlZmluZWQnKSB8fFxuICAgICAgKHR5cGVvZih0cmFja2VkRXZlbnQuZXZlbnRBY3Rpb24pID09PSAndW5kZWZpbmVkJykgfHxcbiAgICAgICh0eXBlb2YodHJhY2tlZEV2ZW50LmV2ZW50TGFiZWwpID09PSAndW5kZWZpbmVkJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoQW5hbHl0aWNzTWFuYWdlci5kZWJ1Z01vZGUoKSkge1xuICAgICAgY29uc29sZS5sb2codHJhY2tlZEV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2EoJ3NlbmQnLCAnZXZlbnQnLCB0cmFja2VkRXZlbnQpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBbmFseXRpY3NNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi8uLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2J1bGJzLXB1YmxpYy1hZHMtbWFuYWdlci9zcmMvdXRpbHMnKTtcblxudmFyIEFkVW5pdHMgPSB7XG5cbiAgc2V0dGluZ3M6IHtcbiAgICBkZnBTaXRlOiAnY2xpY2tob2xlJyxcbiAgICBmaWx0ZXJTbG90c0J5Vmlld3BvcnQ6IDQwMFxuICB9LFxuXG4gIG1ha2VBZENsb3NlYWJsZTogZnVuY3Rpb24oYWRFbGVtZW50KSB7XG4gICAgdmFyIGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdXRpbHMuYWRkQ2xhc3MoY2xvc2VCdXR0b24sICdjbG9zZS1idG4nKTtcbiAgICB1dGlscy5hZGRDbGFzcyhhZEVsZW1lbnQucGFyZW50RWxlbWVudCwgJ3Bpbm5lZCcpO1xuICAgIGFkRWxlbWVudC5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbik7XG4gICAgcmV0dXJuIGNsb3NlQnV0dG9uO1xuICB9LFxuXG4gIGNsb3NlQWQ6IGZ1bmN0aW9uKGFkRWxlbWVudCkge1xuICAgIGNsaWNraG9sZWFuLnNlbmRFdmVudCh7XG4gICAgICBldmVudENhdGVnb3J5OiAnYWRzJyxcbiAgICAgIGV2ZW50QWN0aW9uOiAnY2xvc2UnLFxuICAgICAgZXZlbnRMYWJlbDogJydcbiAgICB9KTtcbiAgICBhZEVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChhZEVsZW1lbnQpO1xuICB9LFxuXG4gIHByZXBlbmRTaXRlOiBmdW5jdGlvbihiYXNlU2xvdE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5kZnBTaXRlICsgJ18nICsgYmFzZVNsb3ROYW1lO1xuICB9XG59O1xuXG5BZFVuaXRzLnVuaXRzID0ge1xuICAnaGVhZGVyJzoge1xuICAgICdzbG90TmFtZSc6ICdoZWFkZXInLFxuICAgICdzaXplcyc6IFtcbiAgICAgIFtbOTcwLCAwXSwgW1s3MjgsIDkwXSwgWzk3MCwgMjUwXSwgWzk3MCwgOTBdLCBbOTcwLCA0MTVdXV0sXG4gICAgICBbWzcyOCwgMF0sIFs3MjgsIDkwXV0sXG4gICAgICBbWzAsIDBdLCBbMzIwLCA1MF1dXG4gICAgXSxcbiAgICBvblNsb3RSZW5kZXJFbmRlZDogZnVuY3Rpb24oZSwgZWwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChlLnNsb3QuZ2V0TmFtZSgpID09PSAnLzEwMDk5NDgvaGVhZGVyJykge1xuICAgICAgICAgIHV0aWxzLmFkZENsYXNzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGUuc2xvdC5nZXRTbG90RWxlbWVudElkKCkpLCAnYWQtbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHMucmVtb3ZlQ2xhc3MoZWwucGFyZW50RWxlbWVudCwgJ3Bpbm5lZCcpO1xuICAgICAgICBpZiAoKGUuc2l6ZVswXSA9PT0gNzI4KSAmJiAoZS5zaXplWzFdID09PSA5MCkpIHtcbiAgICAgICAgICB2YXIgY2xvc2VfYnV0dG9uID0gQWRVbml0cy5tYWtlQWRDbG9zZWFibGUoZWwpO1xuICAgICAgICAgIGlmKCdvbnRvdWNoZW5kJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNsb3NlX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIEFkVW5pdHMuY2xvc2VBZC5iaW5kKG51bGwsIGVsKSwgZmFsc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbG9zZV9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBBZFVuaXRzLmNsb3NlQWQuYmluZChudWxsLCBlbCksIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHdpdGggaGVhZGVyIHNsb3QnLCBlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAnbW9iaWxlLXByaW1hcnknOiB7XG4gICAgJ3Nsb3ROYW1lJzogJ3NpZGViYXItcHJpbWFyeScsXG4gICAgJ3NpemVzJzogW1xuICAgICAgW1s2MDAsIDBdLCBbXV0sXG4gICAgICBbWzAsIDBdLCBbMzAwLCAyNTBdXSxcbiAgICBdXG4gIH0sXG5cbiAgJ3NpZGViYXItcHJpbWFyeSc6IHtcbiAgICAnc2xvdE5hbWUnOiAnc2lkZWJhci1wcmltYXJ5JyxcbiAgICAnc2l6ZXMnOiBbXG4gICAgICBbWzYwMCwgMF0sIFtbMzAwLCAyNTBdXV0sXG4gICAgICBbWzAsIDBdLCBbXV0sXG4gICAgXVxuICB9LFxuXG4gICdzaWRlYmFyLXNlY29uZGFyeSc6IHtcbiAgICAnc2xvdE5hbWUnOiAnc2lkZWJhci1zZWNvbmRhcnknLFxuICAgICdzaXplcyc6IFtcbiAgICAgIFtbMCwgMF0sIFszMDAsIDI1MF1dLFxuICAgIF1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBZFVuaXRzO1xuIl19
