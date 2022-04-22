import React, { useState, useEffect } from "react";
import Checkbox from '@mui/material/Checkbox';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp} from "firebase/firestore";
import { db, storage } from '../firebase';
import { Link } from "react-router-dom";
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage'
import uniqid from "uniqid";

const Body = (props) => {
  const [courseFilters, setCourseFilters] = useState([
    'Main',
    'Side',
    'Dessert'
  ])
  const [ingredientFilters, setIngredientFilters] = useState([
    'Chicken',
    'Beef',
    'Pork',
    'Seafood',
    'Noodle',
    'Rice',
    'Vegetables',
    'Other'
  ])
  const [recipes, setRecipes] = useState([]);
  const [img, setImg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedCourseFilters, setAppliedCourseFilters] = useState([]);
  const [appliedIngFilters, setAppliedIngFilters] = useState([]);

  const recipeDataProps = {
    recipes,
    setRecipes,
    img,
    setImg,
    loading,
    setLoading
  }

  const filterProps = {
    courseFilters,
    ingredientFilters,
    appliedCourseFilters,
    setAppliedCourseFilters,
    appliedIngFilters,
    setAppliedIngFilters
  }

  return (
    <div className="Body">
      <Filters {...filterProps}/>
      <Recipes {...recipeDataProps} {...filterProps} />
    </div>
  )
}

//Creating filters and applying filters
const Filters = (props) => {

  const handleCourseFilters = (e) => {
    if (e.target.checked) {
      props.setAppliedCourseFilters(props.appliedCourseFilters.concat(e.target.id))
    }
    else {
      const newArray = props.appliedCourseFilters.filter((item) => item !== e.target.id)
      props.setAppliedCourseFilters(newArray);
      console.log(newArray);
    }
  }

  const handleIngFilters = (e) => {
    if (e.target.checked) {
      props.setAppliedIngFilters(props.appliedIngFilters.concat(e.target.id))
    }
    else {
      const newArray = props.appliedIngFilters.filter((item) => item !== e.target.id)
      props.setAppliedIngFilters(newArray);
      console.log(newArray);
    }
  }

  return (
    <div className="Filters">
      <div className="Filters__Course">
        <div className = "Filters__Title">Courses</div>
        {props.courseFilters.map((item) => {
          return <div className="Filter__Row" key={item}>
            <Checkbox
              id={item}
              onChange={handleCourseFilters}
            />
            <div className="Filter__Label">{item}</div>
            </div>
        })}
      </div>

      <div className="Filters__Ingredients">
        <div className = "Filters__Title">Ingredients</div>
        {props.ingredientFilters.map((item) => {
          return <div className="Filter__Row" key={item}>
            <Checkbox
             id={item}
              onChange={handleIngFilters}
            /><div className="Filter__Label">{item}</div>
            </div>
        })}
      </div>
    </div>
  )
}

//Loading Recipe Details & Images
const Recipes = (props) => {
  const [imgLoad, setImgLoad] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'recipes'), orderBy('created', 'desc'))
    onSnapshot(q, (querySnapshot) => {
      const recipeArray = (querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
      if (props.appliedIngFilters.length > 0 || props.appliedCourseFilters.length > 0) {
        if ((props.appliedIngFilters.length > 0)) {
          const filterArray = recipeArray.filter((item) => item.data.ingredientsTag.some(tag => props.appliedIngFilters.includes(tag)));
          props.recipes.length = 0;
          props.setRecipes(filterArray);
          console.log(props.recipes);
          console.log(filterArray)
        }
        if ((props.appliedCourseFilters.length > 0)) {
          const filterArray = props.recipes.filter((item) => item.data.courseTag.some(tag => props.appliedCourseFilters.includes(tag)));
          props.recipes.length = 0;
          props.setRecipes(filterArray);
        }
      }
      else {
        props.setRecipes(recipeArray);
      }
    })
  }, [props.appliedIngFilters, props.appliedCourseFilters])

  const images = ref(storage, 'images')
  const listImage = () => {
    listAll(images)
    .then((res) => {
      res.items.forEach((itemref) => {
        getDownloadURL(itemref)
        .then((url) => {
          props.setImg(img => [...img, url])
          props.setLoading(false)
        })
        .catch((err) => {
          console.log(err)
        })
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  useEffect(()=>{
    listImage();
  }, [props.successMsg])


  return (
    <div className="Recipes">
      {props.recipes.map((recipe) => (
        <Link to={{
          pathname: '/recipedetails',
          hash: recipe.id,
          }}
          state={{
            recipe: recipe.data,
            img: props.img.filter((item) => item.includes(recipe.data.imgId)),
            id: recipe.id
          }}>
          <div className="Recipe-Card" id={recipe.id} key={recipe.id} >
            <div className="Recipe-Card__Img">
              {
                <img src={props.img.filter((item) => item.includes(recipe.data.imgId))}
                  style={imgLoad ? {} : {display: 'none'}}
                  alt="recipe"
                  className="Recipe-Card__Img"
                  onLoad={(e) => setImgLoad(true)}
                />
              }
            </div>
            <div className="Recipe-Card__Text" id={recipe.id} >
              <div className="Recipe-Card__Top" id={recipe.id}>
                <div className="Recipe-Card__Metadata" id={recipe.id}>
                {recipe.data.courseTag.map((course) => 
                  <div className="Recipe-Card__CourseTag" id={recipe.id}>{course}</div>)}
                <div className="Recipe-Card__Time" id={recipe.id}>{recipe.data.time} mins</div>
                </div>
                <div className="Recipe-Card__Title" id={recipe.id}>{recipe.data.title}</div>
              </div>
              <div className = "Recipe-Card__IngredientTags" id={recipe.id}>
                {recipe.data.ingredientsTag.map((ing) => 
                  <div className="Recipe-Card__IngredientsTag" id={recipe.id}>{ing}</div>)}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Body;