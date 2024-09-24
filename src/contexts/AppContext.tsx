import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import appBridge from '@app/modules/NativeAppBridge';

export type PopoverEvent = {
  isActive: boolean;
};

export type KeyEvent = {
  key: String;
  keyCode: number;
};

type EventListeners = {
  onKeyDown: Array<(event: KeyEvent) => void>;
  onKeyUp: Array<(event: KeyEvent) => void>;
  onPopover: Array<(event: PopoverEvent) => void>;
};

const listeners: EventListeners = {
  onKeyDown: [],
  onKeyUp: [],
  onPopover: [],
};

// TODO: Add listeners for keyDown, keyUp, and popover events
/*
function dispatchKeyDown(event: KeyEvent) {
  listeners.onKeyDown.forEach(listener => {
    listener(event);
  });
}

function dispatchKeyUp(event: KeyEvent) {
  listeners.onKeyUp.forEach(listener => {
    listener(event);
  });
}

function dispatchPopover(event: PopoverEvent) {
  listeners.onPopover.forEach(listener => {
    listener(event);
  });
}
*/

function addKeyDownListener(listener: (event: KeyEvent) => void) {
  const count = listeners.onKeyDown.push(listener);
  if (count > 0) {
    appBridge?.consumeKeys(true);
  }
}

function removeKeyDownListener(listener: (event: KeyEvent) => void) {
  const i = listeners.onKeyDown.findIndex(l => l === listener);
  listeners.onKeyDown.splice(i, 1);

  return listeners.onKeyDown.length === 0 && listeners.onKeyUp.length === 0;
}

function addKeyUpListener(listener: (event: KeyEvent) => void) {
  const count = listeners.onKeyUp.push(listener);
  if (count > 0) {
    appBridge?.consumeKeys(true);
  }
}

function removeKeyUpListener(listener: (event: KeyEvent) => void) {
  const i = listeners.onKeyUp.findIndex(l => l === listener);
  if (i >= 0) {
    listeners.onKeyUp.splice(i, 1);
  }

  return listeners.onKeyUp.length === 0 && listeners.onKeyDown.length === 0;
}

function addPopoverListener(listener: (event: PopoverEvent) => void) {
  listeners.onPopover.push(listener);
}

function removePopoverListener(listener: (event: PopoverEvent) => void) {
  listeners.onPopover.push(listener);
}

const useValue = () => {
  const [consumeKeys, setConsumeKeys] = useState<boolean>(false);
  return {
    consumeKeys,
    setConsumeKeys,
  };
};

export const AppContext = createContext({} as ReturnType<typeof useValue>);

export function useKeyDown(listener: (event: KeyEvent) => void) {
  const {consumeKeys, setConsumeKeys: setConsumeKeysPrime} =
    useContext(AppContext);

  const setConsumeKeys = useCallback(
    (active: boolean) => {
      setConsumeKeysPrime(active);
      appBridge?.consumeKeys(active);
    },
    [setConsumeKeysPrime],
  );

  useEffect(() => {
    addKeyDownListener(listener);
    return () => {
      if (removeKeyDownListener(listener)) {
        setConsumeKeys(false);
      }
    };
  }, [listener, setConsumeKeys]);

  return {consumeKeys, setConsumeKeys};
}

export function useKeyUp(listener: (event: KeyEvent) => void) {
  const {consumeKeys, setConsumeKeys: setConsumeKeysPrime} =
    useContext(AppContext);

  const setConsumeKeys = useCallback(
    (active: boolean) => {
      setConsumeKeysPrime(active);
      appBridge?.consumeKeys(active);
    },
    [setConsumeKeysPrime],
  );

  useEffect(() => {
    addKeyUpListener(listener);
    return () => {
      if (removeKeyUpListener(listener)) {
        setConsumeKeys(false);
        appBridge?.consumeKeys(false);
      }
    };
  }, [listener, setConsumeKeys]);

  return {consumeKeys, setConsumeKeys};
}

export function usePopover(listener: (event: PopoverEvent) => void) {
  const {} = useContext(AppContext);
  useEffect(() => {
    addPopoverListener(listener);
    return () => removePopoverListener(listener);
  }, [listener]);
}

export function AppProvider({children}: React.PropsWithChildren) {
  useEffect(() => {
    // TODO: Add listeners for keyDown, keyUp, and popover events
    /*
    const keyDownListener = appBridge?.addListener(
      'keyDown',
      (event: KeyEvent) => dispatchKeyDown(event),
    );

    const keyUpListener = appBridge?.addListener('keyUp', (event: KeyEvent) =>
      dispatchKeyUp(event),
    );

    const popoverListener = appBridge?.addListener(
      'popover',
      (event: PopoverEvent) => dispatchPopover(event),
    );

    return () => {
      keyDownListener.remove();
      keyUpListener.remove();
      popoverListener.remove();
    };
    */
  }, []);

  return (
    <AppContext.Provider value={useValue()}>{children}</AppContext.Provider>
  );
}
