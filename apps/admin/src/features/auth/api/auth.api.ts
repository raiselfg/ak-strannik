import {
  AdminLoginRequestSchema,
  AdminLoginResponseSchema,
  AdminMeResponseSchema,
  type AdminLoginRequest,
} from '@ak-strannik/types';

import { apiClient } from '../../../shared/api/client';

export const authApi = {
  async login(input: AdminLoginRequest) {
    const body = AdminLoginRequestSchema.parse(input);
    const response = await apiClient('/admin/auth/login', {
      method: 'POST',
      body,
    });

    return AdminLoginResponseSchema.parse(response);
  },

  async me(signal?: AbortSignal) {
    const response = await apiClient('/admin/auth/me', { signal });
    return AdminMeResponseSchema.parse(response);
  },

  async logout() {
    await apiClient('/admin/auth/logout', { method: 'POST' });
  },
};
