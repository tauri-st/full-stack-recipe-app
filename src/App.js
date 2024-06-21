import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { Loader } from "react-feather";
import RecipeExerpt from "./components/RecipeExerpt";
import RecipeFull from "./components/RecipeFull";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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
        /** 
        * ? if (response.ok) was another way Ann checked this,
        * ? did we learn about this somewhere? 
        */
        const data = await request.json();
        if (request.status === 200) {
          setRecipes(data);
          setStatus("success");
        }
        /**
         * ? She also put an else statement that consoles "could not fetch", is this redundant with catch clause?
        */
        console.log(recipes);
      }
      catch (error) {
        console.log("Something went wrong", error)
        setStatus("error");
      }
    };

    fetchAllRecipes();
  }, []);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className='recipe-app'>
      <Header />
      {status === "error" && (
        <p>"Something went wrong"</p>
      )}
      {status === "loading" && <Loader />}
      {status === "success"}
      <div className="recipe-list">
        {recipes.map((recipe) => {
          return <RecipeExerpt key={recipe.id} recipe={recipe}/>
        })};
      </div>
    </div>
  );
}

export default App;
