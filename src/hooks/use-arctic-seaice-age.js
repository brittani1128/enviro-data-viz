import { graphql, useStaticQuery } from "gatsby"

export const useArcticSeaIceAge = () => {
  const data = useStaticQuery(graphql`
    {
      allArcticSeaiceAgeCsv {
        nodes {
          Year
          _1YI
          _2YI
          _3YI
          _4YI
          _5_YI
        }
      }
    }
  `)
  return data.allArcticSeaiceAgeCsv.nodes
}

export default useArcticSeaIceAge
