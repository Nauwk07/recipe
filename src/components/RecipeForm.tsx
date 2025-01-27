import React, { useState } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonItemDivider,
} from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import { Recipe, RecipeType, DifficultyLevel } from '../models/Recipe';

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (recipe: Partial<Recipe>) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onSubmit }) => {
  console.log('RecipeForm - Props reçues:', { recipe });

  const [formData, setFormData] = useState<Partial<Recipe>>({
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
    ...recipe
  });

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: ''
  });

  const [newStep, setNewStep] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('RecipeForm - Soumission du formulaire:', formData);
    onSubmit(formData);
  };

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.quantity && newIngredient.unit) {
      setFormData({
        ...formData,
        ingredients: [
          ...(formData.ingredients || []),
          {
            name: newIngredient.name,
            quantity: parseFloat(newIngredient.quantity),
            unit: newIngredient.unit
          }
        ]
      });
      setNewIngredient({ name: '', quantity: '', unit: '' });
    }
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients?.filter((_, i) => i !== index)
    });
  };

  const addStep = () => {
    if (newStep.trim()) {
      setFormData({
        ...formData,
        steps: [
          ...(formData.steps || []),
          {
            order: (formData.steps?.length || 0) + 1,
            description: newStep.trim()
          }
        ]
      });
      setNewStep('');
    }
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps
        ?.filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i + 1 }))
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
          <IonLabel position="stacked">URL de l'image</IonLabel>
          <IonInput
            type="url"
            value={formData.imageUrl}
            onIonInput={e => setFormData({ ...formData, imageUrl: e.detail.value! })}
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
          <IonLabel position="stacked">Temps de préparation (minutes)</IonLabel>
          <IonInput
            type="number"
            min="0"
            value={formData.preparationTime}
            onIonInput={e => setFormData({ ...formData, preparationTime: parseInt(e.detail.value!) })}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Temps de cuisson (minutes)</IonLabel>
          <IonInput
            type="number"
            min="0"
            value={formData.cookingTime}
            onIonInput={e => setFormData({ ...formData, cookingTime: parseInt(e.detail.value!) })}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Nombre de personnes</IonLabel>
          <IonInput
            type="number"
            min="1"
            value={formData.servings}
            onIonInput={e => setFormData({ ...formData, servings: parseInt(e.detail.value!) })}
            required
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
            onIonInput={e => setNewIngredient({ ...newIngredient, quantity: e.detail.value! })}
          />
          <IonInput
            placeholder="Unité"
            value={newIngredient.unit}
            onIonInput={e => setNewIngredient({ ...newIngredient, unit: e.detail.value! })}
          />
          <IonButton fill="clear" onClick={addIngredient}>
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
            placeholder="Description de l'étape"
            value={newStep}
            onIonInput={e => setNewStep(e.detail.value!)}
          />
          <IonButton fill="clear" onClick={addStep}>
            <IonIcon icon={add} />
          </IonButton>
        </IonItem>

        <IonButton expand="block" type="submit" className="ion-margin-top">
          {recipe ? 'Modifier la recette' : 'Créer la recette'}
        </IonButton>
      </IonList>
    </form>
  );
};

export default RecipeForm; 