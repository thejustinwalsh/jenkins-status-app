import {useCallback, useEffect, useState} from 'react';

import {appBridge} from '../lib/native/app-bridge';

export type KeyEvent = {
  key: String;
  keyCode: number;
};

export function useKeyEvents(onKeyEvent: (event: KeyEvent) => void) {
  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    appBridge.consumeKeys(isActive);
    const keyDownListener = appBridge.addListener(
      'keyDown',
      (event: KeyEvent) => {
        if (isActive) {
          onKeyEvent(event);
        }
      },
    );

    return () => {
      keyDownListener.remove();
    };
  }, [isActive, onKeyEvent]);

  const toggle = useCallback((active: boolean) => {
    setIsActive(active);
    appBridge.consumeKeys(active);
  }, []);

  return toggle;
}
