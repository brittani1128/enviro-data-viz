import React from "react"
import { Card } from "@material-ui/core"

import { Link } from "gatsby"
import Image from "gatsby-image"

const ChartPreview = ({ chart }) => {
  return (
    <article style={{ width: "500px", margin: "20px" }}>
      <Link to={chart.slug}>
        <Card variant="outlined">
          <Image fluid={chart.image.sharp.fluid} alt={chart.title} />
        </Card>
      </Link>
    </article>
  )
}

export default ChartPreview
