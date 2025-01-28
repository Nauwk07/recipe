import React from 'react';
import {
  IonContent,
  IonIcon,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { time, people } from 'ionicons/icons';
import { Recipe } from '../models/Recipe';

interface RecipeDetailProps {
  recipe: Recipe;
  onFavoriteClick: (recipeId: string) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onFavoriteClick, onEdit, onDelete }) => {
  return (
    <IonContent>
      <div className="modal-content">
        <div className="recipe-detail-header">
          <img src={recipe.imageUrl} alt={recipe.title} />
        </div>

        <div className="recipe-info">
          <IonBadge color="primary">
            <IonIcon icon={time} /> Préparation: {recipe.prepTime}
          </IonBadge>
          <IonBadge color="secondary">
            <IonIcon icon={time} /> Cuisson: {recipe.cookTime}
          </IonBadge>
          <IonBadge color="tertiary">
            <IonIcon icon={people} /> {recipe.servings} portions
          </IonBadge>
        </div>

        <div className="recipe-section">
          <h2>Description</h2>
          <p>{recipe.description}</p>
        </div>

        <div className="recipe-ingredients">
          <h2>Ingrédients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-steps">
          <h2>Étapes</h2>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={index}>
                {step.description}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </IonContent>
  );
};

export default RecipeDetail; 