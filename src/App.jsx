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
    <main>
      <h1>Recipe Finder</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for a recipe..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {loading && <p className="status">Loading...</p>}

      {searched && !loading && recipes.length === 0 && (
        <p className="status">No recipes found. Try another search.</p>
      )}

      {selectedRecipe && (
        <section className="recipe-details">
          <button type="button" onClick={() => setSelectedRecipe(null)}>
            Back
          </button>
          <h2>{selectedRecipe.strMeal}</h2>
          <img
            src={selectedRecipe.strMealThumb}
            alt={selectedRecipe.strMeal}
          />
          <p>
            <strong>Category:</strong> {selectedRecipe.strCategory}
          </p>
          <p>
            <strong>Area:</strong> {selectedRecipe.strArea}
          </p>
          <h3>Instructions</h3>
          <p>{selectedRecipe.strInstructions}</p>
        </section>
      )}

      {!selectedRecipe && recipes.length > 0 && (
        <section className="recipe-list">
          {recipes.map((recipe) => (
            <div
              key={recipe.idMeal}
              className="recipe-card"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <h2>{recipe.strMeal}</h2>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

export default App
