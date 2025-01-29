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
  IonIcon,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { Recipe, Ingredient, Step } from '../models/Recipe';
import { StorageService } from '../services/StorageService';
import { remove } from 'ionicons/icons';

const UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'cuillère à café',
  'cuillère à soupe',
  'tasse',
  'pincée',
  'unité',
];

const RecipeFormPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [presentToast] = useIonToast();
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

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      try {
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
      }
    };

    loadRecipe();
  }, [id]);

  const handleSubmit = async () => {
    try {
      if (id) {
        await StorageService.updateRecipe(recipe);
      } else {
        await StorageService.addRecipe({
          ...recipe,
          id: Date.now().toString(),
        });
      }

      presentToast({
        message: id ? 'Recette mise à jour avec succès' : 'Recette ajoutée avec succès',
        duration: 2000,
        color: 'success',
      });

      history.replace('/recipes');
    } catch (error) {
      presentToast({
        message: error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement',
        duration: 2000,
        color: 'danger',
      });
    }
  };

  const handleInputChange = (field: keyof Recipe, value: any) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index: number, value: Ingredient) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const handleStepChange = (index: number, description: string) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { description, order: index } : step
      )
    }));
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
      steps: [...prev.steps, { description: '', order: prev.steps.length }],
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
      steps: prev.steps.filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i })),
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
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Titre</IonLabel>
            <IonInput
              value={recipe.title}
              onIonChange={e => handleInputChange('title', e.detail.value!)}
              placeholder="Nom de la recette"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonTextarea
              value={recipe.description}
              onIonChange={e => handleInputChange('description', e.detail.value!)}
              placeholder="Description de la recette"
              required
              rows={3}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Image URL</IonLabel>
            <IonInput
              value={recipe.imageUrl}
              onIonChange={e => handleInputChange('imageUrl', e.detail.value!)}
              placeholder="URL de l'image"
              type="url"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Temps de préparation (min)</IonLabel>
            <IonInput
              value={recipe.prepTime}
              onIonChange={e => handleInputChange('prepTime', parseInt(e.detail.value!) || 0)}
              type="number"
              min="0"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Temps de cuisson (min)</IonLabel>
            <IonInput
              value={recipe.cookTime}
              onIonChange={e => handleInputChange('cookTime', parseInt(e.detail.value!) || 0)}
              type="number"
              min="0"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Nombre de portions</IonLabel>
            <IonInput
              value={recipe.servings}
              onIonChange={e => handleInputChange('servings', parseInt(e.detail.value!) || 0)}
              type="number"
              min="1"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel>Ingrédients</IonLabel>
            <IonButton slot="end" size="small" onClick={addIngredient}>
              Ajouter
            </IonButton>
          </IonItem>
          {recipe.ingredients.map((ingredient, index) => (
            <IonItem key={index}>
              <IonInput
                value={ingredient.name}
                onIonChange={e => handleIngredientChange(index, { ...ingredient, name: e.detail.value! })}
                placeholder="Nom"
                required
              />
              <IonInput
                type="number"
                min="0"
                value={ingredient.quantity}
                onIonChange={e => handleIngredientChange(index, { ...ingredient, quantity: parseFloat(e.detail.value!) || 0 })}
                placeholder="Quantité"
                required
              />
              <IonSelect
                value={ingredient.unit}
                onIonChange={e => handleIngredientChange(index, { ...ingredient, unit: e.detail.value! })}
                placeholder="Unité"
              >
                {UNITS.map(unit => (
                  <IonSelectOption key={unit} value={unit}>
                    {unit}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <IonButton
                slot="end"
                fill="clear"
                color="danger"
                onClick={() => removeIngredient(index)}
              >
                <IonIcon icon={remove} />
              </IonButton>
            </IonItem>
          ))}

          <IonItem>
            <IonLabel>Étapes</IonLabel>
            <IonButton slot="end" size="small" onClick={addStep}>
              Ajouter
            </IonButton>
          </IonItem>
          {recipe.steps.map((step, index) => (
            <IonItem key={index}>
              <IonTextarea
                value={step.description}
                onIonChange={e => handleStepChange(index, e.detail.value!)}
                placeholder={`Étape ${index + 1}`}
                required
                rows={2}
              />
              <IonButton
                slot="end"
                fill="clear"
                color="danger"
                onClick={() => removeStep(index)}
                disabled={recipe.steps.length === 1}
              >
                <IonIcon icon={remove} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default RecipeFormPage; 