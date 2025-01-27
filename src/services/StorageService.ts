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
      const recipes = await this.getAllRecipes();
      recipes.push(recipe);
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
      const recipes = await this.getAllRecipes();
      const index = recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
      if (index !== -1) {
        recipes[index] = updatedRecipe;
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