import React from "react"
import { Grid } from "@material-ui/core"

import ChartPreview from "../components/chart-preview"
import useCharts from "../hooks/use-charts"
import "./index.css"

export default () => {
  const charts = useCharts()

  return (
    <div className="app-header">
      <header style={{ marginBottom: "50px", marginTop: "30px" }}>
        Climate Change Indicators
      </header>
      <Grid container justify="center">
        {charts.map(chart => (
          <Grid key={chart.slug} item xs={12} md={6} lg={4}>
            <ChartPreview chart={chart} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
