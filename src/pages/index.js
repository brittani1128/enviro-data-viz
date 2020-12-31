import React from "react"
import { CO2BarChart } from "../components/co2-bar-chart"
import useCo2Emissions from "../hooks/use-co2-emissions"
import "./index.css"

export default () => {
  const co2emissions = useCo2Emissions()

  return (
    <div className="app-header">
      <div>Visualizations</div>
      <CO2BarChart emissionData={co2emissions} />
    </div>
  )
}
