(function (global, $) {

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
