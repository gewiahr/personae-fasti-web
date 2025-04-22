export type MentionableEntity = {
    id: string;
    name: string;
    type: 'character' | 'place';
};

export type MentionOld = {
    id: string;
    entityId: string;
    display: string;
    type: 'character' | 'place';
    start: number;
    end: number;
};

