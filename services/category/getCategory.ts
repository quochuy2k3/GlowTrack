
export default async function list(page: any): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
        "items": [
            {
                "id": "6780a205fe43afeac1765b86",
                "name": "123",
                "children": []
            }
        ]
    };
  }
  