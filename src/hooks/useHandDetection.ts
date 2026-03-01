import { useState, useEffect, useRef, RefObject } from "react";
import { loadScript } from "@/lib/loadScript";
import { HANDS_CDN } from "@/lib/flappyBirdConstants";

export function useHandDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
  facingMode: "user" | "environment" = "user"
) {
  const [armRaised, setArmRaised] = useState(false);
  const [openHand, setOpenHand] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState(false);
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFistRef = useRef(false);
  const lastOpenRef = useRef(false);
  const lastHandDetectedRef = useRef(false);
  const handsInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setCameraReady(true);

        await loadScript(`${HANDS_CDN}/hands.js`);
        if (cancelled) return;

        const Hands = (window as unknown as { Hands?: new (opts: { locateFile: (f: string) => string }) => { setOptions: (o: unknown) => void; onResults: (cb: (r: unknown) => void) => void; send: (o: { image: HTMLVideoElement }) => Promise<void> } }).Hands;
        if (!Hands) throw new Error("Hands not found on window. Try refreshing.");
        const hands = new Hands({ locateFile: (file: string) => `${HANDS_CDN}/${file}` });
        handsInstanceRef.current = hands;

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 0,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: { multiHandLandmarks?: Array<Array<{ x: number; y: number }>> }) => {
          const landmarks = results.multiHandLandmarks;
          if (!landmarks || landmarks.length === 0) {
            if (lastHandDetectedRef.current) {
              lastHandDetectedRef.current = false;
              setHandDetected(false);
            }
            setArmRaised(false);
            setOpenHand(false);
            lastFistRef.current = false;
            lastOpenRef.current = false;
            return;
          }
          if (!lastHandDetectedRef.current) {
            lastHandDetectedRef.current = true;
            setHandDetected(true);
          }

          const margin = 0.03;
          let isFist = false;
          let isOpenHand = false;
          for (const lm of landmarks) {
            if (lm.length < 21) continue;
            const indexCurled = lm[8].y > lm[6].y - margin;
            const middleCurled = lm[12].y > lm[10].y - margin;
            const ringCurled = lm[16].y > lm[14].y - margin;
            const pinkyCurled = lm[20].y > lm[18].y - margin;
            const indexExtended = lm[8].y < lm[6].y - margin;
            const middleExtended = lm[12].y < lm[10].y - margin;
            const ringExtended = lm[16].y < lm[14].y - margin;
            const pinkyExtended = lm[20].y < lm[18].y - margin;
            if (indexCurled && middleCurled && ringCurled && pinkyCurled) {
              isFist = true;
              break;
            }
            if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
              isOpenHand = true;
              break;
            }
          }

          if (isFist !== lastFistRef.current) {
            lastFistRef.current = isFist;
            setArmRaised(isFist);
          }
          if (isOpenHand !== lastOpenRef.current) {
            lastOpenRef.current = isOpenHand;
            setOpenHand(isOpenHand);
          }
        });

        async function detect() {
          if (cancelled) return;
          const handsInst = handsInstanceRef.current as { send: (opts: { image: HTMLVideoElement }) => Promise<void> } | null;
          if (video.readyState >= 2 && handsInst) {
            await handsInst.send({ image: video });
          }
          rafRef.current = setTimeout(detect, 80);
        }
        detect();
      } catch (err) {
        console.error("Camera/hands error:", err);
        setCameraError(err instanceof Error ? err.message : "Camera access denied");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (rafRef.current) clearTimeout(rafRef.current);
      rafRef.current = null;
      handsInstanceRef.current = null;
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [enabled, videoRef, facingMode]);

  return {
    armRaised,
    openHand,
    cameraReady,
    cameraError,
    poseDetected: handDetected,
  };
}
