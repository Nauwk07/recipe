import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonLoading,
  useIonToast,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { Recipe, Ingredient, Step } from '../models/Recipe';
import { StorageService } from '../services/StorageService';

const RecipeFormPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [presentToast] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>({
    id: '',
    title: '',
    description: '',
    imageUrl: '',
    prepTime: 0,
    cookTime: 0,
    servings: 0,
    ingredients: [],
    steps: [],
    isFavorite: false,
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      loadRecipe();
    }
  }, [id]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const recipes = await StorageService.getAllRecipes();
      const foundRecipe = recipes.find(r => r.id === id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
      }
    } catch (error) {
      presentToast({
        message: 'Erreur lors du chargement de la recette',
        duration: 2000,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrors([]);

      // Validation côté client
      const validationErrors = StorageService.validateRecipe(recipe);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        presentToast({
          message: 'Veuillez corriger les erreurs avant de soumettre',
          duration: 3000,
          color: 'danger',
        });
        return;
      }

      if (id) {
        await StorageService.updateRecipe(recipe);
        presentToast({
          message: 'Recette mise à jour avec succès',
          duration: 2000,
          color: 'success',
        });
      } else {
        await StorageService.addRecipe({
          ...recipe,
          id: Date.now().toString(),
        });
        presentToast({
          message: 'Recette ajoutée avec succès',
          duration: 2000,
          color: 'success',
        });
      }
      history.push('/recipes');
    } catch (error) {
      if (error instanceof Error) {
        setErrors(error.message.split('\n'));
      }
      presentToast({
        message: 'Erreur lors de l\'enregistrement',
        duration: 2000,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Recipe, value: any) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index: number, value: Ingredient) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const handleStepChange = (index: number, value: Step) => {
    const newSteps = [...recipe.steps];
    newSteps[index] = value;
    setRecipe(prev => ({ ...prev, steps: newSteps }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: 0, unit: '' }],
    }));
  };

  const addStep = () => {
    setRecipe(prev => ({
      ...prev,
      steps: [...prev.steps, { description: '', order: 0 }],
    }));
  };

  const removeIngredient = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const removeStep = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/recipes" />
          </IonButtons>
          <IonTitle>{id ? 'Modifier la recette' : 'Nouvelle recette'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSubmit}>
              Enregistrer
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} message="Chargement..." />
        
        {errors.length > 0 && (
          <div className="ion-padding">
            <IonList>
              {errors.map((error, index) => (
                <IonItem key={index} color="danger">
                  <IonLabel className="ion-text-wrap">{error}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </div>
        )}

        <IonList>
          <IonItem>
            <IonLabel position="stacked">
              Titre <span style={{ color: 'var(--ion-color-danger)' }}>*</span>
            </IonLabel>
            <IonInput
              value={recipe.title}
              onIonChange={e => handleInputChange('title', e.detail.value!)}
              placeholder="Nom de la recette"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">
              Description <span style={{ color: 'var(--ion-color-danger)' }}>*</span>
            </IonLabel>
            <IonTextarea
              value={recipe.description}
              onIonChange={e => handleInputChange('description', e.detail.value!)}
              placeholder="Description de la recette"
              rows={3}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">
              Image URL <span style={{ color: 'var(--ion-color-danger)' }}>*</span>
            </IonLabel>
            <IonInput
              value={recipe.imageUrl}
              onIonChange={e => handleInputChange('imageUrl', e.detail.value!)}
              placeholder="URL de l'image"
              type="url"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">
              Temps de préparation <span style={{ color: 'var(--ion-color-danger)' }}>*</span>
            </IonLabel>
            <IonInput
              value={recipe.prepTime}
              onIonChange={e => handleInputChange('prepTime', e.detail.value!)}
              placeholder="Ex: 30 minutes"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">
              Temps de cuisson <span style={{ color: 'var(--ion-color-danger)' }}>*</span>
            </IonLabel>
            <IonInput
              value={recipe.cookTime}
              onIonChange={e => handleInputChange('cookTime', e.detail.value!)}
              placeholder="Ex: 45 minutes"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">
              Nombre de portions <span style={{ color: 'var(--ion-color-danger)' }}>*</span>
            </IonLabel>
            <IonInput
              value={recipe.servings}
              onIonChange={e => handleInputChange('servings', e.detail.value!)}
              placeholder="Ex: 4"
              type="number"
            />
          </IonItem>

          <IonItem>
            <IonLabel>
              Ingrédients <span style={{ color: 'var(--ion-color-danger)' }}>*</span>
            </IonLabel>
            <IonButton slot="end" size="small" onClick={addIngredient}>
              Ajouter
            </IonButton>
          </IonItem>
          {recipe.ingredients.map((ingredient, index) => (
            <IonItem key={index}>
              <IonInput 
                value={ingredient.name}
                onIonChange={e => handleIngredientChange(index, { ...ingredient, name: e.detail.value! })}
                placeholder={`Ingrédient ${index + 1}`}
              />
              <IonButton
                slot="end"
                fill="clear"
                color="danger"
                onClick={() => removeIngredient(index)}
                disabled={recipe.ingredients.length === 1}
              >
                Supprimer
              </IonButton>
            </IonItem>
          ))}

          <IonItem>
            <IonLabel>
              Étapes <span style={{ color: 'var(--ion-color-danger)' }}>*</span>
            </IonLabel>
            <IonButton slot="end" size="small" onClick={addStep}>
              Ajouter
            </IonButton>
          </IonItem>
          {recipe.steps.map((step, index) => (
            <IonItem key={index}>
              <IonTextarea
                value={step.description}
                onIonChange={e => handleStepChange(index, { ...step, description: e.detail.value! })}
                placeholder={`Étape ${index + 1}`}
                rows={2}
              />
              <IonButton
                slot="end"
                fill="clear"
                color="danger"
                onClick={() => removeStep(index)}
                disabled={recipe.steps.length === 1}
              >
                Supprimer
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default RecipeFormPage; 