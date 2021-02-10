import React from "react"
import CO2BarChart from "./co2-bar-chart"
import GasEmissionsStackedChart from "./gas-emissions-stacked-chart"
import ArcticSeaIceAgeChart from "./arctic-seaice-age"
import useCo2Emissions from "../../hooks/use-co2-emissions"
import useGasEmissions from "../../hooks/use-gas-emissions"
import GhgEmissionsBarStack from "./barstack-ghg-emissions"
import ArcticSeaiceAreaStack from "./areastack-arctic-seaice"

const Chart = ({ path, isPreview }) => {
  const co2emissions = useCo2Emissions()
  const gasEmissions = useGasEmissions()

  switch (path) {
    case "co2-emissions":
      return <CO2BarChart emissionData={co2emissions} isPreview={isPreview} />
    case "greenhouse-gas-emissions":
      return (
        <GasEmissionsStackedChart
          emissionData={gasEmissions}
          isPreview={isPreview}
        />
      )
    case "arctic-seaice-age":
      return <ArcticSeaiceAreaStack isPreview={isPreview} />
    case "ghg-emissions":
      return <GhgEmissionsBarStack isPreview={isPreview} />
    default:
      return <div>oops no chart</div>
  }
}

export default Chart
