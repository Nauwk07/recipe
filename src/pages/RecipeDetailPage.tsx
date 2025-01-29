import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonBackButton,
  IonButton,
  IonIcon,
  useIonAlert,
  useIonToast,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { StorageService } from '../services/StorageService';
import RecipeDetail from '../components/RecipeDetail';
import { heart, pencil } from 'ionicons/icons';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipes = await StorageService.getAllRecipes();
        const foundRecipe = recipes.find(r => r.id === id);
        if (foundRecipe) {
          setRecipe(foundRecipe);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la recette:', error);
      }
    };

    loadRecipe();
  }, [id]);

  const handleEdit = () => {
    history.push(`/recipe/edit/${id}`);
  };

  const handleDelete = () => {
    presentAlert({
      header: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cette recette ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: async () => {
            try {
              await StorageService.deleteRecipe(id);
              presentToast({
                message: 'Recette supprimée avec succès',
                duration: 2000,
                color: 'success',
              });
              history.push('/recipes');
            } catch (error) {
              presentToast({
                message: 'Erreur lors de la suppression',
                duration: 2000,
                color: 'danger',
              });
            }
          },
        },
      ],
    });
  };

  const toggleFavorite = async () => {
    if (!recipe) return;
    
    try {
      await StorageService.toggleFavorite(recipe.id);
      // Mise à jour locale sans refaire d'appel API
      setRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du favori:', error);
      presentToast({
        message: 'Erreur lors de la mise à jour du favori',
        duration: 2000,
        color: 'danger',
      });
    }
  };

  if (!recipe) {
    return <div>Chargement...</div>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/recipes" />
          </IonButtons>
          <IonTitle>{recipe.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleEdit}>
              <IonIcon slot="icon-only" icon={pencil} />
            </IonButton>
            <IonButton 
              className={`favorite-button ${recipe.isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              <IonIcon slot="icon-only" icon={heart} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RecipeDetail
          recipe={recipe}
          onFavoriteClick={toggleFavorite}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </IonContent>
    </IonPage>
  );
};

export default RecipeDetailPage; 