# API quản lý cây trồng

Prefix: `/api/v1/crops`. Tất cả endpoint yêu cầu `Authorization: Bearer <accessToken>`.
Danh mục cây thuộc từng tài khoản; backend lấy `userId` từ JWT, không nhận từ body.

| Method | Endpoint          | Chức năng                                     |
| ------ | ----------------- | --------------------------------------------- |
| POST   | /api/v1/crops     | Tạo cây trồng                                 |
| GET    | /api/v1/crops     | Danh sách có phân trang, tìm kiếm và lọc vùng |
| GET    | /api/v1/crops/:id | Chi tiết cây trồng                            |
| PATCH  | /api/v1/crops/:id | Cập nhật một phần                             |
| DELETE | /api/v1/crops/:id | Xóa cây trồng                                 |

## Tạo cây

```json
{
  "name": "Cà chua",
  "variety": "Giống do người dùng lựa chọn",
  "description": "Thông tin và ghi chú về cây",
  "regions": ["Miền Nam"]
}
```

- `name`: bắt buộc, tối đa 100 ký tự, không chấp nhận chỉ khoảng trắng.
- `variety`: tùy chọn, tối đa 100 ký tự, không chấp nhận rỗng khi truyền.
- `description`: tùy chọn, tối đa 2000 ký tự; truyền `""` để xóa mô tả.
- `regions`: tùy chọn, mặc định `[]`, tối đa 20 vùng; mỗi vùng tối đa 100 ký tự và không trùng/rỗng. Truyền `[]` để xóa danh sách vùng.
- Tên, giống và vùng được bỏ khoảng trắng ở đầu/cuối. Các trường không nhận `null`.
- Cho phép cây cùng tên để quản lý các giống và ghi chú khác nhau.

POST trả HTTP 201, `message: "Đã tạo cây trồng"` và bản ghi trong `data` gồm `_id`, `userId`, các trường đã nhập và timestamps.

## Danh sách

Ví dụ: `GET /api/v1/crops?page=1&limit=10&search=cà&region=Miền%20Nam` (URL-encode tham số khi gọi).

- `page`: số nguyên từ 1, mặc định 1.
- `limit`: 1–100, mặc định 10.
- `search`: tìm chuỗi trong tên hoặc giống, không phân biệt hoa/thường; không loại bỏ dấu tiếng Việt. Ký tự regex được xử lý như văn bản thường.
- `region`: khớp chính xác một vùng trong `regions`.
- Sắp xếp theo thời điểm tạo mới nhất; `meta` gồm `page`, `limit`, `total`, `totalPages`, `hasNextPage`, `hasPrevPage`.

## Cập nhật và lỗi

PATCH nhận các trường giống POST; chỉ các trường được gửi mới cập nhật. Không thể đổi chủ sở hữu bằng body.

- 400: dữ liệu hoặc tham số phân trang không hợp lệ, `message` là danh sách lỗi.
- 401: thiếu hoặc sai JWT.
- 404: ID sai định dạng, cây không tồn tại hoặc thuộc tài khoản khác.

DELETE chỉ xóa bản ghi trong danh mục này. Các công việc và mẫu chăm sóc hiện dùng tên cây/bản sao lịch riêng nên vẫn giữ nguyên. API này quản lý danh mục cây, còn ngày gieo trồng và giai đoạn được quản lý bằng `/api/v1/crop-care/plans`.
