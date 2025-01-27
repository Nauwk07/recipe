import React from 'react';
import { IonCard, IonCardHeader, IonCardContent, IonIcon, IonChip } from '@ionic/react';
import { time, people, star, heart, heartOutline } from 'ionicons/icons';
import { Recipe, RecipeType } from '../models/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteClick: (id: string) => void;
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

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onFavoriteClick }) => {
  return (
    <IonCard className="recipe-card">
      <img src={recipe.imageUrl} alt={recipe.title} className="img-cover" />
      
      <IonCardHeader>
        <div className="flex justify-between items-center">
          <IonChip color="secondary" className="text-sm">
            {getTypeLabel(recipe.type)}
          </IonChip>
          <button 
            className="text-secondary"
            onClick={() => onFavoriteClick(recipe.id)}
          >
            <IonIcon 
              icon={recipe.isFavorite ? heart : heartOutline} 
              size="large"
            />
          </button>
        </div>
        <h2 className="text-lg font-semibold mt-2">{recipe.title}</h2>
      </IonCardHeader>

      <IonCardContent>
        <p className="text-medium mb-3 text-sm line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <IonIcon icon={time} />
            <span>{recipe.preparationTime + recipe.cookingTime} min</span>
          </div>
          
          <div className="flex items-center gap-1">
            <IonIcon icon={people} />
            <span>{recipe.servings} pers.</span>
          </div>
          
          <div className="flex items-center gap-1">
            <IonIcon icon={star} />
            <span>{recipe.rating.toFixed(1)}</span>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default RecipeCard; 