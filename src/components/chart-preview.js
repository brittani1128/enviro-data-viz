import { Link } from "gatsby"
import React from "react"

import ParentSize from "@visx/responsive/lib/components/ParentSize"
import { Card } from "@material-ui/core"

import Chart from "./charts/index.js"
import "./charts/styles.css"

const ChartPreview = ({ chart }) => (
  <div style={{ margin: "10px" }}>
    <Card>
      <Link to={chart.slug}>
        <div style={{ height: "400px", background: "rgb(10, 66, 72)" }}>
          <ParentSize debounceTime={10}>
            {({ width, height }) => (
              <Chart
                path={chart.slug}
                isPreview
                width={width}
                height={height}
              />
            )}
          </ParentSize>
        </div>
      </Link>
    </Card>
  </div>
)

export default ChartPreview
