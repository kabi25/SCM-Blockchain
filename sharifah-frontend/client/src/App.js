import "./styles/Home.css";

// Additional imports
import { RouterProvider } from "react-router-dom";
import { router } from "./lib/routes";
// import Home from "./pages/index.js"
import Navbar from "./components/navbar.js"
import Footer from "./components/footer.js"

export default function App() {
  return (
    <>
    <Navbar/>
      <RouterProvider router={router}/>
    <Footer/>
    </>
  );
}
