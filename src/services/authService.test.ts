import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { authService } from './authService';
import api from './api';
import { User } from '../types';

vi.mock('./api');
const mockedApi = api as any;

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should login a user and store token and user in localStorage', async () => {
    const user: User = { id: '1', name: 'Test User', email: 'test@test.com', avatar: '', location: '', rating: 0, reviews: 0, services: [], bio: '' };
    const token = 'test-token';
    mockedApi.post.mockResolvedValue({ data: { user, token } });

    const response = await authService.login({ email: 'test@test.com', password: 'password' });

    expect(response.success).toBe(true);
    expect(response.user).toEqual(user);
    expect(response.token).toBe(token);
    expect(localStorage.getItem('servicehub_auth_token')).toBe(token);
    expect(localStorage.getItem('servicehub_current_user')).toBe(JSON.stringify(user));
  });

  it('should handle login failure', async () => {
    mockedApi.post.mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } });

    const response = await authService.login({ email: 'test@test.com', password: 'password' });

    expect(response.success).toBe(false);
    expect(response.error).toBe('Invalid credentials');
    expect(localStorage.getItem('servicehub_auth_token')).toBeNull();
    expect(localStorage.getItem('servicehub_current_user')).toBeNull();
  });

  it('should register a user and store token and user in localStorage', async () => {
    const user: User = { id: '1', name: 'Test User', email: 'test@test.com', avatar: '', location: '', rating: 0, reviews: 0, services: [], bio: '' };
    const token = 'test-token';
    mockedApi.post.mockResolvedValue({ data: { user, token } });

    const response = await authService.register({ name: 'Test User', email: 'test@test.com', password: 'password' });

    expect(response.success).toBe(true);
    expect(response.user).toEqual(user);
    expect(response.token).toBe(token);
    expect(localStorage.getItem('servicehub_auth_token')).toBe(token);
    expect(localStorage.getItem('servicehub_current_user')).toBe(JSON.stringify(user));
  });

  it('should handle registration failure', async () => {
    mockedApi.post.mockRejectedValue({ response: { data: { error: 'Email already exists' } } });

    const response = await authService.register({ name: 'Test User', email: 'test@test.com', password: 'password' });

    expect(response.success).toBe(false);
    expect(response.error).toBe('Email already exists');
    expect(localStorage.getItem('servicehub_auth_token')).toBeNull();
    expect(localStorage.getItem('servicehub_current_user')).toBeNull();
  });

  it('should logout a user and remove token and user from localStorage', async () => {
    localStorage.setItem('servicehub_auth_token', 'test-token');
    localStorage.setItem('servicehub_current_user', JSON.stringify({ id: '1', name: 'Test User' }));

    await authService.logout();

    expect(localStorage.getItem('servicehub_auth_token')).toBeNull();
    expect(localStorage.getItem('servicehub_current_user')).toBeNull();
  });
});
