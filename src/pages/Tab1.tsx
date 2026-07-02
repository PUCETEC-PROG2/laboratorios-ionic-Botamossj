import React from 'react';
import {
  IonAlert,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
  RefresherEventDetail,
  useIonViewWillEnter
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import RepoItem from '../components/RepoItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { Repository } from '../interfaces/Repository';
import { deleteRepository, fetchRepositories } from '../services/GitHubService';
import './Tab1.css';

const EDIT_REPOSITORY_KEY = 'selectedRepositoryToEdit';

const Tab1: React.FC = () => {
  const history = useHistory();
  const [repositories, setRepositories] = React.useState<Repository[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [repositoryToDelete, setRepositoryToDelete] = React.useState<Repository | null>(null);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastColor, setToastColor] = React.useState<'success' | 'danger'>('success');

  const showToast = (message: string, color: 'success' | 'danger' = 'success') => {
    setToastMessage(message);
    setToastColor(color);
  };

  const loadRepositories = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await fetchRepositories();
      setRepositories(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(`No se pudieron cargar los repositorios: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    sessionStorage.removeItem(EDIT_REPOSITORY_KEY);
    loadRepositories();
  });

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadRepositories();
    event.detail.complete();
  };

  const handleEdit = (repository: Repository) => {
    sessionStorage.setItem(EDIT_REPOSITORY_KEY, JSON.stringify(repository));
    history.push('/tab2');
  };

  const confirmDelete = async () => {
    if (!repositoryToDelete) return;

    const selectedRepository = repositoryToDelete;
    setRepositoryToDelete(null);

    try {
      await deleteRepository(selectedRepository.owner.login, selectedRepository.name);
      setRepositories((current) =>
        current.filter((repository) => repository.id !== selectedRepository.id)
      );
      showToast(`Repositorio "${selectedRepository.name}" eliminado`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showToast(`No se pudo eliminar: ${message}`, 'danger');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent pullingText="Desliza para actualizar" refreshingText="Actualizando..." />
        </IonRefresher>

        <section className="repositories-summary">
          <h2>Proyectos de GitHub</h2>
          <p>{repositories.length} repositorios encontrados</p>
        </section>

        {loading && <LoadingSpinner />}

        {!loading && repositories.length > 0 && (
          <IonList className="repositories-list" lines="none">
            {repositories.map((repository) => (
              <RepoItem
                key={repository.id}
                repository={repository}
                onEdit={handleEdit}
                onDelete={setRepositoryToDelete}
              />
            ))}
          </IonList>
        )}

        {!loading && !errorMessage && repositories.length === 0 && (
          <div className="empty-state">
            <h3>No hay repositorios</h3>
            <p>Crea uno desde la pestaña Gestionar.</p>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="error-state">
            <IonText color="danger">
              <p>{errorMessage}</p>
            </IonText>
          </div>
        )}

        <IonAlert
          isOpen={repositoryToDelete !== null}
          header="Confirmar eliminación"
          message={`¿Deseas eliminar "${repositoryToDelete?.name}"? Esta acción no se puede deshacer.`}
          onDidDismiss={() => setRepositoryToDelete(null)}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Eliminar', role: 'destructive', handler: confirmDelete }
          ]}
        />

        <IonToast
          isOpen={toastMessage !== ''}
          message={toastMessage}
          duration={2200}
          color={toastColor}
          position="top"
          onDidDismiss={() => setToastMessage('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
