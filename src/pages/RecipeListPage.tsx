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
  IonButtons,
  IonButton,
  useIonAlert,
  useIonToast,
} from '@ionic/react';
import { add, settings } from 'ionicons/icons';
import { useLocation, useHistory } from 'react-router-dom';
import { Recipe } from '../models/Recipe';
import { StorageService } from '../services/StorageService';
import RecipeCard from '../components/RecipeCard';
import RecipeFilters from '../components/RecipeFilters';

const RecipeListPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'FAVORITES'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  
  const location = useLocation();
  const history = useHistory();

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
      const favoriteFilter = params.get('filter') === 'favorites';

      if (favoriteFilter) {
        setSelectedFilter('FAVORITES');
      } else {
        setSelectedFilter('ALL');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les recettes quand les filtres changent
  useEffect(() => {
    let filtered = [...recipes];

    // Filtre par favoris
    if (selectedFilter === 'FAVORITES') {
      filtered = filtered.filter(recipe => recipe.isFavorite);
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
  }, [recipes, selectedFilter, searchQuery]);

  // Gérer les favoris
  const handleFavoriteClick = async (id: string) => {
    await StorageService.toggleFavorite(id);
    loadRecipes();
  };

  const handleEdit = (id: string) => {
    history.push(`/recipe/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    presentAlert({
      header: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cette recette ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: async () => {
            try {
              await StorageService.deleteRecipe(id);
              presentToast({
                message: 'Recette supprimée avec succès',
                duration: 2000,
                color: 'success',
              });
              loadRecipes();
            } catch (error) {
              presentToast({
                message: 'Erreur lors de la suppression',
                duration: 2000,
                color: 'danger',
              });
            }
          },
        },
      ],
    });
  };

  // Mettre à jour l'URL quand les filtres changent
  const handleFilterChange = (filter: 'ALL' | 'FAVORITES') => {
    setSelectedFilter(filter);
    if (filter === 'ALL') {
      history.push('/recipes');
    } else {
      history.push('/recipes?filter=favorites');
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
        
        <RecipeFilters
          selectedFilter={selectedFilter}
          searchQuery={searchQuery}
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchQuery}
        />
        
        <IonGrid>
          <IonRow>
            {filteredRecipes.map(recipe => (
              <IonCol size="12" sizeMd="6" sizeLg="4" key={recipe.id}>
                <RecipeCard
                  recipe={recipe}
                  onFavoriteClick={handleFavoriteClick}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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
      </IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton routerLink="/recipe/new">
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default RecipeListPage; 