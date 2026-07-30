import type { NodePropertyConfig } from "../../../types/node-properties"; 

export const toggleConfig: NodePropertyConfig = {
  nodeTypes: ['toggleNode'],
  properties: [
    {
      type: 'text',
      label: 'Label',
      key: 'label',
      defaultValue: 'Toggle'
    }
  ]
};