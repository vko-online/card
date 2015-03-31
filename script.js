angular.module('card', [])
  .factory('cardConnector', function() {
    return {
      resized: false,
      resizePayload: undefined,
      titlePayload: undefined,
      contentPayload: undefined,
      contentPayloadBack: undefined
    }
  })
  .directive('card', function() {
    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'card.html'
    }
  })
  .directive('cardTitle', function(cardConnector) {
    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'card-title.html',
      link: function(scope, elem) {
        function titlePayload() {
          TweenMax.to(elem, .8, {
            background: 'rgba(0,0,0,.4)',
            ease: Strong.Linear
          });
        }
        cardConnector.titlePayload = titlePayload;
        elem.on('click', function() {
          if (cardConnector.resized && cardConnector.resizePayload) {
            cardConnector.resizePayload();
            cardConnector.resized = false;
            TweenMax.to(elem, .8, {
              background: 'none',
              ease: Strong.easeOut
            });
          }
          if(cardConnector.contentPayloadBack){
            cardConnector.contentPayloadBack();
          }
        });
      }
    }
  })
  .directive('cardContent', function(cardConnector) {
    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'card-content.html',
      link: function(scope, elem) {
        function contentPayload() {
          TweenMax.set(elem, {
            overflow: 'auto'
          });
        }
        function contentPayloadBack() {
          TweenMax.set(elem, {
            overflow: 'hidden'
          });
        }
        cardConnector.contentPayload = contentPayload;
        cardConnector.contentPayloadBack = contentPayloadBack;
      }
    }
  })
  .directive('cardImage', function(cardConnector) {
    return {
      restrict: 'A',
      scope: {
        src: '@'
      },
      compile: function(tElem, tAttr) {
        function numToPx(number) {
          return number + 'px';
        }
        var titleHeight = 50;
        var initialHeight = 480;
        var initialTop = 0;
        TweenMax.set(tElem, {
          background: 'url(' + tAttr.src + '), linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.6)) no-repeat',
          'background-size': '100%',
          top: initialTop,
          height: initialHeight
        });
        return function link(scope, elem, attr) {
          function resizePayload() {
            TweenMax.to(elem, .8, {
              top: initialTop,
              ease: Strong.easeOut
            });
            cardConnector.resized = false;
          }
          elem.on('click', function() {
            TweenMax.to(elem, 1, {
              top: titleHeight - initialHeight,
              ease: Strong.easeOut
            });
            cardConnector.resized = true;
            cardConnector.resizePayload = resizePayload;
            if (cardConnector.titlePayload)
              cardConnector.titlePayload();
            if (cardConnector.contentPayload)
              cardConnector.contentPayload();
          });
        }
      }
    }
  })