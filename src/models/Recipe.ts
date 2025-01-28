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
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  steps: Step[];
  isFavorite: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 