import { defineStore } from 'pinia';

interface InputTracker {
  value: string;
  valid: boolean;
  init: boolean;
}

export const loginStore = defineStore({
  id: 'login-store',
  state: () => ({
    email: {
      value: '',
      valid: false,
      init: true,
    } as InputTracker,
    password: {
      value: '',
      valid: false,
      init: true,
    } as InputTracker,
    loading: false,
    success: false,
    error: undefined as unknown,
  }),
});
