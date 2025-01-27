import React from 'react';
import { IonSegment, IonSegmentButton, IonLabel, IonSearchbar } from '@ionic/react';
import { RecipeType } from '../models/Recipe';

interface RecipeFiltersProps {
  selectedType: RecipeType | 'ALL' | 'FAVORITES';
  searchQuery: string;
  onTypeChange: (type: RecipeType | 'ALL' | 'FAVORITES') => void;
  onSearchChange: (query: string) => void;
}

const RecipeFilters: React.FC<RecipeFiltersProps> = ({
  selectedType,
  searchQuery,
  onTypeChange,
  onSearchChange,
}) => {
  return (
    <div className="ion-padding">
      <IonSearchbar
        value={searchQuery}
        onIonInput={(e) => onSearchChange(e.detail.value || '')}
        placeholder="Rechercher une recette..."
        className="mb-3"
      />

      <IonSegment 
        value={selectedType} 
        onIonChange={(e) => onTypeChange(e.detail.value as RecipeType | 'ALL' | 'FAVORITES')}
      >
        <IonSegmentButton value="ALL">
          <IonLabel>Tout</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="FAVORITES">
          <IonLabel>Favoris</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value={RecipeType.STARTER}>
          <IonLabel>Entrées</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value={RecipeType.MAIN}>
          <IonLabel>Plats</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value={RecipeType.DESSERT}>
          <IonLabel>Desserts</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </div>
  );
};

export default RecipeFilters; 