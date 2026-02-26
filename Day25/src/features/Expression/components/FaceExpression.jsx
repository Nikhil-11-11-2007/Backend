import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";


export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const animationRef = useRef(null);

    let strem;

    const [expression, setExpression] = useState("Detecting...")

    
    const init = async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        landmarkerRef.current = await FaceLandmarker.createFromOptions(
            vision,

            {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1
            }
        );

        strem = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = strem;
        await videoRef.current.play();

        detect();
    };

    const detect = () => {
        if (!landmarkerRef.current || !videoRef.current) return;

        const results = landmarkerRef.current.detectForVideo(
            videoRef.current,
            performance.now()
        )

        if (results.faceBlendshapes?.length > 0) {
            const blendshapes = results.faceBlendshapes[ 0 ].categories;

            const getScore = (name) => {
                return blendshapes.find((b) => b.categoryName === name)?.score || 0
            }

            const smilLeft = getScore("mouthSmileLeft");
            const smileRight = getScore("mouthSmileRight");
            const jawOpen = getScore("jawOpen");
            const browUp = getScore("browInnerUp");
            const frownLeft = getScore("mouthFrownLeft");
            const frownRight = getScore("mouthFrownRight");

            console.log(getScore("mouthFrownLeft"));
            

            let currentExpression = "Neutral";

            if (smilLeft > 0.5 && smileRight > 0.5) {
                currentExpression = "Happy 😄";
            } else if (jawOpen > 0.1 && browUp > 0.1) {
                currentExpression = "Surprised 😲";
            } else if (frownLeft > 0.01 && frownRight > 0.01) {
                currentExpression = "Sad 😢";
            }            

            setExpression(currentExpression)
        }

    };
    useEffect(() => {

        init()
        console.log(expression);
        

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

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

    return (
        <div style={{ textAlign: "center" }}>
            <video
             ref={videoRef}
             style={{width: "400px", borderRadius: "13px"}}
             playsInline
            />
            <h2>{expression}</h2>
             <button onClick={detect} >Detect expression</button>
        </div>
    )
}