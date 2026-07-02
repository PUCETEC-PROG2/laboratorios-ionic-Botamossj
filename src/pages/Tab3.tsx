import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import LoadingSpinner from '../components/LoadingSpinner';
import { GithubUser } from '../interfaces/GithubUser';
import { fetchUserInfo } from '../services/GitHubService';
import './Tab3.css';

const Tab3: React.FC = () => {
  const [userInfo, setUserInfo] = React.useState<GithubUser | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  useIonViewWillEnter(() => {
    const loadProfile = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        setUserInfo(await fetchUserInfo());
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setErrorMessage(`No se pudo cargar el perfil: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi perfil de GitHub</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="profile-container">
          {userInfo && (
            <IonCard className="profile-card">
              <img className="profile-avatar" src={userInfo.avatar_url} alt={userInfo.login} />
              <IonCardHeader>
                <IonCardTitle>{userInfo.name || userInfo.login}</IonCardTitle>
                <IonCardSubtitle>@{userInfo.login}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{userInfo.bio || 'No hay una biografía registrada en GitHub.'}</p>
                <div className="profile-stat">
                  <span>Repositorios públicos</span>
                  <strong>{userInfo.public_repos ?? 0}</strong>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {errorMessage && (
            <IonText color="danger">
              <p>{errorMessage}</p>
            </IonText>
          )}
        </div>

        {loading && <LoadingSpinner />}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
