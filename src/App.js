import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { Loader } from "react-feather";
import RecipeExerpt from "./components/RecipeExerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import { displayToast } from "./helpers/toastHelper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState(
    {
      title: "",
      ingredients: "",
      instructions: "",
      servings: 1, // conservative default
      description: "",
      image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
    }
  );
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        const data = await request.json();
        if (request.ok) {
          setRecipes(data);
          setStatus("success");
          displayToast("Here are your recipes!", "success");
        }
        else {
          console.log("Could not fetch recipes");
        }
        console.log(recipes);
      }
      catch (e) {
        displayToast("Oops, could not fetch recipes!", "error");
        setStatus("error");
      }
    };

    fetchAllRecipes();
  }, []);

  /**
   * ? Why isn't useEffect is necessary for this async?
   * ? Do we want to set the status in the if clause here?
  */

  const handleNewRecipe = async (e, newRecipe) => {
    e.preventDefault();
    try {
      /*
        * Pass an additional arguement {} that is an object called "options"
        * Parse the JSON into a Python dictionary
        * Create a new database record
        * The API will send back the saved recipe as JSON with an ID assigned to it
      */ 
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecipe)
      });
      if (response.ok) {
        setStatus("success");
        // * Send newRecipe data as JSON to our API endpoint
        const data = await response.json();
        setRecipes([...recipes, data.recipe]);
        setShowNewRecipeForm(false);
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
          servings: 1,
          description: "",
          image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        });
        displayToast("Recipe added successfully!", "success");
      }
      else {
        displayToast("Oops, could not add recipe!", "error");
      }
    }
    catch (e) {
      displayToast("Oops, could not add recipe!", "error");
      setStatus("error");
    }
  };

  /**
   * * To update recipe, make the API call, update recipes state, 
   * * pass to EditRecipeForm to submit
  */

  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();
    const { id } = selectedRecipe;
    try {
      /*
        * Pass an additional arguement {} that is an object called "options"
        * Parse the JSON into a Python dictionary
        * Create a new database record
        * The API will send back the saved recipe as JSON with an ID assigned to it
      */ 
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedRecipe)
      });
      if (response.ok) {
        setStatus("success");
        // * Send newRecipe data as JSON to our API endpoint
        const data = await response.json();
        /**
         * * map over the existing recipes in state. If the recipe has the 
         * * same id as the selectedRecipe‘s id, we’ll return the recipe 
         * * object inside the data that we received as a response from our 
         * * API: data.recipe. Otherwise, we’ll return the recipe as it is.
        */
        setRecipes(
          recipes.map((recipe) => {
            if (recipe.id === id) {
              // * Return the saved data from the db
              return data.recipe;
            }
            return recipe;
          })
        );
        displayToast("Recipe updated successfully!", "success");
      }
      else {
        displayToast("Oops, could not update recipe!", "error");
      }
    }
    catch (e) {
      displayToast("Oops, could not update recipe!", "error");
      setStatus("error");
    }

    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = async (recipeId) => {
    //recipeID = selectedRecipe.id
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
        setSelectedRecipe(null);
        displayToast("Recipe deleted successfully!", "success");
      }
      else {
        console.error("Could not delete this recipe!")
      }
    }
    catch (e) {
      displayToast("Oops, could not delete recipe!", "error");
    }
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  };

  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    // * show the recipe form OR the selected recipe, not both.
    setSelectedRecipe(null);
  };

  /**
   * * Destructure the name and value properties from the e.target object. 
   * * Pass an object to our setNewRecipe updater function, 
   * * spread into it the current state attributes …newRecipe, 
   * * overwriting the specific attribute that we are changing [name] 
   * * with the value of the input. 
   * * The [] around [name] indicates that it should accept a dynamic value
   * * action="new" assigns a default value of “new” to the action parameter
   * * if the parameter wasn’t provided to the function when it is called. 
   * * This action will either be “new” or “update” and will allow us to 
   * * choose the appropriate next step.
  */
  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "update") {
      setSelectedRecipe({ ...selectedRecipe, [name]: value });
    }
    else if (action === "new") {
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  };

  const updateSearchTerm = (searchText) => { 
    setSearchTerm(searchText);
   };

  const handleSearch = () => { 
    const searchResults = recipes.filter((recipe) => {
      const valuesToSearch = [
        recipe.title,
        recipe.ingredients,
        recipe.description
      ];
      /** 
       ** the some method looks a lot like filter but it will return true
       ** if any item it iterates over meets provided criteria
      */
      return valuesToSearch.some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    return searchResults;
  };

  const displayedRecipes = searchTerm ? handleSearch() : recipes;

  const displayAllRecipes = () => {  
    setSearchTerm("");
    setSelectedRecipe(null);
    setShowNewRecipeForm(false);
  };

  return (
    <div className='recipe-app'>
      <Header 
        showRecipeForm={showRecipeForm}
        updateSearchTerm={updateSearchTerm}
        displayAllRecipes={displayAllRecipes} 
      />
      {showNewRecipeForm && 
        <NewRecipeForm 
          newRecipe={newRecipe} 
          hideRecipeForm={hideRecipeForm} 
          onUpdateForm={onUpdateForm}
          handleNewRecipe={handleNewRecipe}
        />}
      {selectedRecipe && 
        <RecipeFull 
          selectedRecipe={selectedRecipe} 
          handleUnselectRecipe={handleUnselectRecipe}
          handleUpdateRecipe={handleUpdateRecipe}
          handleDeleteRecipe={handleDeleteRecipe}
          onUpdateForm={onUpdateForm}
        />}
      {status === "error" && (
        <p>"Something went wrong"</p>
      )}
      {status === "loading" && <Loader />}
      {status === "success"}
      {!selectedRecipe && !showNewRecipeForm && (
        <div className="recipe-list">
        {displayedRecipes.map((recipe) => {
          return <RecipeExerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} />
        })};
      </div>)}
      < ToastContainer />
    </div>
  );
}

export default App;
