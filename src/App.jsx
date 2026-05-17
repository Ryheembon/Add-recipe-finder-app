import { useState } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setSearched(true)
    setSelectedRecipe(null)

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
      )
      const data = await response.json()
      setRecipes(data.meals || [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Recipe Finder</h1>
        <p>Discover meals from around the world. Search by name and explore.</p>
      </header>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Try chicken, pasta, curry..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && (
        <div className="status status--loading">
          <div className="spinner" />
          <p>Finding delicious recipes...</p>
        </div>
      )}

      {searched && !loading && recipes.length === 0 && (
        <p className="status status--empty">
          No recipes found. Try another search like &quot;beef&quot; or
          &quot;salmon&quot;.
        </p>
      )}

      {selectedRecipe && (
        <section className="recipe-details">
          <button
            type="button"
            className="back-btn"
            onClick={() => setSelectedRecipe(null)}
          >
            ← Back to results
          </button>

          <div className="details-layout">
            <div className="details-image">
              <img
                src={selectedRecipe.strMealThumb}
                alt={selectedRecipe.strMeal}
              />
            </div>

            <div className="details-content">
              <h2>{selectedRecipe.strMeal}</h2>

              <div className="badges">
                <span className="badge badge--category">
                  {selectedRecipe.strCategory}
                </span>
                <span className="badge badge--area">
                  {selectedRecipe.strArea}
                </span>
              </div>

              <h3>Instructions</h3>
              <p className="instructions">{selectedRecipe.strInstructions}</p>
            </div>
          </div>
        </section>
      )}

      {!selectedRecipe && recipes.length > 0 && (
        <>
          <p className="results-count">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
          </p>
          <section className="recipe-list">
            {recipes.map((recipe) => (
              <article
                key={recipe.idMeal}
                className="recipe-card"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                <h2>{recipe.strMeal}</h2>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  )
}

export default App
