// /**
//  * Implement Gatsby's Node APIs in this file.
//  *
//  * See: https://www.gatsbyjs.com/docs/node-apis/
//  */

const path = require("path")

exports.createPages = async ({ actions, graphql, reporter }) => {
  const result = await graphql(`
    {
      allMdx {
        nodes {
          frontmatter {
            slug
            title
          }
          body
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panic(`Error while running GraphQL query.`, result.errors)
  }

  const charts = result.data.allMdx.nodes

  charts.forEach(({ frontmatter }) => {
    const path = frontmatter.slug
    actions.createPage({
      path,
      component: require.resolve("./src/templates/chart.js"),
      context: {
        slug: path,
        title: frontmatter.title,
      },
    })
  })
}
