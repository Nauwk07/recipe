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
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
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

        <div className="recipe-section">
          <h2>Ingrédients</h2>
          <IonList>
            {recipe.ingredients.map((ingredient, index) => (
              <IonItem key={index}>
                <IonLabel>{ingredient}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>

        <div className="recipe-section">
          <h2>Étapes</h2>
          <IonList>
            {recipe.steps.map((step, index) => (
              <IonItem key={index}>
                <div className="step-number">{index + 1}</div>
                <IonLabel className="ion-text-wrap">{step}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
      </div>
    </IonContent>
  );
};

export default RecipeDetail; 