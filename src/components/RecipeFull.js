import React from 'react';

const RecipeFull = ( {recipe} ) => {
    return (
        <div className='recipe-details'>
            <article>
                <header>
                    <figure>
                        <img src={recipe.image_url} alt={recipe.title}/>
                    </figure>
                    <h2>{recipe.title}</h2>
                    <div className='button-container'>
                        <button className='edit-button'>Edit</button>
                        <button className='cancel-button'>
                            Close
                        </button>
                        <button className='delete-button'>Delete</button>
                    </div>
                </header>

                <h3>Description:</h3>
                <p>{recipe.description}</p>

                <h3>Ingredients:</h3>

                <ul className='ingredient-list'>

                </ul>
                <h3>Instructions:</h3>

                <pre className='formatted-text'>{recipe.instructions}</pre>

                <h3>Servings: {recipe.servings}</h3>
            </article>
        </div>
    )
}

export default RecipeFull