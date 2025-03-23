import { Course } from "@/models";
import list from "./list";

export default async function getDetail(id: string): Promise<any> {
  const courses = await list();

  const course = courses.find((course) => course.id === id);
  if (!course) {
    throw new Error("Course not found");
  }

  const tempData ={
    "id": "6788b54a3ba31f26466e1120",
    "title": "Gia test all ",
    "coverImage": "6788b3e90f96cb0637c6ceeb",
    "coverImageUrl": "https://p.tanca.vn/media/api/v1/upload/6788b3e90f96cb0637c6ceeb",
    "description": "TLDRFrontend Masters has made significant contributions totaling $363,806 to support open source projects, emphasizing their commitment to the developer community.",
    "type": "course",
    "creator": "NitJpeJuvAx3ZcawJ",
    "creatorObj": {
        "id": "NitJpeJuvAx3ZcawJ",
        "name": "Nhảy cùng cơn gió hồng",
        "username": "+84112233444",
        "type": "user"
    },
    "authors": [
        "6417cd18cd623y1Mv"
    ],
    "authorsObj": [
        {
            "id": "6417cd18cd623y1Mv",
            "name": "Nguyễn Thị Mai Mai",
            "username": "+84333333334",
            "type": "user"
        }
    ],
    "skills": [
        "678602cf14349158ae1fdd41"
    ],
    "skillsObj": [
        {
            "id": "678602cf14349158ae1fdd41",
            "name": "Quản Lý Bán Hàng",
            "description": ""
        }
    ],
    "targetLearnersObj": [
        {
            "id": "635647cb6840efa659014453",
            "name": "phong ban vtn và vinh long",
            "type": "department"
        },
        {
            "id": "637451bd121c000011000bd6",
            "name": "Kỹ thuật",
            "type": "department"
        },
        {
            "id": "63eaf0f6a92a5aec280b3742",
            "name": "123123123",
            "type": "department"
        },
        {
            "id": "64e723c1863b53c9ec0daba2",
            "name": "bap-po",
            "type": "department"
        },
        {
            "id": "6540b2f9817867802f04dee2",
            "name": "Phòng Ban Nguyễn Đình Phong",
            "type": "department"
        },
        {
            "id": "656cac713abd1687a71390be",
            "name": "Dat Test",
            "type": "department"
        },
        {
            "id": "6577df50b49e625cfc0d7955",
            "name": "Văn phòng miền Nam và miền trung",
            "type": "department"
        },
        {
            "id": "6375e6815d25eac4f5026813",
            "name": "Phòng quản trị tài chính Phòng quản trị tài chính Phòng quản trị tài chính",
            "type": "department"
        },
        {
            "id": "63e9f54858f922ce520d4845",
            "name": "O Ó O",
            "type": "department"
        },
        {
            "id": "63eb435f914f3faa7b059a78",
            "name": "phong ban moi cua nhon 4",
            "type": "department"
        },
        {
            "id": "641961add15fe2c30c01f1df",
            "name": "Sales",
            "type": "department"
        },
        {
            "id": "64b9608a9dbc1c3e7a00fdc9",
            "name": "tewst",
            "type": "department"
        },
        {
            "id": "656cac6cb7cf1af6c757c087",
            "name": "Dat Test",
            "type": "department"
        },
        {
            "id": "636d30bb49d15dfef60f5199",
            "name": "test phong ban role chi nhanh",
            "type": "department"
        },
        {
            "id": "63dc7da2743cd7565606b5df",
            "name": "chi nhánh này mới tạo 222",
            "type": "department"
        },
        {
            "id": "63eaf11ef242d4969e02c212",
            "name": "123123",
            "type": "department"
        },
        {
            "id": "63eb39c02731f7a6550d8de4",
            "name": "chi nhánh của nhon nè",
            "type": "department"
        },
        {
            "id": "64102ce5d13ba4e5420732f7",
            "name": "An ninh",
            "type": "department"
        },
        {
            "id": "641281f2491904901e00ac64",
            "name": "Phòng ban mới toanh luôn",
            "type": "department"
        },
        {
            "id": "647d8cde6ec523adcd0e5416",
            "name": "phong ban nlx",
            "type": "department"
        },
        {
            "id": "634628b7bd4e61bf650fdfc9",
            "name": "Bảo vệ",
            "type": "department"
        },
        {
            "id": "6355615a36b59026d3044905",
            "name": "phong ban mien bac mien trung",
            "type": "department"
        },
        {
            "id": "635633d928c0eb68a3023a42",
            "name": "phong ban vinh long x va test mien trung",
            "type": "department"
        },
        {
            "id": "635971806a38243a9c093166",
            "name": "phong ban mien trung xyz",
            "type": "department"
        },
        {
            "id": "636cc4f0d3430e2f46086614",
            "name": "phong ban chi nhanh up",
            "type": "department"
        },
        {
            "id": "6406a96c07c63fbaf105b97f",
            "name": "phòng ban nọ",
            "type": "department"
        },
        {
            "id": "64c210a3ed007305bd0100e4",
            "name": "bap",
            "type": "department"
        },
        {
            "id": "64d1f926951cddce9707d3e4",
            "name": "bap test noti",
            "type": "department"
        },
        {
            "id": "64e5d7841cc2aa0eee069113",
            "name": "BAN GIÁM ĐỐC",
            "type": "department"
        },
        {
            "id": "656cac723abd1687a71390c0",
            "name": "Dat Test",
            "type": "department"
        },
        {
            "id": "656cacaf2c6b5ad71d1b738a",
            "name": "Dat Test",
            "type": "department"
        },
        {
            "id": "635545e75ae4fda223076833",
            "name": "Marketing",
            "type": "department"
        },
        {
            "id": "63556042f1aa83d6990501bd",
            "name": "phong ban xd 1.1 1.0",
            "type": "department"
        },
        {
            "id": "63e31637b77b2c30b305e7f4",
            "name": "jnj",
            "type": "department"
        },
        {
            "id": "6406bd3674f152f5120da58c",
            "name": "TEST",
            "type": "department"
        },
        {
            "id": "641961adef279e2f5d0d90a1",
            "name": "Director",
            "type": "department"
        },
        {
            "id": "641bbebbf4730dfe890c4012",
            "name": "Phòng ban Cấp cao",
            "type": "department"
        },
        {
            "id": "64cb6b03dc73ef8b4b0298f6",
            "name": "Phòng của mỹ tiên",
            "type": "department"
        },
        {
            "id": "637451bd121c000011000bd8",
            "name": "Marketing 2",
            "type": "department"
        },
        {
            "id": "6375e690144e4f26600ef427",
            "name": "Đối ngoại",
            "type": "department"
        },
        {
            "id": "63eaf0eaed7709bb27036242",
            "name": "adw",
            "type": "department"
        },
        {
            "id": "6412826aa10c932d0d0e7165",
            "name": "Phòng ban mới nhưng có chi nhánh",
            "type": "department"
        },
        {
            "id": "648ae68699547b559f0471ec",
            "name": "bap test",
            "type": "department"
        },
        {
            "id": "656cac92df038e11988a38e3",
            "name": "Dat Test",
            "type": "department"
        },
        {
            "id": "6577e0201c622618e40d65db",
            "name": "miền nam và miền trung",
            "type": "department"
        },
        {
            "id": "62fc52bf247438a9280dc21d",
            "name": "Customer Service",
            "type": "department"
        },
        {
            "id": "647d8d07f2d7465d130c49e7",
            "name": "phong ban hff",
            "type": "department"
        },
        {
            "id": "647d8d819fa390fdaa01e30b",
            "name": "phong ban av",
            "type": "department"
        },
        {
            "id": "648a8fd782d2f8ed5107c755",
            "name": "phong ban bap",
            "type": "department"
        },
        {
            "id": "6514f368edde34e3370ee8c3",
            "name": "Phòng Ban Của Phong Client",
            "type": "department"
        },
        {
            "id": "651e8374798a3d29c3065a34",
            "name": "CNTT Demo1122",
            "type": "department"
        },
        {
            "id": "656ca91cb7cf1af6c757c081",
            "name": "Dat Test",
            "type": "department"
        },
        {
            "id": "656ca92ab7cf1af6c757c083",
            "name": "Dat Test",
            "type": "department"
        },
        {
            "id": "656cac6bb7cf1af6c757c085",
            "name": "Dat Test",
            "type": "department"
        },
        {
            "id": "6355608b686ef2293104fa33",
            "name": "phong ban mien bac tanca xd 1.1",
            "type": "department"
        },
        {
            "id": "6375e66b9407d7147803a352",
            "name": "Ban điều hành hành hành hành hành hành hành hành hành hành hành hành",
            "type": "department"
        },
        {
            "id": "63b3e8545c63247fc103f027",
            "name": "phong nhy nho",
            "type": "department"
        },
        {
            "id": "63eb3f87a89b32b5930ab156",
            "name": "phong ban cua nhon 2.1",
            "type": "department"
        },
        {
            "id": "63eb424c6ac1b1c1ab09fe88",
            "name": "phòng ban mới của nhon 3",
            "type": "department"
        },
        {
            "id": "64006d158445a1ff9309439f",
            "name": "dev01",
            "type": "department"
        },
        {
            "id": "64102360ccba64a5ef0a32e6",
            "name": "điệp viên",
            "type": "department"
        },
        {
            "id": "646c688c72df606e6c075039",
            "name": "phong ban nhn",
            "type": "department"
        },
        {
            "id": "64a3919fa1af13eaea05880b",
            "name": "1",
            "type": "department"
        },
        {
            "id": "64a4ed593605fb19240ae2d8",
            "name": "a",
            "type": "department"
        },
        {
            "id": "6526639f6721c778570614bc",
            "name": "bap_test_noti_6",
            "type": "department"
        },
        {
            "id": "659cd01eb1cf8979925429a0",
            "name": "Đạt test tạo department internal",
            "type": "department"
        },
        {
            "id": "666127f9d5277c3be70fbd84",
            "name": "CEO",
            "type": "department"
        },
        {
            "id": "666127f9d5277c3be70fbd87",
            "name": "Social media assistant",
            "type": "department"
        },
        {
            "id": "666127f9d5277c3be70fbd89",
            "name": "Marketing and Sales",
            "type": "department"
        },
        {
            "id": "666127f9d5277c3be70fbd8d",
            "name": "Human Resources",
            "type": "department"
        },
        {
            "id": "666127fb92e3511d0d02f092",
            "name": "Engineering",
            "type": "department"
        },
        {
            "id": "666127fb92e3511d0d02f099",
            "name": "Information Technology",
            "type": "department"
        },
        {
            "id": "666127fceb2fd5ed1d043954",
            "name": "Research and Development",
            "type": "department"
        },
        {
            "id": "669e26253e39570c120ad804",
            "name": "Sale",
            "type": "department"
        },
        {
            "id": "67652ba72a397ce18e00961d",
            "name": "mới mới",
            "type": "department"
        }
    ],
    "programSources": [],
    "programSourcesObj": [],
    "courseCategories": [
        "67809e2664f01ddabe9f373c"
    ],
    "courseCategoriesObj": [
        {
            "id": "67809e2664f01ddabe9f373c",
            "name": "Product"
        }
    ],
    "avgRating": 4,
    "totalRatings": 1,
    "duration": 600,
    "completionDeadline": 14400,
    "requiredAnswerQuestion": false,
    "requiredLearning": true,
    "isDisplayComments": true,
    "deliveryMethod": "online",
    "createdAt": "2025-01-16T07:29:14.801Z",
    "isFavorite": true,
    "totalFavorite": 1,
    "dueDateAt": "2025-01-26T07:49:28.257Z",
    "status": "completed"
}
  return tempData;
}
