import React, { useState } from 'react';
import './App.css';

const MEATS = [
  'Chicken', 'Beef', 'Pork', 'Fish', 'Turkey', 'Lamb',
];
const VEGETABLES = [
  'Broccoli', 'Carrot', 'Spinach', 'Onion', 'Garlic', 'Peppers',
];
const CARBS = [
  'Rice', 'Pasta', 'Potato', 'Bread', 'Quinoa', 'Noodles',
];
const SIDES = [
  'Salad', 'Fries', 'Coleslaw', 'Steamed Veggies', 'Breadsticks',
];
const COOKING_STYLES = [
  'Stir Fry', 'BBQ', 'Italian', 'Air Fryer', 'Baking',
];
const MEAL_TYPES = [
  'Breakfast', 'Lunch', 'Dinner', 'Dessert',
];

function App() {
  const [meats, setMeats] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [carbs, setCarbs] = useState([]);
  const [sides, setSides] = useState([]);
  const [style, setStyle] = useState('');
  const [mealType, setMealType] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMultiSelect = (setter) => (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setter(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecipe(null);
    const ingredients = [
      ...meats,
      ...vegetables,
      ...carbs,
      ...sides,
    ];
    try {
      const res = await fetch('http://localhost:5000/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, style, mealType }),
      });
      if (!res.ok) throw new Error('Failed to generate recipe');
      const data = await res.json();
      setRecipe(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Cooking Recipe App</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Meats (select multiple):
          <select multiple value={meats} onChange={handleMultiSelect(setMeats)}>
            {MEATS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Vegetables (select multiple):
          <select multiple value={vegetables} onChange={handleMultiSelect(setVegetables)}>
            {VEGETABLES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Carbs (select multiple):
          <select multiple value={carbs} onChange={handleMultiSelect(setCarbs)}>
            {CARBS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Sides (select multiple):
          <select multiple value={sides} onChange={handleMultiSelect(setSides)}>
            {SIDES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Cooking Style:
          <select value={style} onChange={e => setStyle(e.target.value)} required>
            <option value="" disabled>Select style</option>
            {COOKING_STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Meal Type (optional):
          <select value={mealType} onChange={e => setMealType(e.target.value)}>
            <option value="">Any</option>
            {MEAL_TYPES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={loading || (!meats.length && !vegetables.length && !carbs.length && !sides.length) || !style}>
          {loading ? 'Generating...' : 'Generate Recipe'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {recipe && (
        <div className="recipe">
          <h2>{recipe.name}</h2>
          <p><strong>Estimated Cooking Time:</strong> {recipe.cookingTime}</p>
          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
          <h3>Instructions:</h3>
          <ol>
            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;
