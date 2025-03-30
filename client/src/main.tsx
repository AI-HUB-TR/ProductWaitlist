import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create a custom style element for larger text defaults
const styleElement = document.createElement('style');
styleElement.textContent = `
  html {
    font-size: 18px;
  }
  
  body {
    font-family: 'Open Sans', sans-serif;
  }
  
  @media (max-width: 768px) {
    html {
      font-size: 16px;
    }
  }
`;
document.head.appendChild(styleElement);

createRoot(document.getElementById("root")!).render(<App />);
