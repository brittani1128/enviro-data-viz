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
  const newData = data.allArcticSeaiceAgeCsv.nodes.map(node => {
    return {
      year: node.Year,
      Y1: (node._1YI / 1000000).toFixed(2),
      Y2: (node._2YI / 1000000).toFixed(2),
      Y3: (node._3YI / 1000000).toFixed(2),
      Y4: (node._4YI / 1000000).toFixed(2),
      Y5: (node._5_YI / 1000000).toFixed(2),
    }
  })
  return newData
}

export default useArcticSeaIceAge
