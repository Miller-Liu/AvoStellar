import { useRef, useEffect } from "react"
import { setUpCanvas } from "../js/canvas";

import "../css/main.css"

export default function Main() {
    const canvasRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        setUpCanvas(canvasRef, containerRef);
    }, []);

    return (
        <div className="App">
            <div id="main-canvas-container" ref={containerRef}>
                <canvas id="main-canvas" ref={canvasRef}></canvas>
            </div>
        </div>
    )
}
