import {useCallback, useEffect, useState} from 'react';

import {appBridge} from '../lib/native/app-bridge';

export type KeyEvent = {
  key: String;
  keyCode: number;
};

export function useKeyEvents(
  onKeyEvent: (event: KeyEvent) => void,
  isActive = true,
) {
  const [active, setActive] = useState(isActive);
  useEffect(() => {
    appBridge.consumeKeys(active);
    const keyDownListener = appBridge.addListener(
      'keyDown',
      (event: KeyEvent) => {
        if (active) {
          onKeyEvent(event);
        }
      },
    );

    return () => {
      keyDownListener.remove();
    };
  }, [active, onKeyEvent]);

  const toggle = useCallback((state: boolean) => {
    setActive(state);
    appBridge.consumeKeys(state);
  }, []);

  return toggle;
}
