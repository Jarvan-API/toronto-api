import { ApiBadGatewayResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { DefaultApiResponse, ExceptionDTO } from "src/application/dtos";

export const GenericSwagger = (options: { summary: string; responseDto?: any; deprecated?: boolean; apiParam?: string; apiQuery?: any; body?: any }): MethodDecorator => {
  return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    const { summary, responseDto, deprecated, apiParam, apiQuery, body } = options;
    const type = responseDto || DefaultApiResponse;

    ApiOperation({ summary, deprecated })(target, key, descriptor);
    ApiOkResponse({ description: "Success", type })(target, key, descriptor);
    ApiBadGatewayResponse({ description: "Bad request", type: ExceptionDTO })(target, key, descriptor);
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ExceptionDTO })(target, key, descriptor);

    if (apiParam) ApiParam({ name: apiParam, type: "string" })(target, key, descriptor);
    if (apiQuery) ApiQuery({ name: apiQuery })(target, key, descriptor);
    if (body) ApiBody({ type: body })(target, key, descriptor);
  };
};
