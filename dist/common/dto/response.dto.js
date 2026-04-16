"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseDto = void 0;
class ResponseDto {
    statusCode;
    message;
    data;
    meta;
    constructor(statusCode, message, data, meta) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }
}
exports.ResponseDto = ResponseDto;
//# sourceMappingURL=response.dto.js.map