import * as d3 from "d3"
import React, { useRef, useEffect } from "react"

import { constants, chartHeaderStyles } from "./constants"
import "./styles.css"

const CO2BarChart = ({ emissionData }) => {
  const d3Container = useRef(null)
  const {
    SVG_WIDTH,
    SVG_HEIGHT,
    MARGIN,
    PADDING,
    GRAPH_WIDTH,
    GRAPH_HEIGHT,
  } = constants

  const data = emissionData["United States"]

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("viewBox", `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`)

      const graph = svg
        .append("g")
        .attr("width", GRAPH_WIDTH)
        .attr("height", GRAPH_HEIGHT)
        .attr("class", "graph-area")
        .attr("transform", `translate(${MARGIN.left + PADDING}, ${MARGIN.top})`)

      // SCALES ----------------------

      const yScale = d3
        .scaleLinear()
        .domain([0, 6000000]) // calculate domain
        .range([GRAPH_HEIGHT, 0])
      const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.date))
        .range([0, GRAPH_WIDTH - 50])
        .paddingInner(0.2)
        .paddingOuter(0.2)

      const makeYLines = () => d3.axisLeft().scale(yScale)

      graph
        .append("g")
        .attr("class", "grid")
        .call(
          makeYLines()
            .tickSize(-GRAPH_WIDTH - 100, 0, 0)
            .tickFormat("")
        )

      // BARS ------------------------

      const rects = graph.selectAll("rect").data(data)
      rects
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(d.date))
        .attr("y", (d, i) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => GRAPH_HEIGHT - yScale(d.value))
        .attr("fill", "navy")
        .on("mouseenter", function (actual, i) {
          d3.selectAll(".value").attr("opacity", 0)

          d3.select(this).transition().duration(200).attr("opacity", 0.6)
        })
        .on("mouseleave", function () {
          d3.selectAll(".value").attr("opacity", 1)

          d3.select(this).transition().duration(300).attr("opacity", 1)
        })
        .append("title")
        .text(d => d.value)

      // AXES ------------------------

      const gXAxis = graph
        .append("g")
        .attr("transform", `translate(0, ${GRAPH_HEIGHT})`)
      const gYAxis = graph.append("g")

      const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale).ticks(15)

      gXAxis.call(xAxis)
      gYAxis.call(yAxis)
      gXAxis
        .selectAll("text")
        .attr("transform", "translate(17,15)rotate(60)")
        .style("font-size", 14)
      gYAxis.selectAll("text").style("font-size", 14)

      svg
        .append("text")
        .attr("class", "axis-label")
        .attr("x", SVG_WIDTH / 2 + PADDING)
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
        .text("CO2 Emissions (kt)")
    }
  })

  return (
    <div ref={d3Container} className="container">
      <h2
        style={chartHeaderStyles}
        className="chart-title"
      >{`US Historical CO2 Emissions`}</h2>
    </div>
  )
}

export default CO2BarChart
