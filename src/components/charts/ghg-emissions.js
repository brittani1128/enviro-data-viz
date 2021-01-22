import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
import "./styles.css"

const GhgEmissionsStackedChart = ({ emissionData: data }) => {
  const d3Container = useRef(null)
  const w = 950
  const h = 600
  const margin = { top: 20, right: 20, bottom: 100, left: 100 }
  const padding = 50
  const graphWidth = w - margin.left - margin.right
  const graphHeight = h - margin.top - margin.bottom
  const styles = {
    container: {
      display: "grid",
      justifyItems: "center",
      fontFamily: "Yanone Kaffeesatz, sans-serif",
      fontSize: "18px",
    },
    header: {
      textAlign: "center",
      color: "white",
      fontFamily: "Yanone Kaffeesatz, sans-serif",
    },
  }

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("viewBox", `0 0 ${w} ${h}`)

      const graph = svg
        .append("g")
        .attr("viewBox", `0 0 ${graphWidth} ${graphHeight}`)
        .attr("class", "graph-area")
        .attr("transform", `translate(${margin.left + 20}, ${margin.top})`)

      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("width", 100)
        .attr("height", 100)
        .attr("transform", `translate(-570, 45)`)

      const [energy, agriculture, landUse, industrial, waste] = [
        "Energy",
        "Agriculture",
        "Land_Use_Change_and_Forestry",
        "Industrial_Processes",
        "Waste",
      ]
      const keys = [energy, agriculture, landUse, industrial, waste]

      const stack = d3.stack().keys(keys)
      const stackedValues = stack(data)

      // SCALES ----------------------

      const yScale = d3.scaleLinear().domain([0, 60]).range([graphHeight, 0])
      const xScale = d3.scaleTime().domain([1990, 2016]).range([50, 740])

      const colors = ["#4BD7E7", "#A3EBB1", "#278AB0", "#1DC690", "#EAEAE0"]
      const colorScale = d3.scaleOrdinal().domain(keys).range(colors)

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

      const xAxis = d3.axisBottom(xScale).ticks(15).tickFormat(d3.format("d"))
      const yAxis = d3.axisLeft(yScale).ticks(5)

      gXAxis.call(xAxis)
      gYAxis.call(yAxis)

      gXAxis
        .selectAll("text")
        .attr("transform", "translate(0,5)")
        .style("font-size", 14)
      gYAxis.selectAll("text").style("font-size", 14)

      // BARS ------------------------

      graph
        .append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedValues)
        .enter()
        .append("g")
        .attr("fill", d => colorScale(d.key))
        .selectAll("rect")
        .attr("transform", "translate(20,0)")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.data.Year) - 15)
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", 40)
        .on("mouseover", () => tooltip.style("display", null))
        .on("mouseout", () => tooltip.style("display", "none"))
        .on("mousemove", (event, d) => {
          const xPosition = d3.pointer(event)[0] + 130
          const yPosition = d3.pointer(event)[1] - 10
          tooltip.attr(
            "transform",
            "translate(" + xPosition + "," + yPosition + ")"
          )
          tooltip.select("text").text(`${(d[1] - d[0]).toFixed(2)}Gt`)
        })

      // LEGEND ---------------------------

      const legendOption = legend
        .selectAll(".legend-option")
        .data(colors)
        .enter()
        .append("g")
        .attr("class", "legend-option")
        .attr("transform", (d, i) => "translate(-40," + i * 19 + ")")

      legendOption
        .append("rect")
        .attr("x", graphWidth - 18)
        .attr("width", 30)
        .attr("height", 10)
        .style("fill", (d, i) => colors.slice().reverse()[i])

      legendOption
        .append("text")
        .attr("x", graphWidth + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("font-size", 12)
        .attr("transform", (d, i) => "translate(15,-5)")
        .text((d, i) => {
          switch (i) {
            case 0:
              return waste
            case 1:
              return industrial.replaceAll("_", " ")
            case 2:
              return landUse.replaceAll("_", " ")
            case 3:
              return agriculture
            case 4:
              return energy
          }
        })

      // AXIS LABELS ------------------------
      svg
        .append("text")
        .attr("class", "axis-label")
        .attr("x", w / 2)
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
        .text("Emissions")
      svg
        .append("text")
        .attr("class", "axis-sublabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 50)
        .attr("x", 0 - h / 2 + padding)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("(gigatonnes of equivalent carbon dioxide)")

      // TOOLTIP ------------------------

      const tooltip = svg
        .append("g")
        .attr("class", "tooltip")
        .style("display", "none")

      tooltip
        .append("rect")
        .attr("width", 70)
        .attr("height", 25)
        .attr("fill", "white")
        .style("opacity", 0.4)

      tooltip
        .append("text")
        .attr("x", 35)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
    }
  })

  return (
    <div ref={d3Container} style={styles.container} className="container">
      <h2 style={styles.header} className="chart-title">
        Global Greenhouse Gas Emissions by Sector
      </h2>
    </div>
  )
}

export default GhgEmissionsStackedChart
