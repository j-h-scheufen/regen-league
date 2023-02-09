import { EventHandler, useEffect, useRef } from "react";

// from https://usehooks.com/useEventListener/
export const useEventListener = (
  eventName: string,
  handler: EventHandler<any>,
  element: EventTarget = globalThis
) => {
  // Create a ref that stores handler
  const savedHandler = useRef<EventHandler<any> | null>(null);
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler without us needing to pass it in effect deps array, which removes the potential to cause the effect to re-run every render
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;
      // Create event listener that calls handler function stored in ref
      const eventListener: EventListener = (event) => {
        if (savedHandler.current instanceof Function) {
          savedHandler.current(event);
        }
      };
      // Add event listener
      element.addEventListener(eventName, eventListener);
      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};
