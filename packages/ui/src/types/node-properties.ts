import type { GateNodeProps } from "@gately/core/types";

export interface NodeProperties extends Partial<GateNodeProps['data']> {
  outputCount?: number;
  frequency?: number;
  dutyCycle?: number;
  label?: string;
  enabled?: boolean;
}

export interface PropertyDefinition {
  type: 'number' | 'text' | 'select' | 'toggle' | 'range';
  label: string;
  key: keyof NodeProperties;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  defaultValue?: any;
}

export interface NodePropertyConfig {
  nodeTypes: string[];
  properties: PropertyDefinition[];
}