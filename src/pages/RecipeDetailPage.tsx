import React, { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonBackButton,
  useIonViewWillEnter,
  IonLoading,
  useIonAlert,
  useIonToast,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { StorageService } from '../services/StorageService';
import RecipeDetail from '../components/RecipeDetail';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  useIonViewWillEnter(() => {
    loadRecipe();
  });

  const loadRecipe = async () => {
    try {
      const recipes = await StorageService.getAllRecipes();
      const foundRecipe = recipes.find(r => r.id === id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        throw new Error('Recette non trouvée');
      }
    } catch (error) {
      presentToast({
        message: 'Erreur lors du chargement de la recette',
        duration: 2000,
        color: 'danger',
      });
      history.push('/recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = async (recipeId: string) => {
    await StorageService.toggleFavorite(recipeId);
    loadRecipe();
  };

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
            await StorageService.deleteRecipe(id);
            presentToast({
              message: 'Recette supprimée avec succès',
              duration: 2000,
              color: 'success',
            });
            history.push('/recipes');
          },
        },
      ],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/recipes" />
          </IonButtons>
          <IonTitle>{recipe?.title || 'Détail de la recette'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} message="Chargement..." />
        {recipe && (
          <RecipeDetail
            recipe={recipe}
            onFavoriteClick={handleFavoriteClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default RecipeDetailPage; 