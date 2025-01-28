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
} from 'ionicons/icons';

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
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu; 