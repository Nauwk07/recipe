import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonMenuButton
} from '@ionic/react';
import { add } from 'ionicons/icons';

const RecipeListPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mes Recettes</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/recipe/new">
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Le contenu sera ajouté plus tard */}
      </IonContent>
    </IonPage>
  );
};

export default RecipeListPage; 