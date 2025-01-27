import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonBackButton,
  useIonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { StorageService } from '../services/StorageService';
import RecipeForm from '../components/RecipeForm';

const RecipeFormPage: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();

  const handleSubmit = async (recipeData: Partial<Recipe>) => {
    try {
      const newRecipe: Recipe = {
        ...recipeData as Recipe,
        id: Date.now().toString(),
        rating: 0,
        ratingCount: 0,
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await StorageService.addRecipe(newRecipe);
      
      presentToast({
        message: 'Recette créée avec succès',
        duration: 2000,
        color: 'success',
      });
      
      history.push('/recipes');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      presentToast({
        message: 'Erreur lors de la création de la recette',
        duration: 2000,
        color: 'danger',
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/recipes" />
          </IonButtons>
          <IonTitle>Nouvelle recette</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RecipeForm onSubmit={handleSubmit} />
      </IonContent>
    </IonPage>
  );
};

export default RecipeFormPage; 