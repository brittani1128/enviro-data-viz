import * as d3 from "d3"
import React, { useEffect, useRef } from "react"

import { constants, chartHeaderStyles, color } from "./constants"
import "./styles.css"

const ArcticSeaIceAgeChart = ({ seaIceData: data }) => {
  const d3Container = useRef(null)
  const {
    SVG_WIDTH,
    SVG_HEIGHT,
    MARGIN,
    PADDING,
    GRAPH_WIDTH,
    GRAPH_HEIGHT,
  } = constants
  const GRAPH_WIDTH_SMALL = GRAPH_WIDTH - 100
  const keys = ["Y1", "Y2", "Y3", "Y4", "Y5"]

  const colors = ["#023E8A", "#0096C7", "#48CAE4", "#90E0EF", "#CAF0F8"]

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("viewBox", `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`)

      const graph = svg
        .append("g")
        .attr("width", GRAPH_WIDTH_SMALL)
        .attr("height", GRAPH_HEIGHT)
        .attr("class", "graph-area")
        .attr("transform", `translate(${MARGIN.left + PADDING}, ${MARGIN.top})`)

      // const legend = svg
      //   .append("g")
      //   .attr("class", "legend")
      //   .attr("fill", "white")
      //   .attr("width", 150)
      //   .attr("height", 100)
      //   .attr("transform", `translate(150, 100)`)

      const stack = d3.stack().keys(keys)
      const stackedValues = stack(data)

      // SCALES ----------------------

      const yScale = d3
        .scaleLinear()
        .domain([0, 3000000])
        .range([GRAPH_HEIGHT, 0])
      const xScale = d3
        .scaleLinear()
        .domain([+data[0].year, +data[data.length - 1].year])
        .range([0, GRAPH_WIDTH_SMALL])

      const colorScale = d3.scaleOrdinal().domain(keys).range(colors)

      const makeYLines = () => d3.axisLeft().scale(yScale)
      graph
        .append("g")
        .attr("class", "grid")
        .call(
          makeYLines()
            .ticks(6)
            .tickSize(-GRAPH_WIDTH_SMALL, 0, 0)
            .tickFormat("")
        )

      // AXES ------------------------

      const gYAxis = graph.append("g")
      const gXAxis = graph
        .append("g")
        .attr("transform", `translate(0, ${GRAPH_HEIGHT})`)

      const xAxis = d3.axisBottom(xScale).ticks(7).tickFormat(d3.format("d"))
      const yAxis = d3.axisLeft(yScale).ticks(6)

      gXAxis.call(xAxis)
      gYAxis.call(yAxis)

      gXAxis
        .selectAll("text")
        .attr("transform", "translate(0,5)")
        .style("font-size", 14)
      gYAxis.selectAll("text").style("font-size", 14)

      // LINES ------------------------

      const stackedData = []
      stackedValues.forEach((layer, index) => {
        const currentStack = []
        layer.forEach((d, i) => {
          currentStack.push({
            values: d,
            year: data[i].year,
          })
        })
        stackedData.push(currentStack)
      })

      const area = d3
        .area()
        .x(d => xScale(d.year))
        .y0(d => yScale(d.values[0]))
        .y1(d => yScale(d.values[1]))

      const series = graph
        .selectAll(".series")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "series")

      series
        .append("path")
        .attr("d", d => area(d))
        .style("fill", (d, i) => colors[i])
        .style("opacity", "80%")
        .style("stroke", "#03045E")

      // LEGEND ---------------------------

      // const legendOption = legend
      //   .selectAll(".legend-option")
      //   .data(colors)
      //   .enter()
      //   .append("g")
      //   .attr("class", "legend-option")
      //   .attr("transform", (d, i) => "translate(30," + i * 19 + ")")

      // legendOption
      //   .append("rect")
      //   .attr("x", GRAPH_WIDTH - 18)
      //   .attr("width", 18)
      //   .attr("height", 18)
      //   .style("fill", (d, i) => colors.slice().reverse()[i])

      // legendOption
      //   .append("text")
      //   .attr("x", GRAPH_WIDTH + 5)
      //   .attr("y", 9)
      //   .attr("dy", ".35em")
      //   .style("text-anchor", "start")
      // .text((d, i) => {
      //   switch (i) {
      //     case 0:
      //       return other.replaceAll("_", " ")
      //     case 1:
      //       return nitrousOxide.replace("_", " ")
      //     case 2:
      //       return methane.replace("_", " ")
      //     case 3:
      //       return carbonDioxide.replace("_", " ")
      //   }
      // })

      // AXIS LABELS ------------------------
      svg
        .append("text")
        .attr("class", "axis-label")
        .attr("x", SVG_WIDTH / 2)
        .attr("y", SVG_HEIGHT - MARGIN.top)
        .style("text-anchor", "middle")
        .text("Year")

      svg
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", MARGIN.right)
        .attr("x", 0 - SVG_HEIGHT / 2 + PADDING)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Sea Ice Extent (million square)")

      // TOOLTIP ------------------------

      const tooltip = svg
        .append("g")
        .attr("class", "tooltip")
        .style("display", "none")

      tooltip
        .append("rect")
        .attr("width", 55)
        .attr("height", 25)
        .attr("fill", color.white)
        .style("opacity", 0.3)

      tooltip
        .append("text")
        .attr("x", 28)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
    }
  })

  return (
    <div ref={d3Container} className="container">
      <h2 style={chartHeaderStyles} className="chart-title">
        Arctic Sea Ice Age
      </h2>
    </div>
  )
}

export default ArcticSeaIceAgeChart
