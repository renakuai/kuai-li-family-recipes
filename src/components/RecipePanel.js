import { SentimentSatisfiedAlt, SettingsOutlined } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import {db, storage} from '../firebase.js'
import { collection, addDoc, Timestamp, listAll, getDownloadURL } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import uniqid from "uniqid";

const RecipePanel = (props) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredientsTag, setIngredientsTag] = useState([]);
  const [courseTag, setCourseTag] = useState([]);
  const [author, setAuthor] = useState('');
  const [imgId, setImgId] = useState(uniqid());
  //img states

  const addRecipe = async (e) => {
    //e.preventDefault();
    props.setAddPanel(false);
    props.setSuccessMsg(true);
    try {
      await addDoc(collection(db, 'recipes'), {
        title: title,
        time: time,
        ingredients: ingredients,
        instructions: instructions,
        courseTag: courseTag,
        ingredientsTag: ingredientsTag,
        author: author,
        created: Timestamp.now(),
        imgId: imgId,
      })
      //onclose()
    } catch (err) {
      alert(err)
    }
  }

  const closePanel = (e) => {
    e.preventDefault();
    props.setAddPanel(false)
  }

  const uploadImage = (e) => {
    props.setLoading(true);
    props.setImg([]);
    console.log({imgId});
    const file = e.target.files[0];
    const uploadedFile = ref(storage, 'images/' + '-' + imgId)
    uploadBytes(uploadedFile, file)
    .then((img) => {
      console.log(file.name + imgId)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const setChecked = (e) => {
    if (e.target.checked) {
      if (e.target.id === 'Chicken' || e.target.id === 'Beef' || e.target.id === 'Pork' || e.target.id === 'Seafood' || e.target.id === 'Noodle' || e.target.id === 'Rice' || e.target.id === 'Vegetables' || e.target.id === 'Other') {
        setIngredientsTag(ingredientsTag.concat(e.target.id));
      }
      else {
        setCourseTag(courseTag.concat(e.target.id));
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
    <div className="Recipe-Panel">
      <div className="Recipe-Panel__Header">
        <div className="Recipe-Panel__Title">Add a Recipe</div>
        <div className="Recipe-Panel__Close" onClick = {closePanel}>Close</div></div>
      <form onSubmit={addRecipe} className="Add-Recipe" name="Add-Recipe">
        <label className = "Recipe-Input-Label" name = "title">Recipe Name*</label>
        <input
          className = 'Recipe-Input'
          type='text'
          name='title'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder='Name of your recipe'
          required/>
        
        <label className="Recipe-Input-Label" name="ingredientsTag">Upload an image*</label>
        <div className="Img-Upload">
          <input
            type="file"
            name="recipeImg"
            onChange={uploadImage}
            required/>
          <div className="Img-Msg">

          </div>
        </div>
        
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
          <button type="submit" id="Add-Recipe-Btn" onClick={props.submitRecipe}>Add Recipe</button>
        </div>
      </form>
    </div>
  )
}

export default RecipePanel;