
import React, { useState } from 'react';
import './App.css';

const PREFERENCES = [
  'Low Carb',
  'High Protein',
  'High Fiber',
  'Low Fat',
  'Keto Friendly',
  'Vegan',
  'Vegetarian',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Heart Healthy',
  'Diabetic Friendly',
  'Muscle Gain',
  'Weight Loss',
  'Budget Friendly',
  'Quick & Easy',
  'Gourmet Style',
];

const MEATS = [
  'Steak', 'Mince', 'Sausage' ,'Chicken', 'Beef', 'Pork', 'Fish', 'Turkey', 'Lamb', 'Duck', 'Ham', 'Bacon', 'Shrimp', 'Crab', 'Lobster', 'Tofu', 'Tempeh',
];
const VEGETABLES = [
  'Broccoli', 'Carrot', 'Spinach', 'Onion', 'Garlic', 'Peppers', 'Tomato', 'Zucchini', 'Cauliflower', 'Green Beans', 'Corn', 'Peas', 'Mushroom', 'Eggplant', 'Cabbage', 'Kale', 'Asparagus', 'Sweet Potato', 'Pumpkin',
];
const CARBS = [
  'Rice', 'Pasta', 'Potato', 'Bread', 'Quinoa', 'Noodles', 'Couscous', 'Tortilla', 'Barley', 'Oats', 'Polenta', 'Bagel', 'Bun', 'Crackers', 'Eggs',
];
const SIDES = [
  'Salad', 'Fries', 'Coleslaw', 'Steamed Veggies', 'Breadsticks', 'Mashed Potatoes', 'Roasted Veggies', 'Fruit Salad', 'Soup', 'Pickles', 'Beans', 'Cornbread',
];
const COOKING_STYLES = [
  'No Cooking', 'Microwave', 'Pan fry', 'Stir Fry', 'BBQ', 'Italian', 'Air Fryer', 'Baking', 'Grilling', 'Steaming', 'Slow Cooker', 'Roasting', 'Sous Vide',
];
const MEAL_TYPES = [
  'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Brunch',
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
  const [otherIngredients, setOtherIngredients] = useState("");
  const [otherList, setOtherList] = useState([]);
  const [customWhy, setCustomWhy] = useState("");
  const [serves, setServes] = useState(2);
  const [preferences, setPreferences] = useState([]);

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
      ...otherList,
    ];
    try {
      const res = await fetch('https://ai-food-creator.netlify.app/generate-recipe', {
        //const res = await fetch('https://ai-food-backend-production.up.railway.app/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, style, mealType, why: customWhy, serves, preferences }),
      });
      if (!res.ok) {
        let errorMsg = 'Failed to generate recipe';
        try {
          const errorData = await res.json();
          if (errorData && errorData.error) errorMsg += ': ' + errorData.error;
        } catch {}
        throw new Error(errorMsg);
      }
      const data = await res.json();
      setRecipe(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOther = (e) => {
    e.preventDefault();
    const trimmed = otherIngredients.trim();
    if (trimmed && !otherList.includes(trimmed)) {
      setOtherList([...otherList, trimmed]);
      setOtherIngredients("");
    }
  };
  const handleRemoveOther = (item) => {
    setOtherList(otherList.filter(i => i !== item));
  };

  return (
    <div className="container">
      <h1>AI Recipe Creator</h1>
      <h2 className="smart-title">Smart Meal Ideas Based on What You Have</h2>
      <form className="form" onSubmit={handleSubmit}>
        {/* Show selected options summary */}
        <fieldset className="checkbox-group">
          <legend>Meats:</legend>
          {MEATS.map((item) => (
            <label key={item} className="checkbox-label">
              <input
                type="checkbox"
                value={item}
                checked={meats.includes(item)}
                onChange={e => {
                  if (e.target.checked) setMeats([...meats, item]);
                  else setMeats(meats.filter(m => m !== item));
                }}
              />
              {item}
            </label>
          ))}
        </fieldset>
        <fieldset className="checkbox-group">
          <legend>Vegetables:</legend>
          {VEGETABLES.map((item) => (
            <label key={item} className="checkbox-label">
              <input
                type="checkbox"
                value={item}
                checked={vegetables.includes(item)}
                onChange={e => {
                  if (e.target.checked) setVegetables([...vegetables, item]);
                  else setVegetables(vegetables.filter(v => v !== item));
                }}
              />
              {item}
            </label>
          ))}
        </fieldset>
        <fieldset className="checkbox-group">
          <legend>Carbs:</legend>
          {CARBS.map((item) => (
            <label key={item} className="checkbox-label">
              <input
                type="checkbox"
                value={item}
                checked={carbs.includes(item)}
                onChange={e => {
                  if (e.target.checked) setCarbs([...carbs, item]);
                  else setCarbs(carbs.filter(c => c !== item));
                }}
              />
              {item}
            </label>
          ))}
        </fieldset>
        <fieldset className="checkbox-group">
          <legend>Sides:</legend>
          {SIDES.map((item) => (
            <label key={item} className="checkbox-label">
              <input
                type="checkbox"
                value={item}
                checked={sides.includes(item)}
                onChange={e => {
                  if (e.target.checked) setSides([...sides, item]);
                  else setSides(sides.filter(s => s !== item));
                }}
              />
              {item}
            </label>
          ))}
        </fieldset>

        <fieldset className="checkbox-group preferences-group">
          <legend>Optional: Choose preferences such as dietary needs or health goals</legend>
          {PREFERENCES.map((pref) => (
            <label key={pref} className="checkbox-label">
              <input
                type="checkbox"
                value={pref}
                checked={preferences.includes(pref)}
                onChange={e => {
                  if (e.target.checked) setPreferences([...preferences, pref]);
                  else setPreferences(preferences.filter(p => p !== pref));
                }}
              />
              {pref}
            </label>
          ))}
        </fieldset>
        <fieldset className="checkbox-group">
          <legend>Other Ingredients:</legend>
          <div className="other-form-wrapper">
            <input
              type="text"
              value={otherIngredients}
              onChange={e => setOtherIngredients(e.target.value)}
              placeholder="Add ingredient..."
              className="other-input"
              maxLength={32}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddOther();
                }
              }}
            />
            <button type="button" className="other-add-btn" onClick={handleAddOther}>Add</button>
          </div>
          <div className="other-list">
            {otherList.map(item => (
              <label key={item} className="other-chip">
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  style={{marginRight: '0.3em'}}
                />
                {item}
                <button type="button" className="other-remove" onClick={() => handleRemoveOther(item)}>&times;</button>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="serves-row">
          <label htmlFor="serves-input" className="serves-label">Number of Serves:</label>
          <input
            id="serves-input"
            type="number"
            min={1}
            max={20}
            value={serves}
            onChange={e => setServes(Number(e.target.value))}
            className="serves-input"
            required
          />
        </div>
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
        <label>
          Preferred way to cook an ingredient (optional):
          <input
            type="text"
            value={customWhy}
            onChange={e => setCustomWhy(e.target.value)}
            placeholder="e.g. I like my eggs poched, fried, etc."
            className="why-input"
            maxLength={80}
            style={{marginTop:'0.3em'}}
          />
        </label>
        <div className="selected-summary">
          <strong>Selected:</strong>
          <ul>
            <li>Meat: {meats.length ? meats.join(', ') : <em>None</em>}</li>
            <li>Vegetable: {vegetables.length ? vegetables.join(', ') : <em>None</em>}</li>
            <li>Carb: {carbs.length ? carbs.join(', ') : <em>None</em>}</li>
            <li>Side: {sides.length ? sides.join(', ') : <em>None</em>}</li>
            <li>Other: {otherList.length ? otherList.join(', ') : <em>None</em>}</li>
            <li>Serves: {serves}</li>
            <li>Preferences: {preferences.length ? preferences.join(', ') : <em>None</em>}</li>
            <li>Cooking Style: {style || <em>None</em>}</li>
            <li>Meal Type: {mealType || <em>Any</em>}</li>
            <li>Preferred: {customWhy ? customWhy : <em>None</em>}</li>
          </ul>
        </div>
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
