import { Data } from 'effect';

import {
  UnauthorizedException,
  ServiceUnavailableException,
  BadGatewayException,
} from '@nestjs/common';

export const mapCustomErrorToNestException = (error: unknown) => {
  if (error instanceof UnauthorizedError) {
    console.log('Mapping UnauthorizedError to UnauthorizedException');
    throw new UnauthorizedException(error.message);
  }
  if (error instanceof ServiceUnavailableError) {
    console.log(
      'Mapping ServiceUnavailableError to ServiceUnavailableException',
    );
    throw new ServiceUnavailableException(error.message);
  }
  // fallback for other unknown errors
  throw new BadGatewayException('An unexpected error occurred.');
};

export class UnauthorizedError extends Data.TaggedError('UnauthorizedError')<{
  message: string;
}> {}

export class ServiceUnavailableError extends Data.TaggedError(
  'ServiceUnavailableError',
)<{
  message: string;
  serviceName: string;
}> {}
