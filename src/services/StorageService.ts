import { Preferences } from '@capacitor/preferences';
import { Recipe } from '../models/Recipe';

const RECIPES_KEY = 'recipes';

export class StorageService {
  // Récupérer toutes les recettes
  static async getAllRecipes(): Promise<Recipe[]> {
    console.log('StorageService - getAllRecipes - Début');
    try {
      const { value } = await Preferences.get({ key: RECIPES_KEY });
      const recipes = value ? JSON.parse(value) : [];
      console.log('StorageService - getAllRecipes - Recettes récupérées:', recipes);
      return recipes;
    } catch (error) {
      console.error('StorageService - getAllRecipes - Erreur:', error);
      return [];
    }
  }

  // Ajouter une nouvelle recette
  static async addRecipe(recipe: Recipe): Promise<void> {
    console.log('StorageService - addRecipe - Nouvelle recette:', recipe);
    try {
      const errors = this.validateRecipe(recipe);
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      const recipes = await this.getAllRecipes();
      recipes.push({
        ...recipe,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await Preferences.set({
        key: RECIPES_KEY,
        value: JSON.stringify(recipes)
      });
      console.log('StorageService - addRecipe - Recette ajoutée avec succès');
    } catch (error) {
      console.error('StorageService - addRecipe - Erreur:', error);
      throw error;
    }
  }

  // Mettre à jour une recette
  static async updateRecipe(updatedRecipe: Recipe): Promise<void> {
    console.log('StorageService - updateRecipe - Mise à jour:', updatedRecipe);
    try {
      const errors = this.validateRecipe(updatedRecipe);
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      const recipes = await this.getAllRecipes();
      const index = recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
      if (index !== -1) {
        recipes[index] = {
          ...updatedRecipe,
          updatedAt: new Date()
        };
        await Preferences.set({
          key: RECIPES_KEY,
          value: JSON.stringify(recipes)
        });
        console.log('StorageService - updateRecipe - Mise à jour réussie');
      } else {
        throw new Error('Recette non trouvée');
      }
    } catch (error) {
      console.error('StorageService - updateRecipe - Erreur:', error);
      throw error;
    }
  }

  // Supprimer une recette
  static async deleteRecipe(recipeId: string): Promise<void> {
    console.log('StorageService - deleteRecipe - ID:', recipeId);
    try {
      const recipes = await this.getAllRecipes();
      const filteredRecipes = recipes.filter(recipe => recipe.id !== recipeId);
      await Preferences.set({
        key: RECIPES_KEY,
        value: JSON.stringify(filteredRecipes)
      });
      console.log('StorageService - deleteRecipe - Suppression réussie');
    } catch (error) {
      console.error('StorageService - deleteRecipe - Erreur:', error);
      throw error;
    }
  }

  // Mettre à jour les favoris
  static async toggleFavorite(recipeId: string): Promise<void> {
    console.log('StorageService - toggleFavorite - ID:', recipeId);
    try {
      const recipes = await this.getAllRecipes();
      const index = recipes.findIndex(recipe => recipe.id === recipeId);
      if (index !== -1) {
        recipes[index].isFavorite = !recipes[index].isFavorite;
        await Preferences.set({
          key: RECIPES_KEY,
          value: JSON.stringify(recipes)
        });
        console.log('StorageService - toggleFavorite - Favori mis à jour');
      }
    } catch (error) {
      console.error('StorageService - toggleFavorite - Erreur:', error);
      throw error;
    }
  }

  static validateRecipe(recipe: Recipe): string[] {
    const errors: string[] = [];
    
    if (!recipe.title?.trim()) {
      errors.push('Le titre est obligatoire');
    }
    
    if (!recipe.description?.trim()) {
      errors.push('La description est obligatoire');
    }
    
    if (!recipe.imageUrl?.trim()) {
      errors.push('L\'URL de l\'image est obligatoire');
    }
    
    if (recipe.prepTime === undefined || recipe.prepTime < 0) {
      errors.push('Le temps de préparation est obligatoire et doit être positif');
    }
    
    if (recipe.cookTime === undefined || recipe.cookTime < 0) {
      errors.push('Le temps de cuisson est obligatoire et doit être positif');
    }
    
    if (recipe.servings === undefined || recipe.servings <= 0) {
      errors.push('Le nombre de portions est obligatoire et doit être supérieur à 0');
    }
    
    if (!recipe.ingredients?.length) {
      errors.push('Au moins un ingrédient est requis');
    } else if (recipe.ingredients.some(i => !i.name.trim() || !i.unit.trim() || i.quantity <= 0)) {
      errors.push('Tous les ingrédients doivent avoir un nom, une unité et une quantité positive');
    }
    
    if (!recipe.steps?.length) {
      errors.push('Au moins une étape est requise');
    } else if (recipe.steps.some(s => !s.description.trim())) {
      errors.push('Toutes les étapes doivent avoir une description');
    }
    
    return errors;
  }
} 