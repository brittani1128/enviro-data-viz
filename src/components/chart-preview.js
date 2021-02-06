import { Link } from "gatsby"
import React from "react"

import { Card } from "@material-ui/core"

import Chart from "./charts/index.js"
import "./charts/styles.css"

const ChartPreview = ({ chart }) => (
  <div style={{ margin: "10px" }}>
    <Link to={chart.slug}>
      <div style={{ borderRadius: "5px" }}>
        <Card>
          <Chart path={chart.slug} isPreview />
        </Card>
      </div>
    </Link>
  </div>
)

export default ChartPreview
