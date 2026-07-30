import type { NodePropertyConfig } from "../../../types/node-properties";

export const propertyConfigs: Record<string, NodePropertyConfig> = {
  splitterNode: {
    nodeTypes: ['splitterNode'],
    properties: [
      {
        type: 'number',
        label: 'Output Count',
        key: 'outputCount',
        min: 2,
        max: 8,
        step: 1,
        defaultValue: 2
      }
    ]
  },
  toggleNode: {
    nodeTypes: ['toggleNode'],
    properties: [
      {
        type: 'text',
        label: 'Label',
        key: 'label',
        defaultValue: 'Toggle'
      }
    ]
  },
};