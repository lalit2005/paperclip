import { useState, useEffect } from "react";
export default function ExcalidrawComponent(props) {
  const [Comp, setComp] = useState(null);
  useEffect(() => {
    import("@excalidraw/excalidraw").then((comp) => setComp(comp.default));
  });
  return <>{Comp && <Comp {...props} />}</>;
}
