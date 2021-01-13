import { graphql, useStaticQuery } from "gatsby"

const useCharts = () => {
  const data = useStaticQuery(graphql`
    query {
      allMdx {
        nodes {
          excerpt
          frontmatter {
            title
            slug
            image {
              sharp: childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
  `)

  return data.allMdx.nodes.map(({ frontmatter, excerpt }) => ({
    title: frontmatter.title,
    slug: frontmatter.slug,
    image: frontmatter.image,
    excerpt,
  }))
}

export default useCharts
