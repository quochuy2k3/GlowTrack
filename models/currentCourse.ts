export type CreatorObj = {
    id: string;
    name: string;
    username: string;
    type: string;
}

export type AuthorObj = {
    id: string;
    name: string;
    username: string;
    type: string;
}

export type TargetLearnerObj = {
    id: string;
    name: string;
    type: string;
    username?: string;
}

export type ContentObj = {
    id: string;
    title: string;
    description: string;
    content: string;
    source: string;
    sourceUrl: string;
    thumbUrl: string | null;
    type: string;
}

export type NextContent = {
    id: string;
    course: string;
    content: string;
    position: number;
    section: string;
    title: string;
    type: string;
    contentType: string;
    contentTypeExplanation: string;
    contentObj: ContentObj;
}

export type CurrentCourse = {
    id: string;
    title: string;
    coverImageUrl: string | null;
    description: string;
    type: string;
    creator: string;
    creatorObj: CreatorObj;
    authors: string[];
    authorsObj: AuthorObj[];
    skills: any[];
    skillsObj: any[];
    targetLearnersObj: TargetLearnerObj[];
    programSources: any[];
    programSourcesObj: any[];
    courseCategories: any[];
    courseCategoriesObj: any[];
    avgRating: number;
    totalRatings: number;
    requiredAnswerQuestion: boolean;
    requiredLearning: boolean;
    isDisplayComments: boolean;
    deliveryMethod: string;
    createdAt: string;
    amountLearnedContent: number;
    totalContent: number;
    nextContent: NextContent;
}
