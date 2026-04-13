import { useState, useRef, useEffect } from 'react';

type SelectorItem = {
  key: number;
  value: string;
  content: React.ReactNode;
};

type SelectItemsProps = {
  items: SelectorItem[];
  defaultSelected?: number;
  onChange?: (item: SelectorItem) => void;
  className?: string;
  borderColor?: string;
  borderWidth?: number;
  animationDuration?: number;
};

export const SelectItems: React.FC<SelectItemsProps> = ({
  items,
  defaultSelected,
  onChange,
  className = '',
  borderColor = 'var(--color-accent)',
  borderWidth = 2,
  animationDuration = 300,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(defaultSelected || null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [borderStyle, setBorderStyle] = useState({
    width: 0,
    height: 0,
    transform: 'translate(0, 0)',
    opacity: 0,
  });

  useEffect(() => {
    if (!containerRef.current || !selectedId) return;

    const selectedElement = containerRef.current.querySelector(
      `[data-frame-id="${selectedId}"]`
    ) as HTMLElement;

    if (selectedElement) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elementRect = selectedElement.getBoundingClientRect();

      setBorderStyle({
        width: elementRect.width,
        height: elementRect.height,
        transform: `translate(${elementRect.left - containerRect.left}px, ${elementRect.top - containerRect.top
          }px)`,
        opacity: 1,
      });
    }
  }, [selectedId]);

  const handleSelect = (item: SelectorItem) => {
    setSelectedId(item.key);
    onChange?.(item);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex gap-2 ${className}`}
    >
      {/* Animated border */}
      <div
        className="absolute pointer-events-none transition-all ease-in-out"
        style={{
          width: borderStyle.width,
          height: borderStyle.height,
          transform: borderStyle.transform,
          opacity: borderStyle.opacity,
          transitionDuration: `${animationDuration}ms`,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: '8px',
          boxSizing: 'border-box',
        }}
      />

      {/* Frames */}
      {items.map((item) => (
        <div
          key={item.key}
          data-frame-id={item.key}
          onClick={() => handleSelect(item)}
          className="cursor-pointer relative z-10 transition-transform"
          style={{ padding: borderWidth }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};