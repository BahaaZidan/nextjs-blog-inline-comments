export function unwrap(node: HTMLElement) {
  if (node) {
    const parent = node.parentNode;
    while (node.firstChild) {
      node.parentNode.insertBefore(node.firstChild, node);
    }

    node.parentNode.removeChild(node);
    parent.normalize();
  }
}
