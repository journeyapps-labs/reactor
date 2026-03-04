import { useEffect, useState } from 'react';

export const useDraggingElement = () => {
  const [draggingElement, setDraggingElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const dragStart = (event: DragEvent) => {
      if (event.target instanceof Element) {
        setDraggingElement(event.target as HTMLElement);
      } else {
        setDraggingElement(null);
      }
    };
    const dragEnd = () => {
      setDraggingElement(null);
    };
    document.addEventListener('dragstart', dragStart, true);
    document.addEventListener('dragend', dragEnd, true);
    return () => {
      document.removeEventListener('dragstart', dragStart, true);
      document.removeEventListener('dragend', dragEnd, true);
    };
  }, []);

  return draggingElement;
};
