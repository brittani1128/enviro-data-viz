import React, { useRef, useEffect } from "react"
import * as d3 from "d3"
import "./styles.css"

export const CO2BarChart = ({ emissionData }) => {
  const d3Container = useRef(null)
  const w = 900
  const h = 600
  const margin = { top: 20, right: 20, bottom: 100, left: 100 }
  const padding = 50
  const graphWidth = w - margin.left - margin.right
  const graphHeight = h - margin.top - margin.bottom
  const data = emissionData["United States"]

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

      // SCALES ----------------------

      const yScale = d3
        .scaleLinear()
        .domain([0, 6000000]) // calculate domain
        .range([graphHeight, 0])
      const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.date))
        .range([0, graphWidth - 50])
        .paddingInner(0.2)
        .paddingOuter(0.2)

      const makeYLines = () => d3.axisLeft().scale(yScale)

      graph
        .append("g")
        .attr("class", "grid")
        .call(makeYLines().tickSize(-w, 0, 0).tickFormat(""))

      // BARS ------------------------

      const rects = graph.selectAll("rect").data(data)
      rects
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(d.date))
        .attr("y", (d, i) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => graphHeight - yScale(d.value))
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
        .attr("transform", `translate(0, ${graphHeight})`)
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
        .text("CO2 Emissions (kt)")
    }
  })

  const styles = {
    container: {
      display: "grid",
      justifyItems: "center",
      margin: "20px",
    },
  }

  return (
    <div style={styles.container} ref={d3Container} className="container">
      <h1
        style={{ textAlign: "center" }}
        className="chart-title"
      >{`CO2 Emissions for US`}</h1>
    </div>
  )
}
