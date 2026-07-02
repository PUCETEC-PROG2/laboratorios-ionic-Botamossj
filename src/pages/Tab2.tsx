import React from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Repository } from '../interfaces/Repository';
import { RepositoryPayload } from '../interfaces/RepositoryPayload';
import { createRepository, updateRepository } from '../services/GitHubService';
import './Tab2.css';

const EDIT_REPOSITORY_KEY = 'selectedRepositoryToEdit';
const EMPTY_FORM: RepositoryPayload = { name: '', description: '' };

const Tab2: React.FC = () => {
  const history = useHistory();
  const [formData, setFormData] = React.useState<RepositoryPayload>(EMPTY_FORM);
  const [repositoryToEdit, setRepositoryToEdit] = React.useState<Repository | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  useIonViewWillEnter(() => {
    const savedRepository = sessionStorage.getItem(EDIT_REPOSITORY_KEY);

    if (savedRepository) {
      const repository = JSON.parse(savedRepository) as Repository;
      setRepositoryToEdit(repository);
      setFormData({
        name: repository.name,
        description: repository.description ?? ''
      });
    } else {
      setRepositoryToEdit(null);
      setFormData(EMPTY_FORM);
    }

    setErrorMessage('');
  });

  const saveRepository = async () => {
    const cleanName = formData.name.trim();

    if (!cleanName) {
      setErrorMessage('Debes escribir el nombre del repositorio');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const payload: RepositoryPayload = {
        name: cleanName,
        description: formData.description.trim()
      };

      if (repositoryToEdit) {
        await updateRepository(
          repositoryToEdit.owner.login,
          repositoryToEdit.name,
          payload
        );
      } else {
        await createRepository(payload);
      }

      sessionStorage.removeItem(EDIT_REPOSITORY_KEY);
      setRepositoryToEdit(null);
      setFormData(EMPTY_FORM);
      history.push('/tab1');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(
        repositoryToEdit
          ? `No se pudo actualizar el repositorio: ${message}`
          : `No se pudo crear el repositorio: ${message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    sessionStorage.removeItem(EDIT_REPOSITORY_KEY);
    setRepositoryToEdit(null);
    setFormData(EMPTY_FORM);
    history.push('/tab1');
  };

  const isEditing = repositoryToEdit !== null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isEditing ? 'Actualizar repositorio' : 'Crear repositorio'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="repository-form-wrapper">
          <div className="form-heading">
            <h2>{isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
            <p>
              {isEditing
                ? 'Modifica los datos y guarda los cambios.'
                : 'Completa la información para crear un repositorio en tu cuenta.'}
            </p>
          </div>

          <IonInput
            className="form-control"
            label="Nombre"
            labelPlacement="stacked"
            fill="outline"
            placeholder="ejemplo-proyecto-ionic"
            value={formData.name}
            onIonInput={(event) =>
              setFormData((current) => ({
                ...current,
                name: event.detail.value ?? ''
              }))
            }
          />

          <IonTextarea
            className="form-control"
            label="Descripción"
            labelPlacement="stacked"
            fill="outline"
            placeholder="Describe brevemente el repositorio"
            value={formData.description}
            rows={5}
            onIonInput={(event) =>
              setFormData((current) => ({
                ...current,
                description: event.detail.value ?? ''
              }))
            }
          />

          {errorMessage && (
            <IonText color="danger">
              <p className="form-error">{errorMessage}</p>
            </IonText>
          )}

          <IonButton expand="block" shape="round" onClick={saveRepository} disabled={loading}>
            {isEditing && (
              <div className="edit-mode-message">
                Estás editando un repositorio existente
              </div>
            )}
            {isEditing ? 'Actualizar repositorio' : 'Crear repositorio'}
          </IonButton>

          {isEditing && (
            <IonButton expand="block" fill="clear" color="medium" onClick={cancelEdit}>
              Cancelar edición
            </IonButton>
          )}
        </div>

        {loading && <LoadingSpinner />}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
