export function updateScrollAxis(
  boxElement: HTMLElement,
  containerElement: HTMLElement,
  clientX: number,
  clientY: number
) {
  const boxRect = boxElement.getBoundingClientRect();
  const containerRect = containerElement.getBoundingClientRect();

  if (boxRect.top < containerRect.top && clientY < containerRect.top) {
    containerElement.scrollTop -= containerRect.top - clientY;
  } else if (
    boxRect.bottom > containerRect.bottom &&
    clientY > containerRect.bottom
  ) {
    containerElement.scrollTop += clientY - containerRect.bottom;
  }

  if (boxRect.left < containerRect.left && clientX < containerRect.left) {
    containerElement.scrollLeft -= containerRect.left - clientX;
  } else if (
    boxRect.right > containerRect.right &&
    clientX > containerRect.right
  ) {
    containerElement.scrollLeft += clientX - containerRect.right;
  }
}
