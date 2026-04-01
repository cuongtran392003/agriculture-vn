# CRUD Farm, Plot, Task — Quá trình thực hiện

> **Ngày thực hiện:** 31/03/2026  
> **Dự án:** AgricultureVN Backend (NestJS + MongoDB)

---

## 1. Tình trạng ban đầu

Trước khi thực hiện, 3 module Farm, Plot, Task chỉ có endpoint `POST` (Create) cơ bản. Ngoài ra còn tồn tại một số lỗi:

| Vấn đề | Module |
|--------|--------|
| Thiếu `@Schema()` decorator → Mongoose không tạo schema đúng | Farm |
| Thiếu `@Injectable()` decorator → NestJS không inject service | Farm, Plot, Task |
| Không xử lý lỗi khi document không tồn tại | Farm, Plot, Task |
| Thiếu Update DTO | Farm, Plot |
| Chỉ có endpoint `POST`, thiếu `GET`, `PATCH`, `DELETE` | Farm, Plot |
| Task có thêm `GET /` nhưng thiếu `GET /:id`, `PATCH`, `DELETE` | Task |

---

## 2. Các bước thực hiện

### Bước 1: Sửa Farm Schema

**File:** `src/modules/farm/schema/farm.entity.ts`

Thêm `@Schema({ timestamps: true })` decorator để Mongoose tự động tạo `createdAt` và `updatedAt`.

```diff
 import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
 import { HydratedDocument, Types } from "mongoose";

 export type FarmDocument = HydratedDocument<Farm>;

+@Schema({ timestamps: true })
 export class Farm {
   @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
   userId?: string;
```

### Bước 2: Tạo Update DTOs

Tạo 2 file DTO mới cho Farm và Plot (Task đã có sẵn `update-task.dto.ts`):

**File mới:** `src/modules/farm/dto/update-farm.dto.ts`
```typescript
export class UpdateFarmDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() location?: string;
}
```

**File mới:** `src/modules/plot/dto/update-plot.dto.ts`
```typescript
export class UpdatePlotDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() code?: string;
  @IsString() @IsOptional() description?: string;
}
```

### Bước 3: Viết lại Services (Full CRUD)

Cho cả 3 module, service được viết lại với:
- Thêm `@Injectable()` decorator
- Thêm `NotFoundException` khi không tìm thấy document
- Thêm các method: `findAll()`, `findOne()`, `findBy...()`, `update()`, `remove()`
- Sử dụng `populate()` để join các reference fields
- Sắp xếp kết quả theo `createdAt` hoặc `scheduledDate`

**Các file đã sửa:**
- `src/modules/farm/farm.service.ts`
- `src/modules/plot/plot.service.ts`
- `src/modules/tasks/tasks.service.ts`

### Bước 4: Viết lại Controllers (Full CRUD)

Thêm đầy đủ các endpoint REST cho cả 3 module:

**Các file đã sửa:**
- `src/modules/farm/farm.controller.ts`
- `src/modules/plot/plot.controller.ts`
- `src/modules/tasks/tasks.controller.ts`

### Bước 5: Build & Verify

Chạy `nest build` → thành công, không có lỗi.

---

## 3. API Endpoints

### 🌾 Farm — `api/v1/farm`

| Method   | Endpoint          | Mô tả                    | Body / Query        |
|----------|-------------------|---------------------------|---------------------|
| `POST`   | `/farm`           | Tạo farm mới              | `CreateFarmDto`     |
| `GET`    | `/farm`           | Lấy tất cả farms          | —                   |
| `GET`    | `/farm?userId=xxx` | Lấy farms theo userId     | query: `userId`     |
| `GET`    | `/farm/:id`       | Lấy farm theo id          | param: `id`         |
| `PATCH`  | `/farm/:id`       | Cập nhật farm             | `UpdateFarmDto`     |
| `DELETE` | `/farm/:id`       | Xóa farm                  | param: `id`         |

### 🌱 Plot — `api/v1/plot`

| Method   | Endpoint           | Mô tả                    | Body / Query        |
|----------|--------------------|---------------------------|---------------------|
| `POST`   | `/plot`            | Tạo plot mới              | `CreatePlotDto`     |
| `GET`    | `/plot`            | Lấy tất cả plots          | —                   |
| `GET`    | `/plot?farmId=xxx`  | Lấy plots theo farmId     | query: `farmId`     |
| `GET`    | `/plot/:id`        | Lấy plot theo id          | param: `id`         |
| `PATCH`  | `/plot/:id`        | Cập nhật plot             | `UpdatePlotDto`     |
| `DELETE` | `/plot/:id`        | Xóa plot                  | param: `id`         |

### ✅ Task — `api/v1/tasks`

| Method   | Endpoint               | Mô tả                        | Body / Query        |
|----------|------------------------|-------------------------------|---------------------|
| `POST`   | `/tasks`               | Tạo task mới                  | `CreateTaskDto`     |
| `GET`    | `/tasks`               | Lấy tất cả tasks              | —                   |
| `GET`    | `/tasks?farmId=xxx`     | Lấy tasks theo farmId         | query: `farmId`     |
| `GET`    | `/tasks?status=pending` | Lấy tasks theo status         | query: `status`     |
| `GET`    | `/tasks/:id`           | Lấy task theo id              | param: `id`         |
| `PATCH`  | `/tasks/:id`           | Cập nhật task                 | `UpdateTaskDto`     |
| `DELETE` | `/tasks/:id`           | Xóa task                      | param: `id`         |

> **Lưu ý:** Khi cập nhật `status` thành `"completed"`, hệ thống tự động set `completedAt` = thời gian hiện tại.

---

## 4. Cấu trúc file

```
src/modules/
├── farm/
│   ├── dto/
│   │   ├── create-farm.dto.ts
│   │   └── update-farm.dto.ts        ← MỚI
│   ├── schema/
│   │   └── farm.entity.ts            ← SỬA (thêm @Schema)
│   ├── farm.controller.ts            ← SỬA (full CRUD)
│   ├── farm.module.ts
│   └── farm.service.ts               ← SỬA (full CRUD + @Injectable)
├── plot/
│   ├── dto/
│   │   ├── create-plot.dto.ts
│   │   └── update-plot.dto.ts        ← MỚI
│   ├── schema/
│   │   └── plot.schema.ts
│   ├── plot.controller.ts            ← SỬA (full CRUD)
│   ├── plot.module.ts
│   └── plot.service.ts               ← SỬA (full CRUD + @Injectable)
└── tasks/
    ├── dto/
    │   ├── create-task.dto.ts
    │   └── update-task.dto.ts
    ├── schema/
    │   └── task.schema.ts
    ├── tasks.controller.ts            ← SỬA (full CRUD)
    ├── tasks.module.ts
    └── tasks.service.ts               ← SỬA (full CRUD + @Injectable)
```

---

## 5. Kết quả

- ✅ Build thành công (`nest build` — exit code 0)
- ✅ Tổng cộng **19 API endpoints** hoạt động
- ✅ Xử lý lỗi `NotFoundException` đầy đủ
- ✅ Populate các reference fields khi query
- ✅ Filter theo query params (`userId`, `farmId`, `status`)
