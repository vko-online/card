angular.module('card', ['swipe'])
.factory('cardConnector', function() {
  return {
    resized: false,
    resizePayload: undefined,
    titlePayload: undefined,
    contentPayload: undefined,
    contentPayloadBack: undefined,
    textPayload: undefined,
    textPayloadBack: undefined
  }
})
.directive('card', function() {
  return {
    restrict: 'EA',
    transclude: true,
    templateUrl: 'card.html',
    priority: 100,
    scope:{
      text: '@',
      img: '@'
    }
  }
})
.directive('cardTitle', function(cardConnector) {
  return {
    restrict: 'EA',
    transclude: true,
    templateUrl: 'card-title.html',
    priority: 99,
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
        if(cardConnector.contentPayloadBack)
          cardConnector.contentPayloadBack();
        if(cardConnector.textPayloadBack)
          cardConnector.textPayloadBack();
      });
    }
  }
})
.directive('cardContent', function(cardConnector) {
  return {
    restrict: 'EA',
    transclude: true,
    priority: 98,
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
.directive('cardImageTitle', function(cardConnector){
  return{
    restrict: 'C',
    link: function(scope, elem){
      var fixer = -0.001;
      var pageX, pageY;
      var speedX  = 40;         
      var speedY  = 40;
      if(window.DeviceOrientationEvent){
        angular.element(document).on("deviceorientation", function(event){
          console.log(event);
          pageX =  event.beta - 80; 
          pageY =  event.gamma - 120;       
          TweenLite.to(elem, 0.5, {
            x: (elem[0].offsetLeft + pageX * speedX )*fixer,
            y: (elem[0].offsetTop + pageY * speedY)*fixer
          });
        });
      }
      angular.element(document).on("mousemove", function(event){
        pageX =  event.pageX - 80; 
        pageY =  event.pageY - 120;            
        TweenLite.to(elem, 0.5, {
          x: (elem[0].offsetLeft + pageX * speedX )*fixer,
          y: (elem[0].offsetTop + pageY * speedY)*fixer
        });
      });
      function textPayloadBack(){
        TweenMax.to(elem, .8, {
          opacity: 1,
          ease: Strong.easeOut
        });
      }
      function textPayload(){
        TweenMax.to(elem, .8, {
          opacity: 0,
          ease: Strong.easeOut
        });
      }
      cardConnector.textPayload = textPayload;
      cardConnector.textPayloadBack = textPayloadBack;
    }
  }
})
.directive('cardImage', function(cardConnector, swipe) {
  return {
    restrict: 'A',
    priority: 97,
    scope: {
      src: '@'
    },
    compile: function(tElem, tAttr) {
      var titleHeight = 50;
      var initialHeight = 480;
      var initialTop = 0;
      
      return function link(scope, elem, attr) {
        TweenMax.set(elem, {
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 59%,rgba(0,0,0,0.65) 100%), url(' + attr.src + ') no-repeat',
          // background: 'url(' + attr.src + '), linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.6)) no-repeat',
          'background-size': '100%',
          top: initialTop,
          height: initialHeight
        });
        function resizePayload() {
          TweenMax.to(elem, .8, {
            top: initialTop,
            ease: Strong.easeOut
          });
          cardConnector.resized = false;
        }

        function handler(){
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
          if (cardConnector.textPayload)
            cardConnector.textPayload();
        }
        elem.on('click', handler);
      }
    }
  }
})