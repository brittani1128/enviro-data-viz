import { Link } from "gatsby"
import React from "react"
import "./styles.css"

const Back = () => (
  <div
    className="back-btn"
    style={{
      marginBottom: "20px",
      padding: "8px",
      width: "80px",
      borderRadius: "5px",
    }}
  >
    <Link
      to="/"
      style={{
        color: `white`,
        textDecoration: `none`,
      }}
    >
      {"<-- Back"}
    </Link>
  </div>
)

export default Back
