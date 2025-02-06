import { Vector3 } from "three";

export interface CommandInput {
  input: HTMLInputElement;
  destroy: () => void;
}

const commandInputDivId = "command_input";

export const setDivCursorPosition = (div: HTMLDivElement, c: Vector3) => {
  div.innerHTML = `x: ${parseFloat(c.x.toFixed(2))}&nbsp;&nbsp; y: ${parseFloat(
    c.y.toFixed(2)
  )}&nbsp;&nbsp; z: ${parseFloat(c.z.toFixed(2))}`;
};

export const createCommandInputDiv = (): CommandInput => {
  // Create a container div
  const input = document.createElement("input");
  input.id = commandInputDivId;
  input.style.position = "absolute";
  input.style.background = "white";
  input.style.border = "1px solid black";
  input.style.padding = "5px";
  input.style.zIndex = "-10"; // Ensure it appears above other elements
  input.style.pointerEvents = "auto"; // Allow interaction
  input.style.overflow = "hidden";

  input.style.left = `${0}px`;
  input.style.top = `${0}px`;

  // Create a number input

  input.type = "text";
  input.placeholder = "coords";

  document.body.appendChild(input);

  setTimeout(() => {
    input.focus();
  }, 0);

  const updatePositionHandler = (event: MouseEvent) =>
    updatePosition(event, input);

  // Attach the listener
  document.addEventListener("mousemove", updatePositionHandler);

  return {
    input,
    destroy: () => {
      document.removeEventListener("mousemove", updatePositionHandler);
      input.remove();
      console.log("Removed the input div");
    },
  };
};

const updatePosition = (event: MouseEvent, div: HTMLInputElement) => {
  event.stopPropagation();
  div.style.left = `${event.pageX + 10}px`;
  div.style.top = `${event.pageY}px`;
  div.style.zIndex = "100";
};
