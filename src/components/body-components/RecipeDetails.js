import React, { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import {db, storage} from '../../firebase.js'
import { collection, addDoc, Timestamp, listAll, getDownloadURL, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from "firebase/storage";


const RecipeDetails = (props) => {
  const location = useLocation();
  const [edit, setEdit] = useState(false);
  //inputs
  const [title, setTitle] = useState(location.state.recipe.title);
  const [time, setTime] = useState(location.state.recipe.time);
  const [ingredients, setIngredients] = useState(location.state.recipe.ingredients);
  const [instructions, setInstructions] = useState(location.state.recipe.instructions);
  const [ingredientsTag, setIngredientsTag] = useState(location.state.recipe.ingredientsTag);
  const [courseTag, setCourseTag] = useState(location.state.recipe.courseTag);
  const [author, setAuthor] = useState(location.state.recipe.author);

  const handleEdit = async (e) => {
    const taskDocRef = doc(db, 'recipes', location.state.id)
    setEdit(false);
    try{
      await updateDoc(taskDocRef, {
        title: title,
        time: time,
        ingredients: ingredients,
        instructions: instructions,
        courseTag: courseTag,
        ingredientsTag: ingredientsTag,
        author: author,
        created: Timestamp.now(),
      })
    //onClose()
  } catch (err) {
    alert(err)
    }    
  }

  useEffect(() => {
    setTitle(title);
    console.log(title);
    setTime(time);
    setIngredients(ingredients);
    setInstructions(instructions);
    setIngredientsTag(ingredientsTag);
    setCourseTag(courseTag);
    setAuthor(author);
  }, [setEdit])

  const closePanel = (e) => {
    e.preventDefault();
    setEdit(false)
  }

  const setChecked = (e) => {
    if (e.target.checked) {
      if (e.target.id === 'Chicken' || e.target.id === 'Beef' || e.target.id === 'Pork' || e.target.id === 'Seafood' || e.target.id === 'Noodle' || e.target.id === 'Rice' || e.target.id === 'Vegetables' || e.target.id === 'Other') {
        if (!ingredientsTag.includes(e.target.id)) {
          setIngredientsTag(ingredientsTag.concat(e.target.id));
        }
      }
      else {
        if (!courseTag.includes(e.target.id)) {
          setCourseTag(courseTag.concat(e.target.id));
        }
      }
    }
    else {
      if (e.target.id === 'Chicken' || e.target.id === 'Beef' || e.target.id === 'Pork' || e.target.id === 'Seafood' || e.target.id === 'Noodle' || e.target.id === 'Rice' || e.target.id === 'Vegetables' || e.target.id === 'Other') {
        const filtered = ingredientsTag.filter(ing => ing !== e.target.id);
        setIngredientsTag(filtered);
      }
      else {
        const filtered = courseTag.filter(course => course !== e.target.id);
        setCourseTag(filtered);
      }
    }
  }

  return (
    <div className='Recipe-Details'>
      <div className = "Recipe-Details__Header">
        <div className='Recipe-Details__Title'>{title}</div>
        <div className='Recipe-Details__Edit'><button type="button" onClick={(e)=> setEdit(true)}>Edit Recipe</button></div>
      </div>
      <div className='AuthorTime'>
        <div className='Recipe-Details__IngredientsTag'>Cooking time: {location.state.recipe.time} minutes</div>
        <div className='Recipe-Details__IngredientsTag'>Added by:  {location.state.recipe.author}</div>
      </div>
      <div className='Recipe-Details__Img'>
        <img src = {location.state.img} alt = "recipe" className = "Recipe-Card__Img" />
      </div>
      <div className='Recipe-Details__Ingredients'>
              <div className = "Recipe-Details__Section">Ingredients</div>
              {location.state.recipe.ingredients}</div>
      <div className='Recipe-Details__Instructions'>
        <div className="Recipe-Details__Section">Instructions</div>
        {location.state.recipe.instructions}</div>
      
      {edit ?
        <div className="Edit-Recipe-Panel">
          <div className="Recipe-Panel__Header">
            <div className="Recipe-Panel__Title">Edit this Recipe</div>
            <div className="Recipe-Panel__Close" onClick = {closePanel}>Close</div></div>
          <form onSubmit={handleEdit} className="Edit-Recipe" name="Edit-Recipe">
        <label className = "Recipe-Input-Label" name = "title">Recipe Name*</label>
        <input
          className = 'Recipe-Input'
          type='text'
          name='title'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder='Name of your recipe'
          required/>
        
        <label className = "Recipe-Input-Label" name = "ingredients">Ingredients*</label>
        <textarea
          rows = '10'
          className = 'Recipe-Input'
          name='ingredients'
          onChange={(e) => setIngredients(e.target.value)}
          value={ingredients}
          placeholder='Ingredients'
          required/>
        
        <label className = "Recipe-Input-Label" name = "instructions">Instructions*</label>
        <textarea
          rows = '15'
          className = 'Recipe-Input'
          name='instructions'
          onChange={(e) => setInstructions(e.target.value)}
          value={instructions}
          placeholder='Instructions'
          required/>
        
          <label className="Recipe-Input-Label" name="ingredientsTag">Tag Ingredients Used</label>
          <div className = "Ingredients-Group">
        <input
          className='Recipe-Input'
          type='checkbox'
            name='ingredientsTag'
            id = 'Chicken'
          onChange={setChecked}
            value={ingredientsTag} />Chicken<br></br>
          </div>
          <div className = "Ingredients-Group">
        <input
          className='Recipe-Input'
          type='checkbox'
            name='ingredientsTag'
            id = 'Beef'
            onChange={setChecked}
            value={ingredientsTag} />Beef<br></br>
          </div>
          <div className = "Ingredients-Group">
        <input
          className='Recipe-Input'
          type='checkbox'
            name='ingredientsTag'
            id = 'Pork'
            onChange={setChecked}
            value={ingredientsTag} />Pork<br></br>
          </div>
          <div className = "Ingredients-Group">
         <input
          className='Recipe-Input'
          type='checkbox'
            name='ingredientsTag'
            id = 'Seafood'
            onChange={setChecked}
            value={ingredientsTag} />Seafood<br></br>
          </div>
          <div className = "Ingredients-Group">
        <input
          className='Recipe-Input'
          type='checkbox'
            name='ingredientsTag'
            id = 'Noodle'
            onChange={setChecked}
            value={ingredientsTag} />Noodle<br></br>
            </div>
          <div className = "Ingredients-Group">
        <input
          className='Recipe-Input'
          type='checkbox'
            name='ingredientsTag'
            id = 'Rice'
            onChange={setChecked}
            value={ingredientsTag} />Rice<br></br>
          </div>
          <div className = "Ingredients-Group">
        <input
          className='Recipe-Input'
          type='checkbox'
            name='ingredientsTag'
            id = 'Vegetables'
            onChange={setChecked}
            value={ingredientsTag} />Vegetables<br></br>
        </div>
        <div className = "Ingredients-Group">
        <input
          className='Recipe-Input'
          type='checkbox'
            name='ingredientsTag'
            id = 'Other'
            onChange={setChecked}
            value={ingredientsTag} />Other<br></br>
        </div>
        
        <label className = "Recipe-Input-Label" name = "courseTag">What type of dish is this?</label>
        <div className = "Course-Group">
        <input
          className='Recipe-Input'
          type='checkbox'
            name='courseTag'
            id = 'Main'
            onChange={setChecked}
            value={courseTag} />Main Course<br></br>
        </div>
        <div className = "Course-Group">
        <input
          className='Recipe-Input'
          type='checkbox'
            name='courseTag'
            id = 'Side'
            onChange={setChecked}
            value={courseTag} />Side Dish<br></br>
          </div>
        <div className = "Course-Group">
        <input
          className='Recipe-Input'
          type='checkbox'
          name='courseTag'
          id = 'Dessert'
          onChange={setChecked}
          value={courseTag} />Dessert<br></br>
        </div>
        
        <label className = "Recipe-Input-Label" name = "time">Minutes to make dish</label>
        <input
          className = 'Recipe-Input'
          type='number'
          name='time'
          onChange={(e) => setTime(e.target.value)}
          value={time}
          placeholder='Minutes to make dish' />
        
        <label className="Recipe-Input-Label" name="ingredientsTag">Who is adding this recipe?*</label>
        <div className="Author-Group">
          <input
            type="radio"
            value={author}
            name="author"
            onChange={(e) => setAuthor('Daddy')}
            required/> Daddy
          <input
            type="radio"
            value={author}
            name="author"
            onChange={(e) => setAuthor('Mommy')} /> Mommy
          <input
            type="radio"
            value={author}
            name="author"
            onChange={(e) => setAuthor('Rena')} /> Rena
          <input
            type="radio"
            value={author}
            name="author"
            onChange={(e) => setAuthor('Nathan')} /> Nathan
        </div>
        <div className = "Submit">
          <button type="submit" id="Add-Recipe-Btn" onClick={props.submitRecipe}>Save Changes</button>
        </div>
      </form>
        </div> : null}
    </div>
  )
}

export default RecipeDetails;