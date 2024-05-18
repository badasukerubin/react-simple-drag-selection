import App from "./components/App";
import "./index.css";
import { Axis } from "./types";

export default function Index() {
  return (
    <div className="container">
      {/* Scroll Y */}
      <App axis={Axis.Y} length={60} />

      {/* Scroll X */}
      <App axis={Axis.X} length={30} />
    </div>
  );
}
