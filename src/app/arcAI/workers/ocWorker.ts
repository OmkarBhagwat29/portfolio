self.importScripts("/opencascade.wasm.js");

let oc: any;

self.onmessage = async (e) => {
  if (!oc) {
    oc = await (self as any).OC();
  }

  const { type, payload } = e.data;
  if (type === "CREATE_BOX") {
    const bbox = new oc.BRepPrimAPI_MakeBox(
      payload.width,
      payload.height,
      payload.depth
    );
    const shape = bbox.Shape();
    self.postMessage({ type: "SHAPE_CREATED", shape });
  }
};
