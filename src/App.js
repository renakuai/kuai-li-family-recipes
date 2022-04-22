import './App.css';
import Header from './components/Header.js';
import Body from './components/Body.js';
import RecipePanel from './components/RecipePanel.js';
import React, { useState, useEffect } from "react";
import { Outlet, Link, Route, Routes } from "react-router-dom";
import RecipeDetails from './components/body-components/RecipeDetails.js';


function App() {
  const [img, setImg] = useState([])
  const [loading, setLoading] = useState(true)
  const [successMsg, setSuccessMsg] = useState(false);
  const [addPanel, setAddPanel] = useState(false);

  const imgProps = {
    img,
    setImg,
    loading,
    setLoading
  }

  const successMsgProps = {
    successMsg,
    setSuccessMsg
  }

  const panelProps = {
    addPanel,
    setAddPanel,
  }

  return (
    <Routes>
      <Route path="/" element={<Layout {...imgProps} {...successMsgProps} {...panelProps}/>}>
        <Route index element={<Body {...imgProps} {...successMsgProps} {...panelProps}/>} />
        <Route path="recipedetails" element={<RecipeDetails />} />
      </ Route>
    </Routes>
  );
}

function Layout(props) {

  return (
    <div className="App">
        {props.successMsg ?
          <div className="Success">
            <div className="Success__Msg">Successfully submitted your recipe!</div>
            <div className = "Success__Close" onClick={(e) => props.setSuccessMsg(false)}>Close</div>
          </div> : null}
        {props.addPanel && <RecipePanel setAddPanel={props.setAddPanel} setSuccessMsg ={props.setSuccessMsg} {...props} />}
     <Header setAddPanel={props.setAddPanel} addPanel={props.addPanel} />
      <Outlet />
    </div>
  )
}

export default App;
