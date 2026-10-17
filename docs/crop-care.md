# Trợ lý chăm sóc cây trồng — Backend

Tất cả endpoint có prefix `/api/v1/crop-care`, yêu cầu `Authorization: Bearer <accessToken>` và chỉ truy cập dữ liệu của tài khoản hiện tại.

## Quy trình sử dụng

1. Tạo mẫu chăm sóc cho cây và khu vực qua `POST /templates`.
2. Chọn mẫu từ `GET /templates`, chọn nông trại/mảnh đất và ngày gieo trồng.
3. Gọi `POST /plans` để tạo kế hoạch và các công việc trong 30 ngày tiếp theo.
4. Dùng `GET /plans/:id` xem giai đoạn hiện tại và công việc sắp tới; công việc cũng xuất hiện trong API tasks hiện có.
5. Dùng `POST /plans/:id/sync` cập nhật ngay, hoặc để cron chạy mỗi 6 giờ theo múi giờ Việt Nam.
6. `PATCH /plans/:id` với `{ "active": false }` tạm dừng tạo công việc và nhắc lịch; `true` tiếp tục.

## Mẫu chăm sóc

Ví dụ dưới đây chỉ minh họa cấu trúc API, không phải quy trình nông học đã được xác nhận. Điền lịch, hướng dẫn và ngưỡng thời tiết từ quy trình của cây/giống/khu vực thực tế. Hệ thống chưa cung cấp danh mục cây có sẵn.

```json
{
  "cropName": "Cây thử nghiệm",
  "region": "Khu vực thử nghiệm",
  "source": "Quy trình do người dùng cung cấp",
  "stages": [
    {
      "name": "Giai đoạn đầu",
      "durationDays": 14,
      "rules": [
        {
          "id": "water",
          "action": "watering",
          "day": 0,
          "repeatEveryDays": 2,
          "guidance": "Kiểm tra độ ẩm trước khi tưới theo quy trình của cây.",
          "time": "07:00",
          "rainThresholdMm": 10,
          "heatThresholdC": 35
        },
        {
          "id": "feed",
          "action": "fertilizing",
          "day": 7,
          "guidance": "Bón theo hướng dẫn của giống cây và sản phẩm được sử dụng.",
          "time": "08:00",
          "rainThresholdMm": 10
        }
      ]
    },
    {
      "name": "Giai đoạn sau",
      "durationDays": 14,
      "rules": [
        {
          "id": "prune",
          "action": "pruning",
          "day": 2,
          "guidance": "Tỉa theo quy trình của cây.",
          "time": "08:00",
          "rainThresholdMm": 10
        },
        {
          "id": "harvest",
          "action": "harvesting",
          "day": 13,
          "guidance": "Kiểm tra độ chín thực tế trước thu hoạch.",
          "time": "08:00"
        }
      ]
    }
  ]
}
```

`day` tính từ 0 trong từng giai đoạn; các giai đoạn nối tiếp nhau. Không có `repeatEveryDays` thì công việc chỉ tạo một lần. `id` không được trùng trong giai đoạn; tên giai đoạn không được trùng trong mẫu. Mỗi kế hoạch lưu bản sao mẫu để bảo toàn lịch.

## Tạo kế hoạch

```json
{
  "templateId": "<ObjectId mẫu>",
  "farmId": "<ObjectId nông trại>",
  "plotId": "<ObjectId mảnh đất, có thể bỏ>",
  "plantingDate": "2026-10-07",
  "latitude": 10.75,
  "longitude": 106.7
}
```

Với cây đã trồng, có thể bổ sung `currentStage` đúng tên giai đoạn trong mẫu và `stageStartedOn` là ngày bắt đầu giai đoạn thực tế. Hệ thống điều chỉnh mốc lịch theo lựa chọn đó; không tạo lại công việc trong quá khứ. Nếu không chọn, hệ thống tính giai đoạn từ ngày gieo trồng và thời lượng các giai đoạn.

## Thời tiết và nhắc lịch

- Dự báo 7 ngày theo tọa độ từ [Open-Meteo Forecast API](https://open-meteo.com/en/docs), dùng tổng lượng mưa và nhiệt độ tối đa trong ngày. Cần có kết nối mạng từ backend.
- Khi lượng mưa đạt ngưỡng cấu hình: đánh dấu `weatherBlocked=true` với tưới/bón/tỉa; giữ `status=pending`, tạm ngưng thông báo. Không tự thay đổi ngày công việc. Người dùng thấy `weatherNote` để quyết định thực tế.
- Khi dự báo cập nhật và lượng mưa giảm, bỏ chặn công việc chưa thông báo. Không sửa công việc đã hoàn thành/hủy.
- Khi nhiệt độ đạt ngưỡng: chuyển tưới về 06:00 nếu giờ đó chưa qua. Ngưỡng không được cấu hình thì không áp dụng điều chỉnh tương ứng.
- Khi dịch vụ thời tiết lỗi: vẫn tạo lịch, trả `weatherStatus=unavailable`, giữ điều chỉnh trước đó, thử lại ở lần đồng bộ sau.
- Nhắc lịch dùng Firebase hiện có; cần cấu hình Firebase và FCM token của người dùng. Kế hoạch dừng hoặc công việc bị hoãn do thời tiết sẽ không gửi nhắc.
- Khóa duy nhất `(carePlanId, careKey)` ngăn tạo trùng khi đồng bộ lại. Cần đảm bảo MongoDB đã tạo index trong môi trường triển khai.
- Khi cron phát hiện nông trại/mảnh đất đã bị xóa, tạm dừng kế hoạch và các thông báo của nó.

## Endpoint

| Method | Path            | Chức năng                                                  |
| ------ | --------------- | ---------------------------------------------------------- |
| GET    | /templates      | Liệt kê tối đa 100 mẫu của tài khoản                       |
| POST   | /templates      | Tạo mẫu cây/khu vực                                        |
| GET    | /plans          | Liệt kê tối đa 100 kế hoạch của tài khoản                  |
| POST   | /plans          | Tạo kế hoạch và công việc                                  |
| GET    | /plans/:id      | Chi tiết, giai đoạn hiện tại, tối đa 500 công việc sắp tới |
| PATCH  | /plans/:id      | Tạm dừng/tiếp tục                                          |
| POST   | /plans/:id/sync | Đồng bộ công việc và thời tiết ngay                        |

Chưa có màn hình React Native trong repository này. Frontend cần thêm chọn mẫu/cây, vùng, ngày gieo trồng, giai đoạn và tọa độ; hiển thị trạng thái hoãn cùng hướng dẫn và nút tạm dừng/đồng bộ.
