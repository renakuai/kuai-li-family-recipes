# kuai-li-family-recipes
A React, CRUD app for my family's recipes. Made using React, Firestore, and Firebase Storage.

<h3>Main Components</h3>
<ol>
  <li>Main App.js component with Layout & React Router to control display and linkage of components</li>
  <li>Body.js component to display Filters and Recipe cards (pulled from Firestore and Firebase Storage)</li>
  <li>Header.js component that persists on all pages that displays Site Title & Add Recipe button</li>
  <li>RecipePanel.js component that is available on all pages that allows you to Add recipes. The text is linked to Firestore and uploaded image is linked to Firebase Storage.</li>
  <li>RecipeDetails.js component that displays details of the clicked on Recipe. This contains an Edit Recipe capability that updates entry in Firestore.   </li>
</ol>
