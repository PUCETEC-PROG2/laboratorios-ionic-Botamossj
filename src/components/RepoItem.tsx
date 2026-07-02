import React from 'react';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon
} from '@ionic/react';
import { createOutline, logoGithub, trashOutline } from 'ionicons/icons';
import { Repository } from '../interfaces/Repository';
import './RepoItem.css';

interface RepoItemProps {
  repository: Repository;
  onEdit: (repository: Repository) => void;
  onDelete: (repository: Repository) => void;
}

const RepoItem: React.FC<RepoItemProps> = ({ repository, onEdit, onDelete }) => (
  <IonCard className="repository-card">
    <IonCardHeader>
      <div className="repository-title-row">
        <div>
          <IonCardTitle>{repository.name}</IonCardTitle>
          <IonCardSubtitle>@{repository.owner.login}</IonCardSubtitle>
        </div>
        <IonBadge color={repository.private ? 'medium' : 'success'}>
          {repository.private ? 'Privado' : 'Público'}
        </IonBadge>
      </div>
    </IonCardHeader>

    <IonCardContent>
      <p className="repository-description">
        {repository.description || 'Este repositorio no tiene descripción.'}
      </p>

      {repository.language && (
        <p className="repository-language">
          Lenguaje principal: <strong>{repository.language}</strong>
        </p>
      )}

      <div className="repository-actions">
        <IonButton size="small" fill="outline" onClick={() => onEdit(repository)}>
          <IonIcon slot="start" icon={createOutline} />
          Editar
        </IonButton>

        <IonButton
          size="small"
          fill="outline"
          color="danger"
          onClick={() => onDelete(repository)}
        >
          <IonIcon slot="start" icon={trashOutline} />
          Eliminar
        </IonButton>

        <IonButton
          size="small"
          fill="clear"
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IonIcon slot="start" icon={logoGithub} />
          Abrir
        </IonButton>
      </div>
    </IonCardContent>
  </IonCard>
);

export default RepoItem;
