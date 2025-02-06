import { Snap } from "@/app/context/Snap";
import { Vector3 } from "three";

export const convertStringToPoint = (input: string): Vector3 | null => {
  input = input.trim(); //remove leading or trainling white spaces

  const values = input.split(",");

  if (values.length === 1) {
    const num = parseFloat(values[0]);
    if (isNaN(num)) {
      console.log("invalid number forat");
      return null;
    }
    return new Vector3(num, num, num);
  }

  if (values.length === 3) {
    const x = parseFloat(values[0]);
    const y = parseFloat(values[1]);
    const z = parseFloat(values[2]);

    // Validate all values are valid numbers
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.log("invalid number forat");
      return null;
    }

    return new Vector3(x, y, z);
  }

  return null;
};

export const setInputPoint = (snap: Snap, inputDiv: HTMLInputElement) => {
  const val = inputDiv.value;

  if (!val) {
    snap.inputPoint = null;
    return;
  }

  const pt = convertStringToPoint(val);

  if (pt) {
    if (!snap.inputPoint) {
      snap.inputPoint = pt.clone();
    } else {
      snap.inputPoint.copy(pt);
    }
  }
};
