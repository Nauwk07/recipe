import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/react';
import { useParams } from 'react-router-dom';

const RecipeFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/recipes" />
          </IonButtons>
          <IonTitle>{isEditing ? 'Modifier la recette' : 'Nouvelle recette'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Le contenu sera ajouté plus tard */}
      </IonContent>
    </IonPage>
  );
};

export default RecipeFormPage; 