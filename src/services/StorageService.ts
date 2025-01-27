import { Preferences } from '@capacitor/preferences';
import { Recipe } from '../models/Recipe';

const RECIPES_KEY = 'recipes';

export class StorageService {
  // Récupérer toutes les recettes
  static async getAllRecipes(): Promise<Recipe[]> {
    const { value } = await Preferences.get({ key: RECIPES_KEY });
    return value ? JSON.parse(value) : [];
  }

  // Ajouter une nouvelle recette
  static async addRecipe(recipe: Recipe): Promise<void> {
    const recipes = await this.getAllRecipes();
    recipes.push({
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await Preferences.set({
      key: RECIPES_KEY,
      value: JSON.stringify(recipes)
    });
  }

  // Mettre à jour une recette
  static async updateRecipe(updatedRecipe: Recipe): Promise<void> {
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
    }
  }

  // Supprimer une recette
  static async deleteRecipe(recipeId: string): Promise<void> {
    const recipes = await this.getAllRecipes();
    const filteredRecipes = recipes.filter(recipe => recipe.id !== recipeId);
    await Preferences.set({
      key: RECIPES_KEY,
      value: JSON.stringify(filteredRecipes)
    });
  }

  // Mettre à jour les favoris
  static async toggleFavorite(recipeId: string): Promise<void> {
    const recipes = await this.getAllRecipes();
    const index = recipes.findIndex(recipe => recipe.id === recipeId);
    if (index !== -1) {
      recipes[index].isFavorite = !recipes[index].isFavorite;
      await Preferences.set({
        key: RECIPES_KEY,
        value: JSON.stringify(recipes)
      });
    }
  }

  // Mettre à jour la note
  static async updateRating(recipeId: string, newRating: number): Promise<void> {
    const recipes = await this.getAllRecipes();
    const index = recipes.findIndex(recipe => recipe.id === recipeId);
    if (index !== -1) {
      const recipe = recipes[index];
      const totalRating = recipe.rating * recipe.ratingCount;
      recipe.ratingCount += 1;
      recipe.rating = (totalRating + newRating) / recipe.ratingCount;
      await Preferences.set({
        key: RECIPES_KEY,
        value: JSON.stringify(recipes)
      });
    }
  }
} 