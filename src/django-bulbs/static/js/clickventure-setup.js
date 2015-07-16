(function ($, Clickventure, ga) {

  $(document).ready(function () {
    var clickventure = new Clickventure('#clickventure-container', {
      hashState: true,
      onGotoPage: function (clickventure) {
        fireAnalytics();
      }
    });

    var fireAnalytics = function () {
      var url = location.origin + location.pathname + location.search + location.hash;
      ga('send', 'pageview', {
        'location': url
      });
      ga('adTracker.send', 'pageview', {
        'location': url
      });
      if (document.location.protocol != "https:") {
        var tinytracker = { % tinytracker %
        };
        var img = new Image();
        var trackingPixel = "http://tinytracker.onion.com/track.gif?" + (new Date).getTime();
        for (var i in tinytracker) {
          trackingPixel += ("&event=" + tinytracker[i]);
        }
        img.src = trackingPixel;
      }
    }
  });
})(jquery, Clickventure, ga);
