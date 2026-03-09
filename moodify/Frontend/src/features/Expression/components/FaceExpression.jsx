import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import "../../home/style/expression.scss"

export default function FaceExpression({ onClick = () => {}}) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const stremRef = useRef(null)
    const [expression, setExpression] = useState("Detecting...")

    useEffect(() => {

        init({ landmarkerRef, videoRef, stremRef })
        console.log(expression);


        return () => {

            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };

    }, [])

    async function handleClick() {
        const expression = detect({ landmarkerRef, videoRef, setExpression })
        console.log(expression);
        
        // onclick(expression)
        onClick(expression)
    }

    return (
        <div className="expression" style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                style={{ width: "23vw", borderRadius: "13px" }}
                playsInline
            />
            <h2>{expression}</h2>
            <button className="detect-btn" onClick={handleClick} >Detect expression</button>
        </div>
    )
}