import React from "react"
import { BarStack } from "@visx/shape"
import { Group } from "@visx/group"
import { Grid } from "@visx/grid"
import { AxisBottom } from "@visx/axis"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import { LegendOrdinal } from "@visx/legend"
import { localPoint } from "@visx/event"
import { color } from "./constants"
import useGhgEmissions from "../../hooks/use-ghg-emissions"

const [energy, agriculture, landUse, industrial, waste] = [
  "Energy",
  "Agriculture",
  "Land_Use_Change_and_Forestry",
  "Industrial_Processes",
  "Waste",
]
const keys = [energy, agriculture, landUse, industrial, waste]

const { purple, seafoam, blue, green, palegreen, white } = color
const background = "#0a4248"
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 }
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
}

const width = 950
const height = 600

const getDate = d => d.Year

let tooltipTimeout

export default function GhgEmissionsBarStack({
  isPreview,
  events = false,
  margin = defaultMargin,
}) {
  // DATA
  const data = useGhgEmissions()

  // SCALES
  const yearScale = scaleBand({
    domain: data.map(getDate),
    padding: 0.2,
  })
  const emissionScale = scaleLinear({
    domain: [0, 60],
    nice: true,
  })
  const colorScale = scaleOrdinal({
    domain: keys,
    range: [green, purple, seafoam, blue, palegreen],
  })

  // TOOLTIP
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
    scroll: true,
  })

  if (width < 10) return null
  // BOUNDS
  const xMax = width
  const yMax = height - margin.top - 100

  yearScale.rangeRound([0, xMax])
  emissionScale.range([yMax, 0])

  return width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={background}
          rx={14}
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={yearScale}
          yScale={emissionScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={yearScale.bandwidth() / 2}
        />
        <Group top={margin.top}>
          <BarStack
            data={data}
            keys={keys}
            x={getDate}
            xScale={yearScale}
            yScale={emissionScale}
            color={colorScale}
          >
            {barStacks =>
              barStacks.map(barStack =>
                barStack.bars.map(bar => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip()
                      }, 300)
                    }}
                    onMouseMove={e => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout)
                      const eventSvgCoords = localPoint(e)
                      const left = bar.x + bar.width / 2
                      showTooltip({
                        tooltipData: bar,
                        tooltipTop: eventSvgCoords?.y,
                        tooltipLeft: left,
                      })
                    }}
                  />
                ))
              )
            }
          </BarStack>
        </Group>
        <AxisBottom
          top={yMax + margin.top}
          scale={yearScale}
          stroke={white}
          tickStroke={white}
          tickLabelProps={() => ({
            fill: white,
            fontSize: 11,
            textAnchor: "middle",
          })}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: margin.top / 2 - 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: "14px",
        }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 15px 0 0"
        />
      </div>

      {!isPreview && tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div style={{ color: colorScale(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{tooltipData.bar.data[tooltipData.key]} Gt</div>
        </TooltipInPortal>
      )}
    </div>
  )
}
