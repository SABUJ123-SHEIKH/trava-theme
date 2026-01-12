function travaOnReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

function travaRegisterScrollTrigger() {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    return true;
  }
  return false;
}

function travaGetDatasetBool(dataset, key, fallback) {
  if (!dataset || typeof dataset[key] === 'undefined') {
    return fallback;
  }
  if (dataset[key] === 'true') {
    return true;
  }
  if (dataset[key] === 'false') {
    return false;
  }
  return fallback;
}

function travaGetDatasetInt(dataset, key, fallback) {
  var value = parseInt(dataset && dataset[key], 10);
  return isNaN(value) ? fallback : value;
}

function initTravaTestimonials() {
  if (!window.Swiper) {
    return;
  }

  document.querySelectorAll('.trava-testimonials__swiper').forEach(function (swiperElement) {
    var section = swiperElement.closest('.trava-testimonials');
    var dataset = section ? section.dataset : {};
    var shouldLoop = travaGetDatasetBool(dataset, 'loop', true);
    var transitionSpeed = travaGetDatasetInt(dataset, 'speed', 600);
    var spaceBetween = travaGetDatasetInt(dataset, 'space', 24);
    var shouldAutoplay = travaGetDatasetBool(dataset, 'autoplay', false);
    var autoplayDelay = travaGetDatasetInt(dataset, 'delay', 5000);
    var showDots = travaGetDatasetBool(dataset, 'dots', true);
    var showArrows = travaGetDatasetBool(dataset, 'arrows', true);
    var paginationElement = section ? section.querySelector('.swiper-pagination') : null;
    var nextButton = section ? section.querySelector('.trava-swiper-next') : null;
    var prevButton = section ? section.querySelector('.trava-swiper-prev') : null;

    var swiperOptions = {
      loop: shouldLoop,
      speed: transitionSpeed,
      spaceBetween: spaceBetween
    };

    if (showDots && paginationElement) {
      swiperOptions.pagination = { el: paginationElement, clickable: true };
    }
    if (showArrows && nextButton && prevButton) {
      swiperOptions.navigation = { nextEl: nextButton, prevEl: prevButton };
    }
    if (shouldAutoplay) {
      swiperOptions.autoplay = { delay: autoplayDelay, disableOnInteraction: false };
    }

    new Swiper(swiperElement, swiperOptions);
  });
}

function initTravaScrollReveal() {
  if (!travaRegisterScrollTrigger()) {
    return;
  }

  document.querySelectorAll('.trava-animate').forEach(function (element) {
    if (element.dataset && element.dataset.animate && element.dataset.animate !== 'none') {
      return;
    }
    gsap.from(element, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%'
      }
    });
  });
}

function initTravaTextAnimations() {
  if (!window.gsap) {
    return;
  }

  var isScrollTriggerReady = travaRegisterScrollTrigger();
  var originalHtmlByElement = new WeakMap();

  function wrapTextNodesForLetters(rootElement) {
    if (!rootElement) {
      return;
    }

    if (!originalHtmlByElement.has(rootElement)) {
      originalHtmlByElement.set(rootElement, rootElement.innerHTML);
    } else {
      rootElement.innerHTML = originalHtmlByElement.get(rootElement);
    }

    var textWalker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, {
      acceptNode: function (textNode) {
        if (!textNode.nodeValue || textNode.nodeValue.trim() === '') {
          return NodeFilter.FILTER_REJECT;
        }
        var parentElement = textNode.parentNode;
        if (!parentElement || parentElement.nodeName === 'SCRIPT' || parentElement.nodeName === 'STYLE') {
          return NodeFilter.FILTER_REJECT;
        }
        if (parentElement.closest && parentElement.closest('a, button, .trava-btn, .trava-navpill, .trava-testimonials__buttons, .trava-swiper-prev, .trava-swiper-next, .trava-social')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var textNodes = [];
    while (textWalker.nextNode()) {
      textNodes.push(textWalker.currentNode);
    }

    textNodes.forEach(function (textNode) {
      var nodeText = textNode.nodeValue;
      if (!nodeText) {
        return;
      }
      var fragment = document.createDocumentFragment();
      for (var letterIndex = 0; letterIndex < nodeText.length; letterIndex++) {
        var letterSpan = document.createElement('span');
        letterSpan.className = 'trava-letter';
        letterSpan.textContent = nodeText[letterIndex];
        fragment.appendChild(letterSpan);
      }
      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  function getLetterSpans(element) {
    wrapTextNodesForLetters(element);
    return Array.prototype.slice.call(element.querySelectorAll('.trava-letter'));
  }

  document.querySelectorAll('[data-animate]').forEach(function (animatedElement) {
    var animationType = animatedElement.dataset ? animatedElement.dataset.animate : 'none';
    var animationTrigger = animatedElement.dataset ? (animatedElement.dataset.animateTrigger || 'scroll') : 'scroll';
    if (!animationType || animationType === 'none') {
      return;
    }

    var textTargets = Array.prototype.slice.call(animatedElement.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li'));
    if (!textTargets.length) {
      return;
    }

    if (animationType === 'text-letters-fade' || animationType === 'text-letters-random') {
      var letterRootElements = Array.prototype.slice.call(animatedElement.querySelectorAll('h1,h2,h3,h4,h5,h6,p'));
      if (!letterRootElements.length) {
        letterRootElements = [animatedElement];
      }

      var runLetters = function () {
        var letterSpans = [];
        letterRootElements.forEach(function (letterRoot) {
          letterSpans = letterSpans.concat(getLetterSpans(letterRoot));
        });
        if (!letterSpans.length) {
          return;
        }

        gsap.killTweensOf(letterSpans);
        gsap.set(letterSpans, { opacity: 0, y: 10 });
        gsap.to(letterSpans, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          stagger: animationType === 'text-letters-random' ? { each: 0.02, from: 'random' } : 0.02,
          onComplete: function () {
            letterRootElements.forEach(function (letterRoot) {
              if (originalHtmlByElement.has(letterRoot)) {
                letterRoot.innerHTML = originalHtmlByElement.get(letterRoot);
              }
            });
          }
        });
      };

      if (animationTrigger === 'load') {
        runLetters();
        return;
      }

      if (!isScrollTriggerReady) {
        return;
      }

      ScrollTrigger.create({
        trigger: animatedElement,
        start: 'top 85%',
        onEnter: runLetters,
        onEnterBack: runLetters
      });
      return;
    }

    var animationConfig = {
      opacity: 0,
      y: animationType === 'text-fade' ? 0 : 30,
      duration: animationType === 'text-stagger' ? 0.6 : 0.7,
      ease: 'power2.out',
      stagger: animationType === 'text-stagger' ? 0.08 : 0
    };

    if (animationTrigger === 'load') {
      gsap.from(textTargets, animationConfig);
      return;
    }

    if (!isScrollTriggerReady) {
      return;
    }

    gsap.from(textTargets, Object.assign(animationConfig, {
      scrollTrigger: {
        trigger: animatedElement,
        start: 'top 85%'
      }
    }));
  });
}

function initTravaMobileMenu() {
  function setMenuState(containerElement, isOpen) {
    var menu = containerElement ? containerElement.querySelector('.trava-navpill') : null;
    var toggleButton = containerElement ? containerElement.querySelector('.trava-mobile-toggle') : null;
    if (!menu || !toggleButton) {
      return;
    }

    menu.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('trava-menu-open', isOpen);
    toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  document.querySelectorAll('.trava-mobile-toggle').forEach(function (toggleButton) {
    toggleButton.addEventListener('click', function () {
      var containerElement = toggleButton.closest('.trava-hero, .trava-header');
      var menu = containerElement ? containerElement.querySelector('.trava-navpill') : null;
      if (!containerElement || !menu) {
        return;
      }

      var isMenuOpen = !menu.classList.contains('is-open');
      setMenuState(containerElement, isMenuOpen);
    });
  });

  document.querySelectorAll('.trava-header, .trava-hero').forEach(function (containerElement) {
    var menu = containerElement.querySelector('.trava-navpill');
    if (!menu) {
      return;
    }

    var closeButton = menu.querySelector('.trava-navpill__close');
    if (closeButton) {
      closeButton.addEventListener('click', function () {
        setMenuState(containerElement, false);
      });
    }

    menu.querySelectorAll('a').forEach(function (menuLink) {
      menuLink.addEventListener('click', function () {
        setMenuState(containerElement, false);
      });
    });
  });
}

travaOnReady(function () {
  initTravaTestimonials();
  initTravaScrollReveal();
  initTravaTextAnimations();
  initTravaMobileMenu();
});
