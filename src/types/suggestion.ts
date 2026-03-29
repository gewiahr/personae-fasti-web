import { formSuggestionRef } from "./entities";

export type SuggestionTabPos = {
  top: number;
  left: number;
}

export type SuggestionData = {
  entities: SuggestionEntity[];
}

export type SuggestionEntity = {
  id: number;
  sid: string;
  type: string;
  name: string;
  hidden: boolean;
}

export type SuggestionEntityRender = {
  id: number;
  sid: string;
  type: string;
  typeName: string;
  ref: string;
  name: string;
  hidden: boolean;
}

export const convertSuggestionDataToRender = (sg: SuggestionData) => {
  return sg.entities.filter((suggestion) => !suggestion.hidden).map((suggestion) => formSuggestionRef(suggestion));
}