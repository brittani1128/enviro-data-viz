import React from "react"
import CO2BarChart from "./co2-bar-chart"
import GasEmissionsStackedChart from "./gas-emissions-stacked-chart"
import useCo2Emissions from "../../hooks/use-co2-emissions"
import useGasEmissions from "../../hooks/use-gas-emissions"

const Chart = ({ path }) => {
  const co2emissions = useCo2Emissions()
  const gasEmissions = useGasEmissions()

  switch (path) {
    case "co2-emissions":
      return <CO2BarChart emissionData={co2emissions} />
    case "greenhouse-gas-emissions":
      return <GasEmissionsStackedChart emissionData={gasEmissions} />
    default:
      return <div>oops no chart</div>
  }
}

export default Chart
