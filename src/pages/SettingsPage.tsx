import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  useIonToast,
} from '@ionic/react';
import { StorageService } from '../services/StorageService';

const SettingsPage: React.FC = () => {
  const [presentToast] = useIonToast();

  const handleClearCache = async () => {
    try {
      await StorageService.clearCache();
      presentToast({
        message: 'Cache nettoyé avec succès',
        duration: 2000,
        color: 'success',
      });
    } catch (error) {
      presentToast({
        message: 'Erreur lors du nettoyage du cache',
        duration: 2000,
        color: 'danger',
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Paramètres</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>Nettoyer le cache</IonLabel>
            <IonButton 
              slot="end" 
              color="danger"
              onClick={handleClearCache}
            >
              Nettoyer
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage; 