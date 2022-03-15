import React, { useEffect, useRef, useState } from "react";

function HighlightPop(props: {
  onHighlightPop?: (selectedText: string) => void;
  children: React.ReactNode;
  popoverItems: (className: string) => React.ReactNode;
}) {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const highlight = useRef(null);

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const hidePopover = () => {
    setPopoverVisible(false);
  };

  const onMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (!selectedText) {
      hidePopover();
      return;
    }

    const selectionRange = selection.getRangeAt(0);

    const startNode = selectionRange.startContainer.parentNode;
    const endNode = selectionRange.endContainer.parentNode;

    const highlightable = highlight.current;
    const highlightableRegion = highlightable.querySelector(".h-popable");

    if (highlightableRegion) {
      if (
        !highlightableRegion.contains(startNode) ||
        !highlightableRegion.contains(endNode)
      ) {
        hidePopover();
        return;
      }
    } else if (
      !highlightable.contains(startNode) ||
      !highlightable.contains(endNode)
    ) {
      hidePopover();
      return;
    }

    if (!startNode.isSameNode(endNode)) {
      hidePopover();
      return;
    }

    const { x, y, width } = selectionRange.getBoundingClientRect();
    if (!width) {
      hidePopover();
      return;
    }

    setX(x + width / 2);
    setY(y + window.scrollY - 10);
    setSelectedText(selectedText);
    setPopoverVisible(true);

    props.onHighlightPop?.(selectedText);
  };

  const itemClass = "h-popover-item";
  return (
    <div ref={highlight}>
      {popoverVisible && (
        <div
          className="h-popover"
          style={{ left: `${x}px`, top: `${y}px` }}
          role="presentation"
          onMouseDown={(e) => e.preventDefault()}
        >
          {props.popoverItems ? (
            props.popoverItems(itemClass)
          ) : (
            <span role="button" className={itemClass}>
              Add yours
            </span>
          )}
        </div>
      )}
      {props.children}
    </div>
  );
}

export default HighlightPop;
