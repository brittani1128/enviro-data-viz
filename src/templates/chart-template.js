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
    <>
      <h1 style={{ color: "black" }}>{frontmatter.title}</h1>
      <Chart path={frontmatter.slug} />
      <MDXRenderer>{body}</MDXRenderer>
    </>
  )
}

export default ChartTemplate
