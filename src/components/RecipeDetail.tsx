import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonChip,
  IonIcon,
  IonButton,
  IonBadge,
} from '@ionic/react';
import {
  time,
  people,
  star,
  heart,
  heartOutline,
  speedometer,
} from 'ionicons/icons';
import { Recipe, RecipeType, DifficultyLevel } from '../models/Recipe';

interface RecipeDetailProps {
  recipe: Recipe;
  onFavoriteClick: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const getTypeLabel = (type: RecipeType) => {
  switch (type) {
    case RecipeType.STARTER:
      return 'Entrée';
    case RecipeType.MAIN:
      return 'Plat';
    case RecipeType.DESSERT:
      return 'Dessert';
  }
};

const getDifficultyLabel = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return 'Facile';
    case DifficultyLevel.MEDIUM:
      return 'Moyen';
    case DifficultyLevel.HARD:
      return 'Difficile';
  }
};

const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onFavoriteClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="ion-padding">
      <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover rounded-t-lg" />

      <div className="flex justify-between items-center mt-4">
        <IonChip color="secondary">{getTypeLabel(recipe.type)}</IonChip>
        <div className="flex gap-2">
          <IonButton fill="clear" onClick={() => onFavoriteClick(recipe.id)}>
            <IonIcon
              slot="icon-only"
              icon={recipe.isFavorite ? heart : heartOutline}
              color="danger"
            />
          </IonButton>
          <IonButton fill="clear" onClick={onEdit}>
            Modifier
          </IonButton>
          <IonButton fill="clear" color="danger" onClick={onDelete}>
            Supprimer
          </IonButton>
        </div>
      </div>

      <h1 className="text-2xl font-bold mt-4">{recipe.title}</h1>
      <p className="text-medium mt-2">{recipe.description}</p>

      <div className="flex justify-between mt-4">
        <div className="flex items-center gap-1">
          <IonIcon icon={time} />
          <span>Préparation: {recipe.preparationTime} min</span>
        </div>
        <div className="flex items-center gap-1">
          <IonIcon icon={time} />
          <span>Cuisson: {recipe.cookingTime} min</span>
        </div>
        <div className="flex items-center gap-1">
          <IonIcon icon={people} />
          <span>{recipe.servings} pers.</span>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex items-center gap-1">
          <IonIcon icon={speedometer} />
          <span>Difficulté: {getDifficultyLabel(recipe.difficulty)}</span>
        </div>
        <div className="flex items-center gap-1">
          <IonIcon icon={star} />
          <span>Note: {recipe.rating.toFixed(1)} ({recipe.ratingCount} avis)</span>
        </div>
      </div>

      <IonCard className="mt-6">
        <IonCardContent>
          <h2 className="text-xl font-semibold mb-4">Ingrédients</h2>
          <ul className="list-disc pl-4">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="mb-2">
                <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span> {ingredient.name}
              </li>
            ))}
          </ul>
        </IonCardContent>
      </IonCard>

      <IonCard className="mt-4">
        <IonCardContent>
          <h2 className="text-xl font-semibold mb-4">Étapes</h2>
          <div className="space-y-4">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <IonBadge color="primary">{step.order}</IonBadge>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default RecipeDetail; 