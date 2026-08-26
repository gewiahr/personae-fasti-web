export type ValidationErrors = Record<string, string>;

export const ENTITY_FIELD_LIMITS = {
  name: 100,
  title: 200,
  description: 20_000,
} as const;

export const countSymbols = (value: string): number => Array.from(value).length;

export const validateEntityFields = (entity: {
  name?: string;
  title?: string;
  description?: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};
  const name = entity.name ?? '';
  const title = entity.title ?? '';
  const description = entity.description ?? '';

  if (name.trim() === '') {
    errors.name = 'Введите название';
  } else if (countSymbols(name.trim()) > ENTITY_FIELD_LIMITS.name) {
    errors.name = 'Не больше 100 символов';
  }
  if (countSymbols(title.trim()) > ENTITY_FIELD_LIMITS.title) {
    errors.title = 'Не больше 200 символов';
  }
  if (countSymbols(description) > ENTITY_FIELD_LIMITS.description) {
    errors.description = 'Описание не может быть длиннее 20000 символов';
  }

  return errors;
};
