import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
import "./styles.css"
import { chartHeaderStyles } from "./constants"

const GasEmissionsStackedChart = ({ emissionData: data }) => {
  const d3Container = useRef(null)
  const w = 950
  const h = 600
  const margin = { top: 20, right: 20, bottom: 100, left: 100 }
  const padding = 50
  const graphWidth = w - margin.left - margin.right - 200
  const graphHeight = h - margin.top - margin.bottom

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("viewBox", `0 0 ${w} ${h}`)

      const graph = svg
        .append("g")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .attr("class", "graph-area")
        .attr("transform", `translate(${margin.left + padding}, ${margin.top})`)

      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("fill", "white")
        .attr("width", 150)
        .attr("height", 100)
        .attr("transform", `translate(150, 100)`)

      const [carbonDioxide, methane, nitrousOxide, other] = [
        "Carbon_dioxide",
        "Methane",
        "Nitrous_oxide",
        "HFCs_PFCs_and_SF6",
      ]

      const stack = d3
        .stack()
        .keys([carbonDioxide, methane, nitrousOxide, other])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)
      const stackedSeries = stack(data)

      // SCALES ----------------------

      const yScale = d3.scaleLinear().domain([0, 50000]).range([graphHeight, 0])
      const xScale = d3
        .scaleTime()
        .domain([+data[0].Year, +data[data.length - 1].Year])
        .range([50, 525])

      const colors = ["#23999d", "#00bfc6", "#8bd7da", "#c2e8eb"]
      const colorScale = d3
        .scaleOrdinal()
        .domain([carbonDioxide, methane, nitrousOxide, other])
        .range(colors)

      const makeYLines = () => d3.axisLeft().scale(yScale)
      graph
        .append("g")
        .attr("class", "grid")
        .call(
          makeYLines()
            .tickSize(-(graphWidth - 40), 0, 0)
            .tickFormat("")
        )

      // AXES ------------------------

      const gYAxis = graph.append("g")
      const gXAxis = graph
        .append("g")
        .attr("transform", `translate(0, ${graphHeight})`)

      const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d3.format("d"))
      const yAxis = d3.axisLeft(yScale).ticks(5)

      gXAxis.call(xAxis)
      gYAxis.call(yAxis)

      gXAxis
        .selectAll("text")
        .attr("transform", "translate(0,5)")
        .style("font-size", 14)
      gYAxis.selectAll("text").style("font-size", 14)

      // BARS ------------------------

      const bars = graph
        .select("g")
        .selectAll("g.series")
        .data(stackedSeries)
        .join("g")
        .attr("class", "series")
        .style("fill", d => colorScale(d.key))

      bars
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("width", 80)
        .attr("y", d => yScale(d[1]))
        .attr("x", d => xScale(d.data.Year) - 35)
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .on("mouseover", () => tooltip.style("display", null))
        .on("mouseout", () => tooltip.style("display", "none"))
        .on("mousemove", (event, d) => {
          const xPosition = d3.pointer(event)[0] + 130
          const yPosition = d3.pointer(event)[1] - 10
          tooltip.attr(
            "transform",
            "translate(" + xPosition + "," + yPosition + ")"
          )
          tooltip.select("text").text(Math.floor(d[1] - d[0]))
        })

      // LEGEND ---------------------------

      const legendOption = legend
        .selectAll(".legend-option")
        .data(colors)
        .enter()
        .append("g")
        .attr("class", "legend-option")
        .attr("transform", (d, i) => "translate(30," + i * 19 + ")")

      legendOption
        .append("rect")
        .attr("x", graphWidth - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => colors.slice().reverse()[i])

      legendOption
        .append("text")
        .attr("x", graphWidth + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text((d, i) => {
          switch (i) {
            case 0:
              return other.replaceAll("_", " ")
            case 1:
              return nitrousOxide.replace("_", " ")
            case 2:
              return methane.replace("_", " ")
            case 3:
              return carbonDioxide.replace("_", " ")
          }
        })

      // AXIS LABELS ------------------------
      svg
        .append("text")
        .attr("class", "axis-label")
        .attr("x", w / 2 + padding)
        .attr("y", h - margin.top)
        .style("text-anchor", "middle")
        .text("Year")

      svg
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.right)
        .attr("x", 0 - h / 2 + padding)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Emissions (million metric tons)")

      // TOOLTIP ------------------------

      const tooltip = svg
        .append("g")
        .attr("class", "tooltip")
        .style("display", "none")

      tooltip
        .append("rect")
        .attr("width", 55)
        .attr("height", 25)
        .attr("fill", "white")
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
        Global Greenhouse Gas Emissions by Gas
      </h2>
    </div>
  )
}

export default GasEmissionsStackedChart
