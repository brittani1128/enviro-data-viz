import React from "react"
import { Card, Grid } from "@material-ui/core"
import { Link } from "gatsby"

const ChartGrid = ({ children }) => {
  return (
    <Grid container direction="row">
      {children.map((child, i) => {
        return (
          <Grid item key={i}>
            <Link to={child.props.path} style={{ textDecoration: "none" }}>
              <Card variant="outlined">{child}</Card>
            </Link>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default ChartGrid
