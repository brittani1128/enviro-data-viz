import React from "react"
import { AreaStack } from "@visx/shape"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { scaleTime, scaleLinear, scaleOrdinal, scaleBand } from "@visx/scale"
import useArcticSeaIceAge from "../../hooks/use-arctic-seaice-age"
// import { GradientOrangeRed } from "@visx/gradient"
import { color } from "./constants"
import { extent } from "d3"

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

  return width < 10 ? null : (
    <svg width={outerWidth} height={outerHeight}>
      {/* <GradientOrangeRed id="stacked-area-orangered" /> */}
      <rect
        x={0}
        y={0}
        width={outerWidth}
        height={outerHeight}
        fill={background}
        rx={14}
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
  )
}
