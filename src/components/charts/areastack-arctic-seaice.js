import React, { useCallback } from "react"
import { AreaStack, Bar, Line } from "@visx/shape"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { localPoint } from "@visx/event"
import { scaleTime, scaleLinear, scaleOrdinal, scaleBand } from "@visx/scale"
import { withTooltip, Tooltip, defaultStyles, useTooltip } from "@visx/tooltip"
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip"

import useArcticSeaIceAge from "../../hooks/use-arctic-seaice-age"
// import { GradientOrangeRed } from "@visx/gradient"
import { color } from "./constants"

const getDate = d => Number(d.year)
const { purple, seafoam, blue, green, palegreen, white } = color
const colors = [purple, seafoam, blue, green, palegreen]

const tickLabelProps = {
  fill: white,
  fontSize: 11,
  textAnchor: "end",
}

export default function ArcticSeaiceAreaStack({
  width: outerWidth = 1000,
  height: outerHeight = 600,
  margin = { top: 50, right: 30, bottom: 10, left: 30 },
  events = false,
  isPreview,
}) {
  // SETUP
  const marginHorizontal = margin.left + margin.right
  const marginVertical = margin.top + margin.bottom
  const width = outerWidth - marginHorizontal
  const height = outerHeight - marginVertical
  const xMax = width
  const yMax = height
  const background = "#0a4248"

  // DATA
  const data = useArcticSeaIceAge()
  const keys = Object.keys(data[0])
    .filter(k => k !== "year")
    .reverse()

  const getY0 = d => d[0]
  const getY1 = d => d[1]

  // SCALES
  const xScale = scaleBand({
    range: [marginHorizontal, xMax],
    domain: data.map(getDate),
    nice: true,
  })

  const yScale = scaleLinear({
    range: [yMax, margin.top],
    domain: [0, 3],
    nice: true,
  })

  const colorScale = scaleOrdinal({
    domain: keys,
    range: [green, purple, seafoam, blue, palegreen],
  })

  // TOOLTIP SETUP

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip({
    // initial tooltip state
    tooltipOpen: false,
    tooltipLeft: width / 3,
    tooltipTop: height / 3,
    tooltipData: "Move me with your mouse or finger",
  })
  const handleTooltip = useCallback(
    event => {
      const { x, y } = localPoint(event) || { x: 0 }
      // const x0 = Math.round(xScale.invert(x))
      // console.log(x0)
      // const index = bisectDate(stock, x0, 1)
      // const d0 = stock[index - 1]
      // const d1 = stock[index]
      // let d = d0
      // if (d1 && getDate(d1)) {
      //   d =
      //     x0.valueOf() - getDate(d0).valueOf() >
      //     getDate(d1).valueOf() - x0.valueOf()
      //       ? d1
      //       : d0
      // }
      showTooltip({
        tooltipData: "tool tip data",
        tooltipLeft: x,
        // tooltipTop: yScale(getStockValue(d)),
        tooltipTop: 0,
      })
    },
    [showTooltip, yScale, xScale]
  )

  console.log()

  return width < 10 ? null : (
    <div>
      <svg width={outerWidth} height={outerHeight}>
        {/* <GradientOrangeRed id="stacked-area-orangered" /> */}
        <rect
          x={0}
          y={0}
          width={outerWidth}
          height={outerHeight}
          fill={background}
          rx={4}
        />
        <AreaStack
          keys={keys}
          data={data}
          x={d => xScale(getDate(d.data)) ?? 0}
          y0={d => yScale(getY0(d)) ?? 0}
          y1={d => yScale(getY1(d)) ?? 0}
          color={colorScale}
        >
          {({ stacks, path }) =>
            stacks.map(stack => {
              return (
                <path
                  key={`stack-${stack.key}`}
                  d={path(stack) || ""}
                  stroke={colors[stack.index]}
                  fill={colors[stack.index]}
                  onClick={() => {
                    console.log("clicked", stack.key)
                    if (events) alert(`${stack.key}`)
                  }}
                />
              )
            })
          }
        </AreaStack>
        <Bar
          x={margin.left}
          y={margin.top}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => console.log("hide tooltip")}
        />
        {tooltipData && !isPreview && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: height }}
              stroke={"white"}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill="white"
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
        <AxisBottom
          left={0}
          top={yMax}
          scale={xScale}
          stroke={white}
          tickStroke={white}
          numTicks={6}
          label="Year"
          labelOffset={15}
        />
        <AxisLeft
          left={marginHorizontal}
          top={0}
          height={yMax}
          scale={yScale}
          stroke={white}
          tickStroke={white}
          tickLabelProps={() => ({
            ...tickLabelProps,
            transform: `translate (-10, 5)`,
          })}
          numTicks={5}
        />
        <text
          x={50}
          y={marginHorizontal}
          transform="translate (30, 5)"
          fontSize={20}
        >
          Sea Ice Extent (million square miles)
        </text>
      </svg>
      {tooltipData && !isPreview && (
        <Tooltip
          top={height + margin.top - 14}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            minWidth: 72,
            textAlign: "center",
            transform: "translateX(-50%)",
          }}
        >
          {getDate(data)}
        </Tooltip>
      )}
    </div>
  )
}
