import '../css/main.css';

import { Link } from 'react-router-dom'

import { useEffect, useRef, useState } from "react";

import { setUpCanvas } from "../js/canvas.js";

function Main() {
  const canvasRef = useRef()
  const containerRef = useRef()

  const [animation_tracker, animation_trigger_function] = useState(0);
  const [continue_animation, continue_animation_function] = useState("");
  const [title_animation, title_animation_function] = useState("");
  const [author_animation, author_animation_function] = useState("");
  const [main_page_display, main_page_display_function] = useState("block");
  const [shop_display, shop_display_function] = useState("none");
  const [hud_display, setHUDDisplay] = useState("none");

  const [money, setMoney] = useState(0);
  
  useEffect(() => {
    setUpCanvas(canvasRef, containerRef);
  }, []);

  return (
    <div className="App">
      <div id="main-canvas-container" ref={containerRef}>
        <canvas id = "main-canvas" ref={canvasRef}></canvas>
      </div>
      <div id="main-page" style={{display: main_page_display}}>
          <div id="title-container">
              <h2 className={title_animation}>AvoStellar</h2>
              <h3 className={author_animation}> - by Miller and Philip</h3>
          </div>
          <div id="continue-text-container" className={continue_animation}>
              <hr></hr>
              <h4>Press Space to Continue</h4>
              <hr></hr>
          </div>
      </div>
      <div id="HUD" style={{display: hud_display}}>
        <div id="coin-counter">Total Currency: {money}</div>
      </div>
      <div id="shop-container" style={{display: shop_display}}>
        <div id="shop">
          <div className="column">
            <div className="item">TEST</div>
            <div className="item">TEST</div>
            <div className="item">TEST</div>
            <div className="item">TEST</div>
          </div>
          <div className="column">
            <div className="item">TEST</div>
            <div className="item">TEST</div>
            <div className="item">TEST</div>
            <div className="item">TEST</div>
          </div>
        </div>
      </div>
      <Link to='/shop' style={{ color: 'white', position: 'absolute'}}>TO SHOP</Link>
    </div>
  );
}

export default Main;
