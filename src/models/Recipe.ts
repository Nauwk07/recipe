export enum RecipeType {
  STARTER = 'STARTER',
  MAIN = 'MAIN',
  DESSERT = 'DESSERT'
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Step {
  order: number;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  steps: string[];
  isFavorite: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 