(function (global, $) {

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


  var NODE_TRANSITIONS = {
    'default': {
      'show': {
        fx: 'transition.slideRightIn'
      },
      'hide': {
        fx: 'transition.slideLeftOut'
      }
    },
    'flipLeft': {
      'show': {
        fx: 'transition.turnPageIn'
      },
      'hide': {
        fx: 'transition.turnPageOut'
      }
    },
    'slideLeft': {
      'show': {
        fx: 'transition.slideRightIn'
      },
      'hide': {
        fx: 'transition.slideLeftOut'
      }
    },
    'slideRight': {
      'show': {
        fx: 'transition.slideLeftIn'
      },
      'hide': {
        fx: 'transition.slideRightOut'
      }
    },
    'slideDown': {
      'show': {
        fx: 'transition.slideDownIn'
      },
      'hide': {
        fx: 'transition.slideDownOut'
      }
    },
    'slideUp': {
      'show': {
        fx: 'transition.slideUpIn'
      },
      'hide': {
        fx: 'transition.slideUpOut'
      }
    }
  };

  // The "controller":

  var Clickventure = function (element, options) {
    this.element = $(element);

    this.options = $.extend({}, defaultOptions, options);

    this.doAlign = !this.options.preventFirstAlignment;

    var clickventure = this;
    $('.clickventure-node-link', this.element).each(function (i, elLink) {
      $(elLink).on('click', function (event) {
        var targetNode = $(elLink).attr('data-target-node');
        var transitionName = $(elLink).data('transition');
        clickventure.gotoNodeId(targetNode, transitionName);
      });
    });
    // a restart button
    $('.clickventure-restart').click(function (event) {
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

  Clickventure.prototype.alignWithTop = function () {
    if (this.doAlign) {
      this.element.velocity('scroll', {
        duration: 300,
        offset: -60
      });
    }
    this.doAlign = true;
  };

  Clickventure.prototype.gotoHash = function (hash) {
    hash = hash.substr(1, hash.length - 1);
    var parts = hash.split(',');
    var id = parts[0];
    if (id) {
      var transition = parts[1];
      // allow for name or id:
      if (isNaN(id)) {
        this.gotoNodeNamed(id, transition);
      } else {
        this.gotoNode(id, transition);
      }
    }
  };

  Clickventure.prototype.gotoStartNode = function (transitionName) {
    var startNodes = $('.clickventure-start');
    var node = startNodes[Math.floor(startNodes.length * Math.random())];
    if (node) {
      var nodeId = $(node).data('node-id');
      if (nodeId) {
        this.gotoNodeId(nodeId, transitionName);
      }
    }
  };

  Clickventure.prototype.gotoNodeNamed = function (name, transitionName) {
    var node = $('[data-node-name="' + name + '"]');
    if (node.length) {
      var nodeId = node.data('node-id');
      if (nodeId) {
        this.gotoNodeId(nodeId, transitionName);
      }
    }
  };

  Clickventure.prototype.gotoNodeId = function (nodeId, transitionName) {
    if (this.options.hashState) {
      document.location.hash = [nodeId, transitionName].join(',');
    }
    this.gotoNode(nodeId, transitionName);
  };

  Clickventure.prototype.gotoNode = function (nodeId, transitionName) {
    var activeNode = $('.clickventure-active', this.element);
    var clickventure = this;
    var transition = NODE_TRANSITIONS[transitionName || 'default'];
    this.alignWithTop();

     var showNewNode = function (transition) {
      var newNode = $('#clickventure-node-' + nodeId, clickventure.element);
      newNode.velocity(transition.show.fx, {
        duration: 200,
        complete: function () {
          newNode.addClass('clickventure-active');
          $('.clickventure-node-link', newNode).velocity('transition.slideDownIn', {
            duration: 300,
            stagger: 100
          });
          picturefill(newNode);

          clickventure.element.trigger('clickventure-page-change-complete', [clickventure]);
        }
      });
    };
    // hide existing page?
    if (activeNode.length > 0) {
      activeNode.velocity(transition.hide.fx, {
        duration: 200,
        complete: function () {
          activeNode.removeClass('clickventure-active');
          $('.clickventure-node-link', activeNode).css('display', 'none');
          // stop video
          $('.video', activeNode).each(function (i, el) {
            if (el.contentWindow) {
              el.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
          });
          showNewNode(transition);

          clickventure.element.trigger('clickventure-page-change', [clickventure]);
        }
      });
    } else {
      showNewNode(transition);
    }
  };

  global.Clickventure = Clickventure;

})(window, jQuery);
