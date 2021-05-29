import { SetMetadata } from '@nestjs/common';
import { Permission } from '../guards/permissions.guard';

export const Permissions = (...permissions: (Permission[] | Permission)[]) => {
  return SetMetadata('permissions', permissions);
};
