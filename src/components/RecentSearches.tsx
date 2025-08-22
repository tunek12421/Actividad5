import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { time, closeCircle } from 'ionicons/icons';

interface RecentSearchesProps {
  searches: string[];
  onSearchSelect: (city: string) => void;
  onSearchRemove: (city: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ 
  searches, 
  onSearchSelect, 
  onSearchRemove 
}) => {
  if (searches.length === 0) {
    return null;
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IonIcon icon={time} />
          Búsquedas Recientes
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {searches.map((city, index) => (
            <IonChip 
              key={index}
              onClick={() => onSearchSelect(city)}
              style={{ cursor: 'pointer' }}
            >
              <IonLabel>{city}</IonLabel>
              <IonIcon 
                icon={closeCircle} 
                onClick={(e) => {
                  e.stopPropagation();
                  onSearchRemove(city);
                }}
                style={{ cursor: 'pointer' }}
              />
            </IonChip>
          ))}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default RecentSearches;