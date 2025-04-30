import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiResponseHandler {
    static successResponse<T>(data: T, message = 'Request successful') {
        return {
            success: true,
            message: `${HttpStatus.OK} - ${message}`,
            data,
        };
    }

    static errorResponse(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
        throw new HttpException(
            {
                success: false,
                message: `${statusCode} - ${message}`,
            },
            statusCode,
        );
    }
}