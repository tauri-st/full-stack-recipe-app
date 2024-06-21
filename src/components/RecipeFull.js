import React from 'react';

const RecipeFull = ( {selectedRecipe, handleUnselectRecipe} ) => {

    return (
        <div className='recipe-details'>
            <article>
                <header>
                    <figure>
                        <img src={selectedRecipe.image_url} alt={selectedRecipe.title}/>
                    </figure>
                    <h2>{selectedRecipe.title}</h2>
                    <div className='button-container'>
                        <button className='edit-button'>Edit</button>
                        <button className='cancel-button' onClick={() => handleUnselectRecipe}>
                            Close
                        </button>
                        <button className='delete-button'>Delete</button>
                    </div>
                </header>

                <h3>Description:</h3>
                <p>{selectedRecipe.description}</p>

                <h3>Ingredients:</h3>

                <ul className='ingredient-list'>
                    {selectedRecipe.ingredients.split(",").map((ingredient, index) =>
                        <li className="ingredient" key={index}>
                            {ingredient}
                        </li>
                    )}

                </ul>
                <h3>Instructions:</h3>

                <pre className='formatted-text'>{selectedRecipe.instructions}</pre>

                <h3>Servings: {selectedRecipe.servings}</h3>
            </article>
        </div>
    )
}

export default RecipeFull