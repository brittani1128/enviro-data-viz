import React from "react"
import { AreaStack } from "@visx/shape"
import { scaleTime, scaleLinear, scaleOrdinal } from "@visx/scale"
import useArcticSeaIceAge from "../../hooks/use-arctic-seaice-age"
// import { GradientOrangeRed } from "@visx/gradient"
import { color } from "./constants"

const getDate = d => d.year
const { purple, seafoam, blue, green, palegreen, white } = color
const colors = [purple, seafoam, blue, green, palegreen]

export default function ArcticSeaiceAreaStack({
  width: outerWidth = 1000,
  height: outerHeight = 600,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
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
  const xScale = scaleTime({
    range: [0, xMax],
    domain: [Math.min(...data.map(getDate)), Math.max(...data.map(getDate))],
  })

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, 3],
  })

  const colorScale = scaleOrdinal({
    domain: keys,
    range: [green, purple, seafoam, blue, palegreen],
  })

  return width < 10 ? null : (
    <svg width={width} height={height}>
      {/* <GradientOrangeRed id="stacked-area-orangered" /> */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={background}
        rx={14}
      />
      <AreaStack
        top={margin.top}
        left={margin.left}
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
                  if (events) alert(`${stack.key}`)
                }}
              />
            )
          })
        }
      </AreaStack>
    </svg>
  )
}
