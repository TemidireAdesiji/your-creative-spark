// Game dimensions and physics
export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 600;
export const BIRD_SIZE = 30;
export const PIPE_WIDTH = 60;
export const PIPE_GAP = 160;
export const PIPE_SPEED = 1.0;
export const PIPE_SPAWN_INTERVAL = 3200;
export const GROUND_HEIGHT = 60;
export const VERTICAL_SPEED = 1.6;

// Colors (retro Flappy style)
export const COLORS = {
  sky: "#4EC0CA",
  skyGradient: "#2B8A94",
  pipe: "#74BF2E",
  pipeDark: "#558B20",
  pipeHighlight: "#8ED43A",
  pipeBorder: "#3D5C18",
  ground: "#DED895",
  groundDark: "#C9B463",
  groundLine: "#A09040",
  bird: "#F7DC6F",
  birdDark: "#E8A317",
  birdEye: "#FFFFFF",
  birdPupil: "#2C3E50",
  birdBeak: "#E74C3C",
  birdWing: "#F0B90B",
  text: "#FFFFFF",
  textShadow: "#2C3E50",
  overlay: "rgba(20, 30, 40, 0.75)",
};

// MediaPipe Hands CDN (for useHandDetection)
export const HANDS_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240";
