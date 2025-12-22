import * as React from "react";
import * as RechartsPrimitive from "recharts";
import styled from "styled-components";

import { cn } from "../../lib/utils";

// Basic themes map used for generating CSS variables.
const THEMES = { light: "", dark: ".dark" };

// Context without TypeScript types
const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

// Styled components
const StyledChartContainer = styled.div`
  display: flex;
  justify-content: center;
  font-size: 0.75rem; /* text-xs */
  aspect-ratio: 16 / 9;
  /* These outline / cursor tweaks keep Recharts primitives looking clean */
  .recharts-layer,
  .recharts-surface,
  .recharts-sector {
    outline: none;
  }
`;

const StyledTooltipContent = styled.div`
  display: grid;
  min-width: 8rem;
  align-items: flex-start;
  gap: 0.375rem; /* 1.5 */
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border) / 0.5);
  background-color: hsl(var(--background));
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
`;

const TooltipItemsGrid = styled.div`
  display: grid;
  gap: 0.375rem;
`;

const TooltipItemRow = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 0.5rem;
`;

const TooltipIndicatorBox = styled.div`
  border-radius: 2px;
`;

const TooltipItemInner = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  line-height: 1;
  align-items: center;
`;

const TooltipItemLabelGroup = styled.div`
  display: grid;
  gap: 0.375rem;
`;

const TooltipItemValue = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: hsl(var(--foreground));
`;

const StyledLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  svg {
    width: 0.75rem;
    height: 0.75rem;
    color: hsl(var(--muted-foreground));
  }
`;

const LegendColorDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 2px;
  flex-shrink: 0;
`;

const ChartContainer = React.forwardRef(function ChartContainer(
  { id, className, children, config, ...props },
  ref,
) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <StyledChartContainer
        data-chart={chartId}
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </StyledChartContainer>
    </ChartContext.Provider>
  );
});

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config || {}).filter(([, cfg]) => cfg.theme || cfg.color);

  if (!colorConfig.length) {
    return null;
  }

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const variables = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            (itemConfig.theme && itemConfig.theme[theme]) || itemConfig.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");

      return `${prefix} [data-chart=${id}] {\n${variables}\n}`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef(function ChartTooltipContent(
  {
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
    ...rest
  },
  ref,
) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload || !payload.length) return null;

    const [item] = payload;
    const key = `${labelKey || item.dataKey || item.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? (config[label] && config[label].label) || label
        : itemConfig && itemConfig.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }
    if (!value) return null;
    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload || !payload.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <StyledTooltipContent ref={ref} className={cn("", className)} {...rest}>
      {!nestLabel ? tooltipLabel : null}
      <TooltipItemsGrid>
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <TooltipItemRow key={item.dataKey}>
              {formatter && item.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig && itemConfig.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <TooltipIndicatorBox
                        style={{
                          backgroundColor:
                            indicator === "dot" ? indicatorColor : "transparent",
                          borderColor: indicatorColor,
                          borderWidth:
                            indicator === "dashed" ? "1.5px" : indicator === "line" ? "1px" : "0",
                          borderStyle:
                            indicator === "dashed" ? "dashed" : indicator === "line" ? "solid" : "solid",
                          width:
                            indicator === "dot"
                              ? "0.625rem"
                              : indicator === "line"
                              ? "0.25rem"
                              : "0",
                          height: indicator === "dot" ? "0.625rem" : "0.625rem",
                          marginTop: nestLabel && indicator === "dashed" ? "0.125rem" : 0,
                        }}
                      />
                    )
                  )}
                  <TooltipItemInner>
                    <TooltipItemLabelGroup>
                      {nestLabel ? tooltipLabel : null}
                      <span style={{ color: "hsl(var(--muted-foreground))" }}>
                        {(itemConfig && itemConfig.label) || item.name}
                      </span>
                    </TooltipItemLabelGroup>
                    {item.value != null && (
                      <TooltipItemValue>
                        {item.value.toLocaleString()}
                      </TooltipItemValue>
                    )}
                  </TooltipItemInner>
                </>
              )}
            </TooltipItemRow>
          );
        })}
      </TooltipItemsGrid>
    </StyledTooltipContent>
  );
});

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef(function ChartLegendContent(
  { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey, ...rest },
  ref,
) {
  const { config } = useChart();

  if (!payload || !payload.length) return null;

  return (
    <StyledLegend
      ref={ref}
      className={cn(
        "",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
      {...rest}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <LegendItem key={item.value}>
            {itemConfig && itemConfig.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <LegendColorDot
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig && itemConfig.label}
          </LegendItem>
        );
      })}
    </StyledLegend>
  );
});

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== "object" || payload === null) return undefined;

  const payloadPayload =
    payload.payload && typeof payload.payload === "object"
      ? payload.payload
      : undefined;

  let configLabelKey = key;

  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key];
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key];
  }

  if (!config) return undefined;

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
