import { graphql, useStaticQuery } from "gatsby"

export const useCo2Emissions = () => {
  const data = useStaticQuery(graphql`
    {
      allCo2EmissionsCsv {
        nodes {
          _1960
          _1962
          _1964
          _1966
          _1968
          _1970
          _1972
          _1974
          _1976
          _1978
          _1980
          _1982
          _1984
          _1986
          _1988
          _1990
          _1992
          _1994
          _1996
          _1998
          _2000
          _2002
          _2004
          _2006
          _2008
          _2010
          _2012
          _2014
          _2016
          _2018
          _2020
          Country_Name
        }
      }
    }
  `)

  const emissionData = {}
  data.allCo2EmissionsCsv.nodes.forEach(({ Country_Name, ...d }) => {
    const data = []
    Object.entries(d).forEach(entry => {
      const [key, value] = entry
      if (value) {
        data.push({
          date: key.split("_")[1],
          value: Math.floor(value),
        })
      }
    })
    emissionData[Country_Name] = data
  })

  return emissionData
}

export default useCo2Emissions
