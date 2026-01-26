/**
 * API.TS - Centralizirani API helper funkcije
 * 
 * Ta datoteka vsebuje reusable fetch funkcije z že vgrajenem error handling-om
 * in konzistentno strukturo. To zmanjša boilerplate kode in ročno upravljanje
 * fetch() klicev na več mestih.
 * 
 * UPORABA:
 *   const user = await apiGet('/api/me');
 *   const updated = await apiPut('/api/me', { name: 'Janez' });
 */

import { ApiResponse } from './types';

/**
 * API GET - Pridobi podatke iz API-ja
 * 
 * @param endpoint - API pot (npr. '/api/me', '/api/groups')
 * @param options - Dodatni fetch opciji (npr. cache, headers)
 * @returns Odgovor s podatki ali napako
 * 
 * PRIMER:
 *   const user = await apiGet('/api/me');
 *   if (!user.error) {
 *     console.log(user.data);
 *   }
 */
export async function apiGet<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
      ...options,
    });

    // Če status ni 2xx, vrni error
    if (!res.ok) {
      return {
        error: `API Error: ${res.status} ${res.statusText}`,
        status: res.status,
      };
    }

    const data = await res.json();
    return { data, status: res.status };
  } catch (error) {
    // Network ali parsing error
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      error: `Fetch Error: ${message}`,
      status: 0,
    };
  }
}

/**
 * API POST - Pošlji nove podatke na server
 * 
 * @param endpoint - API pot
 * @param body - Podatki za pošiljanje
 * @param options - Dodatni fetch opciji
 * @returns Odgovor s podatki ali napako
 * 
 * PRIMER:
 *   const result = await apiPost('/api/groups', { name: 'Novo Mesto Meetup' });
 */
export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!res.ok) {
      return {
        error: `API Error: ${res.status} ${res.statusText}`,
        status: res.status,
      };
    }

    const data = await res.json();
    return { data, status: res.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      error: `Fetch Error: ${message}`,
      status: 0,
    };
  }
}

/**
 * API PUT - Posodobi podatke na serveru
 * 
 * @param endpoint - API pot
 * @param body - Podatki za posodobitev
 * @param options - Dodatni fetch opciji
 * @returns Odgovor s posodobljenim objektom ali napako
 * 
 * PRIMER:
 *   const updated = await apiPut('/api/me', { name: 'Novi naziv' });
 */
export async function apiPut<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!res.ok) {
      return {
        error: `API Error: ${res.status} ${res.statusText}`,
        status: res.status,
      };
    }

    const data = await res.json();
    return { data, status: res.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      error: `Fetch Error: ${message}`,
      status: 0,
    };
  }
}

/**
 * API DELETE - Izbriši podatke na serveru
 * 
 * @param endpoint - API pot
 * @param options - Dodatni fetch opciji
 * @returns Odgovor s podatki ali napako
 * 
 * PRIMER:
 *   const result = await apiDelete('/api/groups/123');
 */
export async function apiDelete<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint, {
      method: 'DELETE',
      ...options,
    });

    if (!res.ok) {
      return {
        error: `API Error: ${res.status} ${res.statusText}`,
        status: res.status,
      };
    }

    const data = res.status === 204 ? null : await res.json();
    return { data, status: res.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      error: `Fetch Error: ${message}`,
      status: 0,
    };
  }
}
