import { Outlet, useParams, Navigate } from 'react-router-dom';
import { createContext, useContext, useMemo } from 'react';
import { entityConfig, type EntityMetaDataType } from '@/types/entities';

interface EntityContextValue {
  entityType: EntityMetaDataType;
  metaData: (typeof entityConfig)[EntityMetaDataType];
}

const EntityContext = createContext<EntityContextValue | null>(null);

export const useEntityContext = () => {
  const ctx = useContext(EntityContext);
  if (!ctx) throw new Error('useEntityContext must be used inside EntityLayout');
  return ctx;
};

function isEntityType(value: string | undefined): value is EntityMetaDataType {
  return value !== undefined && value in entityConfig;
}

const EntityLayout = () => {
  const { entityType } = useParams();

  if (!isEntityType(entityType)) {
    return <Navigate to="/" replace />;
  }

  const metaData = entityConfig[entityType];

  if (!metaData) return <Navigate to="/" replace />;

  const value = useMemo(() => ({ entityType, metaData }), [entityType, metaData]);

  return (
    <EntityContext.Provider value={value}>
      <Outlet />
    </EntityContext.Provider>
  );
};

export default EntityLayout;