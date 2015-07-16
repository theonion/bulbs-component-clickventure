(function ($, Clickventure) {

  $(document).ready(function () {
    var clickventure = new Clickventure('#clickventure-container', {
      hashState: true,
      onGotoPage: function (clickventure) {
        fireAnalytics();
      }
    });

    var fireAnalytics = function () {
      if (ga) {
        var url = location.origin + location.pathname + location.search + location.hash;
        ga('send', 'pageview', {
          'location': url
        });
        ga('adTracker.send', 'pageview', {
          'location': url
        });
        if (document.location.protocol != "https:") {
          var img = new Image();
          var trackingPixel = "http://tinytracker.onion.com/track.gif?" + (new Date()).getTime();
          for (var i in window.CV_TINYTRACKER) {
            trackingPixel += ("&event=" + window.CV_TINYTRACKER[i]);
          }
          img.src = trackingPixel;
        }
      }
    };
  });
})(jQuery, Clickventure);
