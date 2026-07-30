import type { NodePropertyConfig } from "../../../types/node-properties";
import { splitterConfig } from "./splitter.config";
import { toggleConfig } from "./toggle.config"; 

export const propertyConfigs: Record<string, NodePropertyConfig> = {
  splitterNode: splitterConfig,
  toggleNode: toggleConfig
};