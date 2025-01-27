import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { time, people, trash, pencil } from 'ionicons/icons';
import { Recipe } from '../models/Recipe';

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="ion-padding">
      <div className="recipe-detail-header">
        <img src={recipe.imageUrl} alt={recipe.title} />
        <div className="action-buttons">
          <IonButton className="action-button" onClick={onEdit}>
            <IonIcon slot="icon-only" icon={pencil} />
          </IonButton>
          <IonButton className="action-button" color="danger" onClick={onDelete}>
            <IonIcon slot="icon-only" icon={trash} />
          </IonButton>
        </div>
      </div>

      <IonCard>
        <IonCardContent>
          <h1>{recipe.title}</h1>
          
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
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default RecipeDetail; 