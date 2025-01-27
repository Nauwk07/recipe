import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
} from '@ionic/react';
import {
  bookOutline,
  heartOutline,
  addOutline,
  starOutline,
  restaurantOutline,
  pizzaOutline,
  iceCreamOutline,
} from 'ionicons/icons';
import { RecipeType } from '../models/Recipe';

const Menu: React.FC = () => {
  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem routerLink="/recipes" routerDirection="none" lines="none">
              <IonIcon slot="start" icon={bookOutline} />
              <IonLabel>Toutes les recettes</IonLabel>
            </IonItem>

            <IonItem routerLink="/recipes?filter=favorites" routerDirection="none" lines="none">
              <IonIcon slot="start" icon={heartOutline} />
              <IonLabel>Mes favoris</IonLabel>
            </IonItem>

            <IonItem routerLink="/recipe/new" routerDirection="none" lines="none">
              <IonIcon slot="start" icon={addOutline} />
              <IonLabel>Nouvelle recette</IonLabel>
            </IonItem>

            <IonItem className="menu-section">
              <IonLabel>Types de recettes</IonLabel>
            </IonItem>

            <IonItem routerLink={`/recipes?type=${RecipeType.STARTER}`} routerDirection="none" lines="none">
              <IonIcon slot="start" icon={restaurantOutline} />
              <IonLabel>Entrées</IonLabel>
            </IonItem>

            <IonItem routerLink={`/recipes?type=${RecipeType.MAIN}`} routerDirection="none" lines="none">
              <IonIcon slot="start" icon={pizzaOutline} />
              <IonLabel>Plats</IonLabel>
            </IonItem>

            <IonItem routerLink={`/recipes?type=${RecipeType.DESSERT}`} routerDirection="none" lines="none">
              <IonIcon slot="start" icon={iceCreamOutline} />
              <IonLabel>Desserts</IonLabel>
            </IonItem>

            <IonItem routerLink="/recipes?sort=rating" routerDirection="none" lines="none">
              <IonIcon slot="start" icon={starOutline} />
              <IonLabel>Meilleures notes</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu; 