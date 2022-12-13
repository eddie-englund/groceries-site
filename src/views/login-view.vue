<script lang="ts" setup>
import { loginStore } from '@/stores/login-store';
import { validateSafeT } from '../api/safe-parse';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { watch } from 'vue';
import buttonComponent from '@/components/button-component.vue';
import { emailSchema, passwordSchema, login } from '@/api/auth/index';
import type { z } from 'zod';
import { saveRefreshToken, saveSessionToken } from '@/util/jwt-utils';
import { useRouter } from 'vue-router';

const loginState = loginStore();
const router = useRouter();

const handleSubmit = async () => {
  if (!loginState.email.valid || !loginState.password.valid) return;
  loginState.loading = true;
  await pipe(
    TE.Do,
    TE.bind('login', () =>
      login({
        email: loginState.email.value,
        password: loginState.password.value,
      }),
    ),
    TE.bind('refreshToken', ({ login }) => saveRefreshToken(login.data.refreshToken)),
    TE.map(({ login }) => {
      console.log('success, logged in.');
      loginState.success = true;
      loginState.error = undefined;
      saveSessionToken(login.data.sessionToken);
      router.push('/');
    }),
    TE.mapLeft((err) => {
      console.error('left', err);
      loginState.success = false;
      loginState.error = err;
    }),
  )();
  loginState.loading = false;
};

const validateString = async (value: string, validator: z.ZodString, key: 'email' | 'password') => {
  await pipe(
    validateSafeT(value, validator),
    TE.mapLeft(() => (loginState[key].valid = false)),
    TE.map(() => (loginState[key].valid = true)),
  )();
  loginState[key].init = false;
};

watch(loginState.email, ({ value }) => validateString(value, emailSchema, 'email'));
watch(loginState.password, ({ value }) => validateString(value, passwordSchema, 'password'));
</script>

<template>
  <main class="login-container">
    <div class="upper-content-container">
      <h1>Welcome <span>♥</span></h1>
      <p>Sign in to get started</p>
    </div>
    <div class="form-container">
      <div class="form-item-container email">
        <label for="email">Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email..."
          v-model="loginState.email.value"
          :min="1"
          :max="256"
          @invalid="!loginState.email.valid"
        />
        <p :class="!loginState.email.init && !loginState.email.valid ? 'valid' : 'invalid'">
          Invalid email.
        </p>
      </div>
      <div class="form-item-container password">
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password..."
          v-model="loginState.password.value"
          :min="6"
          :max="256"
          @invalid="!loginState.password.valid"
        />
        <p :class="!loginState.password.init && !loginState.password.valid ? 'valid' : 'invalid'">
          Password must be at minimum 6 characters.
        </p>
      </div>
      <button-component
        msg="Sign in"
        :disabled="!loginState.email.valid || !loginState.password.valid"
        @click.prevent="handleSubmit"
      />
      <p class="note">If you don't have an account, please contact your admin to get one.</p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use '@/scss/colors.scss' as c;
@use '@/scss/text.scss' as t;
.upper-content-container {
  text-align: center;
  margin-top: 5rem;

  span {
    color: #f03a17;
  }
}

.note {
  text-align: center;
  width: 80%;
  font-weight: t.$light;
}

.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 100%;
  margin-top: 10%;

  .button-container {
    width: 80%;
  }
}

.form-item-container {
  display: flex;
  flex-direction: column;
  width: 80%;

  label {
    padding: 0rem 0rem 0.5rem 0rem;
  }

  input {
    padding: 1rem;
    background-color: c.$item;
    border: none;
    border-radius: 4px;
    color: c.$text;

    &::placeholder {
      color: c.$text-muted;
    }
  }

  p {
    color: c.$text-error;
    transition: all 0.2s ease;
    margin-top: 8px;
    margin-bottom: 10px;
    font-size: 0.9em;
  }

  p.invalid {
    opacity: 0;
  }

  p.valid {
    opacity: 1;
  }
}
</style>
