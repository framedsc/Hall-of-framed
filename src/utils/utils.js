import { useEffect, useLayoutEffect, useState } from 'react';

export const useViewport = () => {
  const actualWidth = document.documentElement.clientWidth || document.body.clientWidth;
  const [width, setWidth] = useState(actualWidth);

  const onWindowLoad = () => {
    const actualWidth = document.documentElement.clientWidth || document.body.clientWidth;
    setWidth(actualWidth);
  }

  useEffect(() => {
    let resizeTimeout;
    window.setTimeout(onWindowLoad, 1000);
    const handleWindowResize = () => {
      const windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => setWidth(windowWidth), 50);
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Return the width so we can use it in our components
  return { width };
};

export const useOutsideAlerter = (ref, onClickOutside) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickOutside]);
};

export const breakpoints = {
  mobile: 820,
};

export const getBrowserFullscreenElementProp = () => {
  if (typeof document.fullscreenElement !== 'undefined') {
    return 'fullscreenElement';
  } else if (typeof document.mozFullScreenElement !== 'undefined') {
    return 'mozFullScreenElement';
  } else if (typeof document.msFullscreenElement !== 'undefined') {
    return 'msFullscreenElement';
  } else if (typeof document.webkitFullscreenElement !== 'undefined') {
    return 'webkitFullscreenElement';
  } else {
    throw new Error('fullscreenElement is not supported by this browser');
  }
}

export const useFullscreenStatus = (elRef) => {
  const [isFullscreen, setIsFullscreen] = useState(
    document[getBrowserFullscreenElementProp()] != null,
  );

  const setFullscreen = () => {
    if (elRef.current == null) return;

    elRef.current
      .requestFullscreen()
      .then(() => {
        setIsFullscreen(document[getBrowserFullscreenElementProp()] != null);
      })
      .catch(() => {
        setIsFullscreen(false);
      });
  };

  useLayoutEffect(() => {
    document.onfullscreenchange = () =>
      setIsFullscreen(document[getBrowserFullscreenElementProp()] != null);

    return () => (document.onfullscreenchange = undefined);
  });

  return [isFullscreen, setFullscreen];
};
