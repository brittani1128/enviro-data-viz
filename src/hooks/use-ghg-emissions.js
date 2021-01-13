import { graphql, useStaticQuery } from "gatsby"

export const useGhgEmissions = () => {
  const data = useStaticQuery(graphql`
    {
      allGhgEmissionsCsv {
        nodes {
          Agriculture
          Energy
          Industrial_Processes
          Land_Use_Change_and_Forestry
          Waste
          Year
        }
      }
    }
  `)

  return data.allGhgEmissionsCsv.nodes.filter(n => !(+n.Year % 2))
}

export default useGhgEmissions
