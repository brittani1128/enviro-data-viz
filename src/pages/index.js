import React from "react"
import CO2BarChart from "../components/charts/co2-bar-chart"
import GasEmissionsStackedChart from "../components/charts/gas-emissions-stacked-chart"
import ChartGrid from "../components/chart-grid"

import useCo2Emissions from "../hooks/use-co2-emissions"
import useGasEmissions from "../hooks/gas-emissions"
import "./index.css"

export default () => {
  const co2emissions = useCo2Emissions()
  const gasEmissions = useGasEmissions()

  return (
    <div className="app-header">
      <header>Visualizations</header>
      <ChartGrid>
        <CO2BarChart emissionData={co2emissions} path="co2-emissions" />
        <GasEmissionsStackedChart
          emissionData={gasEmissions}
          path="greenhouse-gas-emissions"
        />
      </ChartGrid>
    </div>
  )
}
