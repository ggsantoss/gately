"use client";

import type { Node } from "@xyflow/react";
import { useCallback } from "react";
import type { GateNodeProps } from "@gately/core/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { propertyConfigs } from "./config/property-configs";

interface PropertiesPanelProps {
  selectedNode: Node<GateNodeProps> | null;
  onUpdateNode: (nodeId: string, data: Partial<GateNodeProps['data']>) => void;
}

export function PropertiesPanel({ selectedNode, onUpdateNode }: PropertiesPanelProps) {
  const handlePropertyChange = useCallback((key: string, value: any) => {
    if (!selectedNode) return;
    
    const updatedData = {
      ...selectedNode.data,
      [key]: value
    };
    
    onUpdateNode(selectedNode.id, updatedData);
  }, [selectedNode, onUpdateNode]);

  if (!selectedNode) {
    return (
      <div className="w-72 bg-card border-l border-border p-4 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-sm font-medium">No node selected</p>
          <p className="text-xs mt-1">Click a node to edit its properties</p>
        </div>
      </div>
    );
  }

  const config = propertyConfigs[selectedNode.type || ''];
  if (!config || config.properties.length === 0) {
    return (
      <div className="w-72 bg-card border-l border-border p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Properties</h3>
          <p className="text-xs text-muted-foreground">{selectedNode.type}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          No configurable properties for this node
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-card border-l border-border p-4 overflow-y-auto h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Properties</h3>
        <p className="text-xs text-muted-foreground">{selectedNode.type}</p>
      </div>

      <div className="space-y-3">
        {config.properties.map((prop) => {
          const value = selectedNode.data[prop.key] ?? prop.defaultValue;

          switch (prop.type) {
            case 'text':
              return (
                <div key={prop.key} className="space-y-1">
                  <Label className="text-xs font-medium">{prop.label}</Label>
                  <Input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              );

            case 'number':
              return (
                <div key={prop.key} className="space-y-1">
                  <Label className="text-xs font-medium">{prop.label}</Label>
                  <Input
                    type="number"
                    min={prop.min}
                    max={prop.max}
                    step={prop.step}
                    value={value ?? prop.defaultValue}
                    onChange={(e) => handlePropertyChange(prop.key, parseFloat(e.target.value))}
                    className="h-8 text-sm"
                  />
                </div>
              );

            case 'range':
              return (
                <div key={prop.key} className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-xs font-medium">{prop.label}</Label>
                    <span className="text-xs text-muted-foreground">{value}</span>
                  </div>
                  <Slider
                    min={prop.min}
                    max={prop.max}
                    step={prop.step}
                    value={[value ?? prop.defaultValue]}
                    onValueChange={([val]) => handlePropertyChange(prop.key, val)}
                    className="py-2"
                  />
                </div>
              );

            case 'select':
              return (
                <div key={prop.key} className="space-y-1">
                  <Label className="text-xs font-medium">{prop.label}</Label>
                  <Select
                    value={String(value)}
                    onValueChange={(val) => handlePropertyChange(prop.key, val)}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prop.options?.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );

            case 'toggle':
              return (
                <div key={prop.key} className="flex items-center justify-between">
                  <Label className="text-xs font-medium">{prop.label}</Label>
                  <Switch
                    checked={value ?? false}
                    onCheckedChange={(checked) => handlePropertyChange(prop.key, checked)}
                  />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}