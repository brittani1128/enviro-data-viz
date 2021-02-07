import React from "react"

import { AxisBottom, AxisLeft } from "@visx/axis"
import { localPoint } from "@visx/event"
import { Grid } from "@visx/grid"
import { Group } from "@visx/group"
import { LegendOrdinal } from "@visx/legend"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { BarStack } from "@visx/shape"
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip"

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
const defaultMargin = { top: 50, right: 30, bottom: 10, left: 30 }
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
}

const tickLabelProps = {
  fill: white,
  fontSize: 11,
  textAnchor: "end",
}

const getDate = d => d.Year

let tooltipTimeout

export default function GhgEmissionsBarStack({
  isPreview,
  events = false,
  margin = defaultMargin,
  width: outerWidth = 1000,
  height: outerHeight = 600,
}) {
  // SETUP
  const marginHorizontal = margin.left + margin.right
  const marginVertical = margin.top + margin.bottom
  const width = outerWidth - marginHorizontal
  const height = outerHeight - marginVertical
  const xMax = width - margin.left
  const yMax = height - margin.top - 20

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

  yearScale.rangeRound([0, xMax])
  emissionScale.range([yMax, 0])

  return width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg ref={containerRef} width={outerWidth} height={outerHeight}>
        <rect
          x={0}
          y={0}
          width={outerWidth}
          height={outerHeight}
          fill={background}
          rx={14}
        />
        <Grid
          top={marginVertical}
          left={marginHorizontal}
          xScale={yearScale}
          yScale={emissionScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={yearScale.bandwidth() / 2}
        />
        <Group top={marginVertical} left={marginHorizontal}>
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
          left={marginHorizontal}
          top={yMax + marginVertical}
          scale={yearScale}
          stroke={white}
          tickStroke={white}
          tickLabelProps={() => ({
            ...tickLabelProps,
            transform: `translate (18, 5)`,
          })}
        />
        <AxisLeft
          left={marginHorizontal}
          top={marginVertical}
          scale={emissionScale}
          stroke={white}
          tickStroke={white}
          tickLabelProps={() => ({
            ...tickLabelProps,
            transform: `translate (-5, 3)`,
          })}
        />
        <text
          x="-200"
          y={marginHorizontal + 20}
          transform="rotate(-90)"
          fontSize={10}
        >
          Emissions (Gt)
        </text>
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
          <div>
            {Number(tooltipData.bar.data[tooltipData.key]).toFixed(2)} Gt
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}
