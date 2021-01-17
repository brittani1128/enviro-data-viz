import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Chart from "../components/charts/index.js"

export const query = graphql`
  query($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      frontmatter {
        title
        slug
      }
      body
    }
  }
`

const ChartTemplate = ({ data: { mdx: chart } }) => {
  const { body, frontmatter } = chart
  return (
    <div style={{ maxWidth: "1000px", margin: "auto", marginTop: "30px" }}>
      <Chart path={frontmatter.slug} />
      <div style={{ marginTop: "30px" }}>
        <h3>Background</h3>
        <MDXRenderer>{body}</MDXRenderer>
      </div>
    </div>
  )
}

export default ChartTemplate
