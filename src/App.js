import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { Loader } from "react-feather";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        setStatus("loading");
        /* 
        * directory is nested within our project directory 
        * and the proxy directive that was set for us in the 
        * package.json file. 
        * The proxy directive is what tells our react front end 
        * to send requests to that location – ie. – the same 
        * address but with the port ‘5000’ 
        */
        const request = await fetch("/api/recipes");
        console.log(request);
        const {results} = await request.json();
        if (request.status === 200) {
          setRecipes(results[0]);
          setStatus("success");
        }
        console.log(recipes);
      }
      catch (error) {
        console.log("Something went wrong", error)
        setStatus("error");
      }
    };

    fetchAllRecipes();
  }, []);

  return (
    <div className='recipe-app'>
      <Header />
      {status === "error" && (
        <p>"Something went wrong"</p>
      )}
      {status === "loading" && <Loader />}
      {status === "success" }
      <p>Your recipes here! </p>
    </div>
  );
}

export default App;
