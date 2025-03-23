export type Course = {
    id?: string;
    title?: string;
    coverImage?: string;
    coverImageUrl?: string | null;
    source?: string;
    programSources?: string[];
    programSourcesObj?: {
        id: string;
        name: string;
    }[];
    duration?: number;
    completionDeadline?: number;
    totalContents?: number;
    dueDateAt?: string | null;
    status?: 'completed' | 'inProgress' | 'readyToStart';
    isFavorite?: boolean;
    totalLearnedContents?:number;
    totalContent?:number;
}

export type Widget = {
    id?: number;
    name?: string;
    code?: string;
    dataObj?: Course[];
}
