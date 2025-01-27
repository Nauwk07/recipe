import React, { useState } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonList,
  IonItemDivider,
  IonRange,
} from '@ionic/react';
import { add, remove, camera } from 'ionicons/icons';
import { Recipe, RecipeType, DifficultyLevel, Ingredient, Step } from '../models/Recipe';

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (recipe: Partial<Recipe>) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Recipe>>(
    recipe || {
      title: '',
      description: '',
      imageUrl: '',
      type: RecipeType.MAIN,
      preparationTime: 0,
      cookingTime: 0,
      servings: 4,
      difficulty: DifficultyLevel.MEDIUM,
      ingredients: [],
      steps: [],
    }
  );

  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '',
    quantity: 0,
    unit: '',
  });

  const [newStep, setNewStep] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.quantity && newIngredient.unit) {
      setFormData({
        ...formData,
        ingredients: [...(formData.ingredients || []), newIngredient as Ingredient],
      });
      setNewIngredient({ name: '', quantity: 0, unit: '' });
    }
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients?.filter((_, i) => i !== index),
    });
  };

  const addStep = () => {
    if (newStep.trim()) {
      setFormData({
        ...formData,
        steps: [
          ...(formData.steps || []),
          { order: (formData.steps?.length || 0) + 1, description: newStep },
        ],
      });
      setNewStep('');
    }
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps?.filter((_, i) => i !== index).map((step, i) => ({
        ...step,
        order: i + 1,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="ion-padding">
      <IonList>
        <IonItem>
          <IonLabel position="stacked">Titre</IonLabel>
          <IonInput
            value={formData.title}
            onIonInput={e => setFormData({ ...formData, title: e.detail.value! })}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonTextarea
            value={formData.description}
            onIonInput={e => setFormData({ ...formData, description: e.detail.value! })}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Type</IonLabel>
          <IonSelect
            value={formData.type}
            onIonChange={e => setFormData({ ...formData, type: e.detail.value })}
          >
            <IonSelectOption value={RecipeType.STARTER}>Entrée</IonSelectOption>
            <IonSelectOption value={RecipeType.MAIN}>Plat</IonSelectOption>
            <IonSelectOption value={RecipeType.DESSERT}>Dessert</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Temps de préparation (min)</IonLabel>
          <IonInput
            type="number"
            value={formData.preparationTime}
            onIonInput={e => setFormData({ ...formData, preparationTime: parseInt(e.detail.value!) })}
            min="0"
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Temps de cuisson (min)</IonLabel>
          <IonInput
            type="number"
            value={formData.cookingTime}
            onIonInput={e => setFormData({ ...formData, cookingTime: parseInt(e.detail.value!) })}
            min="0"
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Nombre de personnes</IonLabel>
          <IonRange
            min={1}
            max={12}
            pin
            value={formData.servings}
            onIonChange={e => setFormData({ ...formData, servings: e.detail.value as number })}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Difficulté</IonLabel>
          <IonSelect
            value={formData.difficulty}
            onIonChange={e => setFormData({ ...formData, difficulty: e.detail.value })}
          >
            <IonSelectOption value={DifficultyLevel.EASY}>Facile</IonSelectOption>
            <IonSelectOption value={DifficultyLevel.MEDIUM}>Moyen</IonSelectOption>
            <IonSelectOption value={DifficultyLevel.HARD}>Difficile</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItemDivider>Ingrédients</IonItemDivider>
        
        {formData.ingredients?.map((ingredient, index) => (
          <IonItem key={index}>
            <IonLabel>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </IonLabel>
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
          <IonInput
            placeholder="Nom"
            value={newIngredient.name}
            onIonInput={e => setNewIngredient({ ...newIngredient, name: e.detail.value! })}
          />
          <IonInput
            type="number"
            placeholder="Quantité"
            value={newIngredient.quantity}
            onIonInput={e => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.detail.value!) })}
          />
          <IonInput
            placeholder="Unité"
            value={newIngredient.unit}
            onIonInput={e => setNewIngredient({ ...newIngredient, unit: e.detail.value! })}
          />
          <IonButton slot="end" fill="clear" onClick={addIngredient}>
            <IonIcon icon={add} />
          </IonButton>
        </IonItem>

        <IonItemDivider>Étapes</IonItemDivider>
        
        {formData.steps?.map((step, index) => (
          <IonItem key={index}>
            <IonLabel>
              {step.order}. {step.description}
            </IonLabel>
            <IonButton
              slot="end"
              fill="clear"
              color="danger"
              onClick={() => removeStep(index)}
            >
              <IonIcon icon={remove} />
            </IonButton>
          </IonItem>
        ))}

        <IonItem>
          <IonInput
            placeholder="Nouvelle étape"
            value={newStep}
            onIonInput={e => setNewStep(e.detail.value!)}
          />
          <IonButton slot="end" fill="clear" onClick={addStep}>
            <IonIcon icon={add} />
          </IonButton>
        </IonItem>

        <IonItem>
          <IonButton expand="block" type="submit" className="ion-margin-top">
            {recipe ? 'Modifier la recette' : 'Créer la recette'}
          </IonButton>
        </IonItem>
      </IonList>
    </form>
  );
};

export default RecipeForm; 