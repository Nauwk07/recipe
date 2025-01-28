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
  IonLoading,
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
  const [loading, setLoading] = useState(true);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  useEffect(() => {
    let isMounted = true;
    
    const loadRecipeData = async () => {
      try {
        const recipes = await StorageService.getAllRecipes();
        const foundRecipe = recipes.find(r => r.id === id);
        if (isMounted) {
          if (foundRecipe) {
            setRecipe(foundRecipe);
          } else {
            throw new Error('Recette non trouvée');
          }
        }
      } catch (error) {
        if (isMounted) {
          presentToast({
            message: 'Erreur lors du chargement de la recette',
            duration: 2000,
            color: 'danger',
          });
          history.push('/recipes');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    loadRecipeData();

    return () => {
      isMounted = false;
      setLoading(false);
    };
  }, [id]);

  const handleFavoriteClick = async (recipeId: string) => {
    try {
      await StorageService.toggleFavorite(recipeId);
      const recipes = await StorageService.getAllRecipes();
      const updatedRecipe = recipes.find(r => r.id === id);
      if (updatedRecipe) {
        setRecipe(updatedRecipe);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du favori:', error);
    }
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
            setLoading(true);
            try {
              await StorageService.deleteRecipe(id);
              presentToast({
                message: 'Recette supprimée avec succès',
                duration: 2000,
                color: 'success',
              });
              history.push('/recipes');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    });
  };

  const toggleFavorite = async () => {
    if (recipe) {
      try {
        await StorageService.toggleFavorite(recipe.id);
        const recipes = await StorageService.getAllRecipes();
        const updatedRecipe = recipes.find(r => r.id === id);
        if (updatedRecipe) {
          setRecipe(updatedRecipe);
        }
      } catch (error) {
        console.error('Erreur lors du changement du statut favori:', error);
      }
    }
  };

  if (loading) {
    return <IonLoading isOpen={true} message="Chargement..." />;
  }

  if (!recipe) {
    return <div>Recette non trouvée</div>;
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
          onFavoriteClick={handleFavoriteClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </IonContent>
    </IonPage>
  );
};

export default RecipeDetailPage; 