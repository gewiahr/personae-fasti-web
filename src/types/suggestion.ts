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
    typeName: string;
    ref: string;
    name: string;
    hidden: boolean;
}