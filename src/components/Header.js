import { PropaneSharp } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Header = (props) => {

  const togglePanel = (e) => {
    e.preventDefault();
    props.addPanel ?
      props.setAddPanel(false) :
      props.setAddPanel(true);
  }

  return (
    <div className="Header">
       <Link to={{
          pathname: '/',
          }}><div className="Logo">Kuai-Li Family Recipes</div>
        </Link>
      <div className="Btn"><button type = "button" id ="Add-Btn" onClick = {togglePanel}>Add Recipe</button></div>
    </div>
  )
}

export default Header;