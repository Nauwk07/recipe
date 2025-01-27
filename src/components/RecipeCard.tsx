import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  useIonModal,
} from '@ionic/react';
import { heart, heartOutline, time, pencil, trash } from 'ionicons/icons';
import { Recipe } from '../models/Recipe';
import RecipeDetail from './RecipeDetail';

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteClick: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onFavoriteClick,
  onEdit,
  onDelete,
}) => {
  const [presentModal, dismissModal] = useIonModal(RecipeDetail, {
    recipe,
    onEdit: () => {
      dismissModal();
      onEdit(recipe.id);
    },
    onDelete: () => {
      dismissModal();
      onDelete(recipe.id);
    },
  });

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    presentModal({
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      cssClass: 'recipe-detail-modal'
    });
  };

  return (
    <IonCard className="recipe-card">
      <div onClick={handleCardClick}>
        <div className="image-container">
          <img src={recipe.imageUrl} alt={recipe.title} />
          <IonButton
            className={`favorite-button ${recipe.isFavorite ? 'active' : ''}`}
            fill="clear"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavoriteClick(recipe.id);
            }}
          >
            <IonIcon icon={recipe.isFavorite ? heart : heartOutline} />
          </IonButton>
        </div>

        <IonCardHeader>
          <IonCardTitle>{recipe.title}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <div className="recipe-info">
            {recipe.prepTime && (
              <IonBadge color="primary">
                <IonIcon icon={time} /> {recipe.prepTime}
              </IonBadge>
            )}
            {recipe.cookTime && (
              <IonBadge color="secondary">
                <IonIcon icon={time} /> {recipe.cookTime}
              </IonBadge>
            )}
          </div>
          <p className="recipe-description">{recipe.description}</p>
        </IonCardContent>
      </div>

      <div className="card-actions">
        <IonButton
          fill="clear"
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(recipe.id);
          }}
        >
          <IonIcon icon={pencil} slot="start" />
          Modifier
        </IonButton>

        <IonButton
          fill="clear"
          color="danger"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(recipe.id);
          }}
        >
          <IonIcon icon={trash} slot="start" />
          Supprimer
        </IonButton>
      </div>
    </IonCard>
  );
};

export default RecipeCard; 