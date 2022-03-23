export function unwrap(node: HTMLElement) {
  if (node) {
    const parent = node.parentNode;
    while (node.firstChild) {
      parent.insertBefore(node.firstChild, node);
    }

    parent?.removeChild(node);
    parent?.normalize();
  }
}
