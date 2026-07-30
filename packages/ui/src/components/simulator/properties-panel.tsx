"use client";

import type { Node } from "@xyflow/react";
import { useCallback, useState, useEffect } from "react";
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
  const [localData, setLocalData] = useState<Partial<GateNodeProps['data']>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedNode) {
      setLocalData(selectedNode.data);
      setError(null);
    }
  }, [selectedNode]);

  const handlePropertyChange = useCallback((key: string, value: any, prop?: any) => {
    if (!selectedNode) return;
    
    if (prop?.type === 'number' || prop?.type === 'range') {
      if (isNaN(value) || value === '') {
        setError(`Please enter a valid number`);
        return;
      }

      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      
      if (prop.min !== undefined && numValue < prop.min) {
        setError(`Minimum value is ${prop.min}`);
        return;
      }
      
      if (prop.max !== undefined && numValue > prop.max) {
        setError(`Maximum value is ${prop.max}`);
        return;
      }
      
      setError(null);
      
      const updatedData: Partial<GateNodeProps['data']> = {
        ...selectedNode.data,
        [key]: numValue
      };
      
      setLocalData(updatedData);
      onUpdateNode(selectedNode.id, updatedData);
    } else {
      const updatedData: Partial<GateNodeProps['data']> = {
        ...selectedNode.data,
        [key]: value
      };
      
      setLocalData(updatedData);
      onUpdateNode(selectedNode.id, updatedData);
    }
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

  const currentData = Object.keys(localData).length > 0 ? localData : selectedNode.data;

  return (
    <div className="w-72 bg-card border-l border-border p-4 overflow-y-auto h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Properties</h3>
        <p className="text-xs text-muted-foreground">{selectedNode.type}</p>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {config.properties.map((prop) => {
          const value = currentData[prop.key as keyof typeof currentData] ?? prop.defaultValue;

          switch (prop.type) {
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
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue === '') {
                        setError(null);
                        setLocalData({
                          ...currentData,
                          [prop.key]: ''
                        });
                        return;
                      }
                      const numValue = parseFloat(newValue);
                      if (!isNaN(numValue)) {
                        handlePropertyChange(prop.key, numValue, prop);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        const fallback = currentData[prop.key as keyof typeof currentData] ?? prop.defaultValue;
                        handlePropertyChange(prop.key, fallback, prop);
                        return;
                      }
                      const numValue = parseFloat(val);
                      if (!isNaN(numValue)) {
                        let finalValue = numValue;
                        if (prop.min !== undefined && finalValue < prop.min) {
                          finalValue = prop.min;
                          setError(`Value adjusted to minimum (${prop.min})`);
                        }
                        if (prop.max !== undefined && finalValue > prop.max) {
                          finalValue = prop.max;
                          setError(`Value adjusted to maximum (${prop.max})`);
                        }
                        handlePropertyChange(prop.key, finalValue, prop);
                      }
                    }}
                    className={`h-8 text-sm ${error ? 'border-destructive' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: {prop.min}</span>
                    <span>Current: {value ?? prop.defaultValue}</span>
                    <span>Max: {prop.max}</span>
                  </div>
                </div>
              );

            case 'range':
              return (
                <div key={prop.key} className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-xs font-medium">{prop.label}</Label>
                    <span className="text-xs text-muted-foreground">{value ?? prop.defaultValue}</span>
                  </div>
                  <Slider
                    min={prop.min}
                    max={prop.max}
                    step={prop.step}
                    value={[value ?? prop.defaultValue]}
                    onValueChange={([val]) => {
                      handlePropertyChange(prop.key, val, prop);
                    }}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{prop.min}</span>
                    <span>{prop.max}</span>
                  </div>
                </div>
              );

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