import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonViewWillEnter,
  IonLoading,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useLocation, useHistory } from 'react-router-dom';
import { Recipe, RecipeType } from '../models/Recipe';
import { StorageService } from '../services/StorageService';
import RecipeCard from '../components/RecipeCard';
import RecipeFilters from '../components/RecipeFilters';

const RecipeListPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedType, setSelectedType] = useState<RecipeType | 'ALL' | 'FAVORITES'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const history = useHistory();

  const handleAddClick = () => {
    history.push('/recipe/new');
  };

  // Charger les recettes au montage et à chaque retour sur la page
  useIonViewWillEnter(() => {
    loadRecipes();
  });

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const loadedRecipes = await StorageService.getAllRecipes();
      setRecipes(loadedRecipes);
      
      // Appliquer les filtres de l'URL
      const params = new URLSearchParams(location.search);
      const typeFilter = params.get('type') as RecipeType;
      const favoriteFilter = params.get('filter') === 'favorites';
      const sortByRating = params.get('sort') === 'rating';

      if (typeFilter) {
        setSelectedType(typeFilter);
      } else if (favoriteFilter) {
        setSelectedType('FAVORITES');
      } else {
        setSelectedType('ALL');
      }

      if (sortByRating) {
        loadedRecipes.sort((a, b) => b.rating - a.rating);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les recettes quand les filtres changent
  useEffect(() => {
    let filtered = [...recipes];

    // Filtre par type
    if (selectedType !== 'ALL') {
      if (selectedType === 'FAVORITES') {
        filtered = filtered.filter(recipe => recipe.isFavorite);
      } else {
        filtered = filtered.filter(recipe => recipe.type === selectedType);
      }
    }

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query)
      );
    }

    setFilteredRecipes(filtered);
  }, [recipes, selectedType, searchQuery]);

  // Gérer les favoris
  const handleFavoriteClick = async (id: string) => {
    await StorageService.toggleFavorite(id);
    loadRecipes();
  };

  // Mettre à jour l'URL quand les filtres changent
  const handleTypeChange = (type: RecipeType | 'ALL' | 'FAVORITES') => {
    setSelectedType(type);
    if (type === 'ALL') {
      history.push('/recipes');
    } else if (type === 'FAVORITES') {
      history.push('/recipes?filter=favorites');
    } else {
      history.push(`/recipes?type=${type}`);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mes Recettes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} message="Chargement..." />
        
        <RecipeFilters
          selectedType={selectedType}
          searchQuery={searchQuery}
          onTypeChange={handleTypeChange}
          onSearchChange={setSearchQuery}
        />
        
        <IonGrid>
          <IonRow>
            {filteredRecipes.map(recipe => (
              <IonCol size="12" sizeMd="6" sizeLg="4" key={recipe.id}>
                <RecipeCard
                  recipe={recipe}
                  onFavoriteClick={handleFavoriteClick}
                />
              </IonCol>
            ))}
            {filteredRecipes.length === 0 && !loading && (
              <IonCol size="12" className="ion-text-center ion-padding">
                <p>Aucune recette trouvée</p>
              </IonCol>
            )}
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleAddClick}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default RecipeListPage; 