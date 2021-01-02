import { graphql, useStaticQuery } from "gatsby"

export const useGasEmissions = () => {
  const data = useStaticQuery(graphql`
    {
      allGreenhouseGasEmissionsCsv {
        nodes {
          Carbon_dioxide
          HFCs_PFCs_and_SF6
          Methane
          Nitrous_oxide
          Year
        }
      }
    }
  `)
  console.log(data.allGreenhouseGasEmissionsCsv.nodes)
  return data.allGreenhouseGasEmissionsCsv.nodes
}

export default useGasEmissions
