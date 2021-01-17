import React from "react"
import { Card } from "@material-ui/core"

import { Link } from "gatsby"
import Image from "gatsby-image"

const ChartPreview = ({ chart }) => {
  return (
    <article style={{ margin: "10px" }}>
      <Link to={chart.slug}>
        <div style={{ borderRadius: "5px" }}>
          <Card>
            <Image fluid={chart.image.sharp.fluid} alt={chart.title} />
          </Card>
        </div>
      </Link>
    </article>
  )
}

export default ChartPreview
