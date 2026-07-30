import type { NodePropertyConfig } from "../../../types/node-properties";

export const splitterConfig: NodePropertyConfig = {
  nodeTypes: ['splitterNode'],
  properties: [
    {
      type: 'number',
      label: 'Output Count',
      key: 'outputCount',
      min: 2,
      max: 5,
      step: 1,
      defaultValue: 2
    }
  ]
};