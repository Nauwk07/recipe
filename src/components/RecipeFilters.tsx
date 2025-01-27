import React from 'react';
import {
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToolbar,
} from '@ionic/react';

interface RecipeFiltersProps {
  selectedFilter: 'ALL' | 'FAVORITES';
  searchQuery: string;
  onFilterChange: (filter: 'ALL' | 'FAVORITES') => void;
  onSearchChange: (query: string) => void;
}

const RecipeFilters: React.FC<RecipeFiltersProps> = ({
  selectedFilter,
  searchQuery,
  onFilterChange,
  onSearchChange,
}) => {
  return (
    <>
      <IonToolbar>
        <IonSegment value={selectedFilter} onIonChange={e => onFilterChange(e.detail.value as 'ALL' | 'FAVORITES')}>
          <IonSegmentButton value="ALL">
            <IonLabel>Toutes</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="FAVORITES">
            <IonLabel>Favoris</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>
      
      <IonSearchbar
        value={searchQuery}
        onIonChange={e => onSearchChange(e.detail.value!)}
        placeholder="Rechercher une recette..."
        className="ion-padding-horizontal"
      />
    </>
  );
};

export default RecipeFilters; 