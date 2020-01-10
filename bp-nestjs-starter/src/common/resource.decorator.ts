import { SetMetadata } from '@nestjs/common';

export const Resource = () => SetMetadata('isResource', true);
