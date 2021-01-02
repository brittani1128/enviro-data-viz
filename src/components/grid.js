import React from "react"
import { Card, Grid } from "@material-ui/core"

const ChartGrid = ({ children }) => {
  return (
    <Grid container direction="row">
      {children.map((child, i) => (
        <Grid item key={i}>
          <Card>{child}</Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ChartGrid
