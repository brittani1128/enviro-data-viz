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
      Y1: Math.floor(node._1YI),
      Y2: Math.floor(node._2YI),
      Y3: Math.floor(node._3YI),
      Y4: Math.floor(node._4YI),
      Y5: Math.floor(node._5_YI),
    }
  })
  return newData
}

export default useArcticSeaIceAge
