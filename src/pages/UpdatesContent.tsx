type ServiceUpdateInfo = {
  currentVersion: string;
  updates: ServiceUpdateInfoItem[];
}

type ServiceUpdateInfoItem = {
  version: string;
  content: string;
}

const UpdatesContent = () => {
  const updates: ServiceUpdateInfo | null = null;
  
  return (
    updates === null ? <p>
      Информация о версиях недоступна
    </p> :
    <div>
      <p>Актуальная информация о обновлениях и исправлениях</p>
    </div>
  )
};

export default UpdatesContent;
