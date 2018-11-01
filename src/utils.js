export function smartSearch(haystack, needle) {
  haystack = haystack.toLowerCase()
  needle = needle.toLowerCase()

  let j = 0;
  for (let i = 0; i < haystack.length; i++) {
    if (haystack[i] == needle[j] && j < needle.length) {
      j++;
    }
    if (j == needle.length)
      return true;
  }

  return j == needle.length;

}

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

export function disableScroll() {
  //if (window.addEventListener) // older FF
      //window.addEventListener('DOMMouseScroll', preventDefault, false);
  //window.onwheel = preventDefault; // modern standard
  //window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  document.ontouchmove  = preventDefault; // mobile
  //document.onkeydown  = preventDefaultForScrollKeys;
  //document.removeEventListener("touchmove", preventDefault);
  document.querySelector('html').style.overflowY = 'hidden';
  document.querySelector('html').style.touchAction = 'none';
  document.body.style.touchAction = 'none';
  document.body.touchAction = 'none';
  document.body.style.overflowY = 'hidden';
  document.body.style.position = 'relative';
  

}

export function enableScroll() {
  //if (window.removeEventListener)
    //window.removeEventListener('DOMMouseScroll', preventDefault, false);
  //window.onmousewheel = document.onmousewheel = null;
  //window.onwheel = null;
  document.ontouchmove = (e) =>  true;
  //document.onkeydown = null;
  //document.addEventListener("touchmove", preventDefault);
  document.querySelector('html').style.overflowY = 'visible';
  document.querySelector('html').style.touchAction = 'auto';
  document.body.style.touchAction = 'auto';
  document.body.touchAction = 'auto';
  document.body.style.overflowY = 'visible';
  document.body.style.position = 'static';
}

export function scrollIt(destination, duration = 200, easing = 'linear', callback) {

  const easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  };

  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop ;
  const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}
