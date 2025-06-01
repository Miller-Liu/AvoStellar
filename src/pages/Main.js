import '../css/main.css';

import { useEffect, useRef, useState } from "react";

import { setUpCanvas } from "../js/canvas.js";

function Main() {
  const canvasRef = useRef()
  const containerRef = useRef()
  const shopRef = useRef()
  const mainRef = useRef()

  const [animation_tracker, animation_trigger_function] = useState(0);
  const [continue_animation, continue_animation_function] = useState("");
  const [title_animation, title_animation_function] = useState("");
  const [author_animation, author_animation_function] = useState("");
  const [main_page_display, main_page_display_function] = useState("block");
  const [shop_display, shop_display_function] = useState("none");
  const [hud_display, setHUDDisplay] = useState("none");

  const [money, setMoney] = useState(0);

  const items = [useRef(), useRef()];
  
  var increase_animation_tracker = (x) => {
    animation_trigger_function(x);
  }

  const increaseMoney = (x) => {
    setMoney(x);
  };

  useEffect(() => {
    setUpCanvas(canvasRef, containerRef, increase_animation_tracker, increaseMoney, shopRef, mainRef, items);
  }, []);

  useEffect(() => {
    if (animation_tracker == 1) {
      continue_animation_function("animate1");
      setTimeout(() => {
        continue_animation_function("animate2");
      }, 150);
      setTimeout(() => {
        title_animation_function("fade-up");
      }, 500);
      setTimeout(() => {
        author_animation_function("fade-up");
      }, 1000);
      setTimeout(() => {
        main_page_display_function("none");
      }, 2000);
    }
    if (animation_tracker == 2) {
      setHUDDisplay("block");
      shop_display_function("none");
    }
    if (animation_tracker == 3) {
      setHUDDisplay("none");
      shop_display_function("flex");
    }
  }, [animation_tracker])

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
        <div id="to-shop" ref={shopRef}>Shop</div>
        <div id="coin-counter1">Total Currency: {money}</div>
      </div>
      <div id="shop-container" style={{display: shop_display}}>
        <div id="to-main" ref={mainRef}>Back</div>
        <div id="coin-counter2">Total Currency: {money}</div>
        <div id="shop">
          <div className="column">
            <div className="item" ref={items[0]}>Upgrade Clicker<br/>Cost: 10 coins</div>
            <div className="item" ref={items[1]}>Auto Clicker<br/>Cost: 20 coins</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
