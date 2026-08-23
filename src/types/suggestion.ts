import { formSuggestionRef } from "./entities";

export type SuggestionTabPos = {
  top: number;
  left: number;
}

export type SuggestionData = {
  entities: SuggestionEntity[];
}

export type SuggestionEntity = {
  ext: string;
  sid: string;
  type: string;
  name: string;
  secret: boolean;
}

export type SuggestionEntityRender = {
  ext: string;
  sid: string;
  type: string;
  typeName: string;
  ref: string;
  name: string;
  secret: boolean;
}

export const convertSuggestionDataToRender = (sg: SuggestionData) => {
  return sg.entities.filter((suggestion) => !suggestion.secret).map((suggestion) => formSuggestionRef(suggestion));
}
