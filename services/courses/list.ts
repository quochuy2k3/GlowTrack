import { Course } from "@/models";

export default async function list(): Promise<Course[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
        "id": "67b44bca9e318930a095e0eb",
        "title": "Gia test tạo khóa học",
        "coverImageUrl": null,
        "source": "course",
        "programSources": [],
        "programSourcesObj": [],
        "totalLearnedContents": 0,
        "totalContents": 1,
        "dueDateAt": null,
        "status": "readyToStart",
        "isFavorite": false
    },
    {
        "id": "67aef92c3d442bfa81858370",
        "title": "tét trạng thái",
        "coverImageUrl": null,
        "source": "course",
        "programSources": [],
        "programSourcesObj": [],
        "duration": 120,
        "completionDeadline": 120,
        "totalLearnedContents": 0,
        "totalContents": 2,
        "dueDateAt": null,
        "status": "readyToStart",
        "isFavorite": false
    },
    {
        "id": "6788b54a3ba31f26466e1120",
        "title": "Gia test all ",
        "coverImage": "6788b3e90f96cb0637c6ceeb",
        "coverImageUrl": "https://p.tanca.vn/media/api/v1/upload/6788b3e90f96cb0637c6ceeb",
        "source": "course",
        "programSources": [],
        "programSourcesObj": [],
        "duration": 600,
        "completionDeadline": 14400,
        "totalLearnedContents": 24,
        "totalContents": 20,
        "dueDateAt": "2025-01-26T07:49:28.257Z",
        "status": "completed",
        "isFavorite": true
    },
    {
        "id": "67809e2f64f01ddabe9f373e",
        "title": "Khóa học Devops cho người mới",
        "coverImage": "67809e0a06aa7e2bb8e94060",
        "coverImageUrl": "https://p.tanca.vn/media/api/v1/upload/67809e0a06aa7e2bb8e94060",
        "source": "course",
        "programSources": [
            "67809e1b64f01ddabe9f3736",
            "67809e2064f01ddabe9f3738"
        ],
        "programSourcesObj": [
            {
                "id": "67809e1b64f01ddabe9f3736",
                "name": "Youtube"
            },
            {
                "id": "67809e2064f01ddabe9f3738",
                "name": "Google"
            }
        ],
        "duration": 20160,
        "completionDeadline": 28800,
        "totalLearnedContents": 1,
        "totalContents": 1,
        "dueDateAt": "2025-03-04T03:11:44.559Z",
        "status": "completed",
        "isFavorite": true
    },
    {
        "id": "67496571108013e156ef098d",
        "title": "Bài tập",
        "coverImageUrl": null,
        "source": "course",
        "programSources": [],
        "programSourcesObj": [],
        "totalLearnedContents": 1,
        "totalContents": 4,
        "dueDateAt": null,
        "status": "inProgress",
        "isFavorite": false
    }
]
}
