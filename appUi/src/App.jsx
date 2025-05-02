import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { request } from "./models/request";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    request.get("/fuch").then((value) => {
      console.log(value);
    });
    console.log("con cai nit");
  }, []);

  return <div>app</div>;
}

export default App;
