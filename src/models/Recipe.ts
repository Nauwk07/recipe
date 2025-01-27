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
  type: RecipeType;
  preparationTime: number; // en minutes
  cookingTime: number; // en minutes
  servings: number;
  difficulty: DifficultyLevel;
  ingredients: Ingredient[];
  steps: Step[];
  rating: number;
  ratingCount: number;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
} 