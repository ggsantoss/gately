"use client";

import { memo } from "react";
import { type GateGeometry, GateRenderer, H, type LogicGateProps, W } from "./base/index";

function getSplitterGeometry(): GateGeometry {
  return {
    bodyPath: `
      M10 10 
      L${W - 10} 10 
      L${W - 10} ${H - 10} 
      L10 ${H - 10} 
      Z
    `,
    outputX: W - 10,
    outputY: H / 2,
    inputPinX: 10,
  };
}

export const SplitterNode = memo(({ id, data, isConnectable }: LogicGateProps) => {
  const geometry = getSplitterGeometry();
  const outputCount = data.outputCount || 2;

  return (
    <GateRenderer
      id={id}
      data={data}
      isConnectable={isConnectable}
      geometry={geometry}
      label={`SPLIT${outputCount}`}
      symbol={`1→${outputCount}`}
      inputHandles={1}
      outputHandles={outputCount as 2 | 3 | 4 | 5 | 6 | 7 | 8}
    />
  );
});

SplitterNode.displayName = "SplitterNode";