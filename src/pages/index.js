import React from "react"
import { Grid } from "@material-ui/core"

import ChartPreview from "../components/chart-preview"
import useCharts from "../hooks/use-charts"
import "./index.css"

export default () => {
  const charts = useCharts()

  return (
    <div className="app-header">
      <header>Climate Change Indicators</header>
      <Grid container direction="row">
        {charts.map(chart => (
          <Grid item key={chart.slug}>
            <ChartPreview chart={chart} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
