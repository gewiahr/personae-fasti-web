import { ApiError } from "../types/api";
import { EntityMetaData } from "../types/entities";

interface ErrorPageProps {
    error: ApiError | null;
    entityMeta: EntityMetaData;
};

export const ErrorPage = ({ error, entityMeta } : ErrorPageProps) => {
    let title = `Не удалось загрузить ${entityMeta.EntityNameAcc.toLowerCase()}`;
    let message = "Данные недоступны";

    if (error) {
        if (error.status === 403) {
            // ** Сделать базу строк вывода ** //
            title = `${entityMeta.EntityName} скрыт`;
            if (entityMeta.EntityNameGender === 'f') {
                title += "a" 
            } else if (entityMeta.EntityNameGender === 'n') {
                title += "o" 
            };
            // ** Сделать базу строк вывода ** //
            message = `Данные скрыты игроком, который создал ${entityMeta.EntityNameAcc.toLowerCase()}`; 
        } else if (error.status === 422) {           
            message = "Похоже что запрашиваемые данные относятся к другой игре";
        };
    };

    return (
        <div className="flex flex-1 flex-col justify-center items-center">
            <h2 className="text-xl text-red-500 text-center">{title}</h2>
            <br />
            <p className="text-center">{message}</p>
        </div>
    );
};