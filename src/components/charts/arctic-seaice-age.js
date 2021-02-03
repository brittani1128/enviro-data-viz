import * as d3 from "d3"
import React, { useEffect, useRef } from "react"

import { constants, chartHeaderStyles, color } from "./constants"
import "./styles.css"

const ArcticSeaIceAgeChart = ({ seaIceData: data, isPreview }) => {
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
  const keys = ["Y1", "Y2", "Y3", "Y4", "Y5"].reverse()

  const colors = [
    color.purple,
    color.blue,
    color.seafoam,
    color.green,
    color.palegreen,
  ]

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

      // const colorScale = d3.scaleOrdinal().domain(keys).range(colors)

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
        .text("Sea Ice Coverage (square miles)")

      // TOOLTIP LEGEND ------------------------

      if (!isPreview) {
        const tooltip = d3.select("#seaice-tooltip")
        const tooltipLine = graph.append("line")
        let tipBox

        const removeTooltip = () => {
          if (tooltip) tooltip.style("display", "none")
          if (tooltipLine) tooltipLine.attr("stroke", "none").attr("opacity", 0)
        }

        const drawTooltip = e => {
          const year = Math.round(
            xScale.invert(d3.pointer(e, tipBox.node())[0])
          )

          const dataForYear = stackedData
            .map(d => d.filter(d => d.year == year).map(d => d.values[1]))
            .flat()

          tooltipLine
            .attr("stroke", "black")
            .attr("opacity", 1)
            .attr("class", "tooltipLine")
            .attr("x1", xScale(year))
            .attr("x2", xScale(year))
            .attr("y1", 0)
            .attr("y2", SVG_HEIGHT - 120)

          // .style("color", d => d.color)

          // .selectAll()
          // .data(dataForYear)
          // .enter()
          // .append("div")
          // .html(d => `${d}`)
          const xPosition = year > 2000 ? xScale(year) - 40 : xScale(year) + 190
          tooltip
            .style("display", "block")
            .style("left", `${xPosition}px`)
            .style("top", `${e.offsetY + 60}px`).html(`
              <div style=padding:10px>
                <div style="display:flex; justify-content:space-between; padding-bottom:10px;">
                  <span>${year}</span>
                  <span>mi^2</span>
                </div>
                ${toolTipText(dataForYear)}
                <div style="display:flex; justify-content:space-between; margin-top:10px">
                  <span>Total</span>
                  <span style="margin-left: 10px">${calculateTotal(
                    dataForYear
                  )}</span>
                </div>
              </div>
          `)
        }
        const calculateTotal = data => {
          let total = 0
          data.forEach(d => (total += d))
          return total
        }

        const toolTipText = data => {
          return `
              <div style="font-size:12px">
                <div style="display:flex; justify-content:space-between">
                  <div>First-year ice</div>
                  <span>${data[0]}</span>
                </div>
                <div style="display:flex; justify-content:space-between">
                  <span>Second-year ice</span>
                  <span style="margin-left: 10px">${data[1]}</span>
                </div>
                <div style="display:flex; justify-content:space-between">
                  <span>Third-year ice</span>
                  <span style="margin-left: 10px">${data[2]}</span>
                </div>
                <div style="display:flex; justify-content:space-between">
                  <span>Fourth-year ice</span>
                  <span style="margin-left: 10px">${data[3]}</span>
                </div>
                <div style="display:flex; justify-content:space-between">
                  <span>Five+ year ice</span>
                  <span style="margin-left: 10px">${data[4]}</span>
                </div>
              </div>
          `
        }

        tipBox = graph
          .append("rect")
          .attr("class", "tipBox")
          .attr("width", GRAPH_WIDTH_SMALL)
          .attr("height", GRAPH_HEIGHT)
          .attr("opacity", 0)
          .on("mousemove", e => drawTooltip(e))
          .on("mouseout", removeTooltip)
      }
    }
  })

  return (
    <div ref={d3Container} className="container">
      <div id="seaice-tooltip"></div>
      <h2 style={chartHeaderStyles} className="chart-title">
        Change in Arctic Sea Ice Area by Age
      </h2>
    </div>
  )
}

export default ArcticSeaIceAgeChart
