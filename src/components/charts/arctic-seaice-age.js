import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
import "./styles.css"

const ArcticSeaIceAgeChart = ({ seaIceData: data }) => {
  const d3Container = useRef(null)

  const w = 950
  const h = 600
  const margin = { top: 20, right: 20, bottom: 100, left: 100 }
  const padding = 50
  const graphWidth = w - margin.left - margin.right - 100
  const graphHeight = h - margin.top - margin.bottom

  const keys = ["Y1", "Y2", "Y3", "Y4", "Y5"]

  const colors = ["#023E8A", "#0096C7", "#48CAE4", "#90E0EF", "#CAF0F8"]
  const styles = {
    container: {
      display: "grid",
      justifyItems: "center",
    },
    header: {
      textAlign: "center",
    },
  }

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("width", w)
        .attr("height", h)

      const graph = svg
        .append("g")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .attr("class", "graph-area")
        .attr("transform", `translate(${margin.left + padding}, ${margin.top})`)

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
        .range([graphHeight, 0])
      const xScale = d3
        .scaleLinear()
        .domain([+data[0].year, +data[data.length - 1].year])
        .range([0, graphWidth])

      const colorScale = d3.scaleOrdinal().domain(keys).range(colors)

      const makeYLines = () => d3.axisLeft().scale(yScale)
      graph
        .append("g")
        .attr("class", "grid")
        .call(makeYLines().ticks(6).tickSize(-graphWidth, 0, 0).tickFormat(""))

      // AXES ------------------------

      const gYAxis = graph.append("g")
      const gXAxis = graph
        .append("g")
        .attr("transform", `translate(0, ${graphHeight})`)

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
      //   .attr("x", graphWidth - 18)
      //   .attr("width", 18)
      //   .attr("height", 18)
      //   .style("fill", (d, i) => colors.slice().reverse()[i])

      // legendOption
      //   .append("text")
      //   .attr("x", graphWidth + 5)
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
        .attr("x", w / 2 + padding)
        .attr("y", h - margin.top)
        .style("text-anchor", "middle")
        .text("year")

      svg
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.right)
        .attr("x", 0 - h / 2 + padding)
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
    <div ref={d3Container} style={styles.container} className="container">
      <h2 style={styles.header} className="chart-title">
        Arctic Sea Ice Age
      </h2>
    </div>
  )
}

export default ArcticSeaIceAgeChart
