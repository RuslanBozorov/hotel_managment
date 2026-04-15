import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://uncaressed-unpulverized-victor.ngrok-free.dev';

export interface Admin {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  admin: Admin;
}

export interface Application {
  id: number;
  fullname: string;
  phone: string;
  email?: string;
  message?: string;
  service_type?: string;
  status: string;
  created_at: string;
}

export interface Service {
  id: number;
  title_en: string;
  title_ru: string;
  desc_en: string;
  desc_ru: string;
  icon: string;
  image_url?: string;
  is_popular: boolean;
}

export interface Project {
  id: number;
  name: string;
  city: string;
  role_en: string;
  role_ru: string;
  stars: number;
  image_url?: string;
  is_featured: boolean;
  category: string;
  category_id?: number;
  category_name_en?: string;
  category_name_ru?: string;
}

export interface Category {
  id: number;
  name_en: string;
  name_ru: string;
  slug: string;
}

export interface Testimonial {
  id: number;
  text_en: string;
  text_ru: string;
  author: string;
  position_en: string;
  position_ru: string;
  avatar_url?: string;
}

export interface Partner {
  id: number;
  name: string;
  logo_url?: string;
  category: string;
}

// ===== AUTH TOKEN HELPER =====
const getToken = (): string | null => {
  try {
    return localStorage.getItem('admin_token');
  } catch {
    return null;
  }
};

const getHeaders = (token?: string, isJson = true) => {
  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true'
  };
  if (isJson) headers['Content-Type'] = 'application/json';
  // Auto-attach token: explicit param > localStorage
  const authToken = token || getToken();
  if (authToken && authToken.length > 5) headers['Authorization'] = `Bearer ${authToken}`;
  return headers;
};

// ===== RESPONSE INTERCEPTOR =====
export class ApiError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const detail = error.detail || `Request failed (${response.status})`;

    // Standardized Global Toast Notification
    if (response.status !== 401) {
       toast.error(`Error: ${detail}`);
    }

    // 401 Interceptor: only handle if user is in the admin area AND had a token
    if (response.status === 401) {
      const hadToken = !!localStorage.getItem('admin_token');
      const isInAdmin = window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login');
      
      if (hadToken && isInAdmin) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin');
        window.location.href = '/admin/login';
      }
      // Silently ignore 401 on public pages (empty token calls)
    }

    throw new ApiError(response.status, detail);
  }
  return response.json();
};

export const adminApi = {
  register: async (email: string, username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, username, password }),
    });
    return handleResponse(response);
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'ngrok-skip-browser-warning': 'true',
      },
      body: params,
    });
    return handleResponse(response);
  },

  getCurrentAdmin: async (token: string): Promise<Admin> => {
    const response = await fetch(`${API_BASE_URL}/admin/me`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};

export const applicationsApi = {
  getAll: async (token: string): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  updateStatus: async (id: number, status: string, token: string): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  update: async (id: number, data: Partial<Application>, token: string): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  create: async (application: Omit<Application, 'id' | 'status' | 'created_at'>): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(application),
    });
    return handleResponse(response);
  },

  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};

export const servicesApi = {
  getAll: async (token?: string): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  create: async (service: Omit<Service, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(service),
    });
    return handleResponse(response);
  },

  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  update: async (id: number, service: Partial<Service>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(service),
    });
    return handleResponse(response);
  },
};

export const projectsApi = {
  getAll: async (token?: string): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  create: async (project: Omit<Project, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(project),
    });
    return handleResponse(response);
  },

  update: async (id: number, project: Partial<Project>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(project),
    });
    return handleResponse(response);
  },

  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};

export const mediaApi = {
  upload: async (file: File): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },
};

export const categoriesApi = {
  getAll: async (token?: string): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  create: async (category: Omit<Category, 'id'>, token: string): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(category),
    });
    return handleResponse(response);
  },

  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
  
  update: async (id: number, category: Partial<Category>, token: string): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(category),
    });
    return handleResponse(response);
  },
};

export interface TeamMember {
  id: number;
  fullname: string;
  role_en: string;
  role_ru: string;
  image_url?: string;
  bio_en?: string;
  bio_ru?: string;
  linkedin?: string;
  telegram?: string;
  email?: string;
}

export const teamApi = {
  getAll: async (token?: string): Promise<TeamMember[]> => {
    const response = await fetch(`${API_BASE_URL}/team`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  create: async (member: Omit<TeamMember, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/team`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(member),
    });
    return handleResponse(response);
  },

  update: async (id: number, member: Partial<TeamMember>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/team/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(member),
    });
    return handleResponse(response);
  },

  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/team/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};

export interface Stat {
  id: number;
  label_en: string;
  label_ru: string;
  value: string;
  icon?: string;
}

export const statsApi = {
  getAll: async (token?: string): Promise<Stat[]> => {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
  create: async (stat: Omit<Stat, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(stat),
    });
    return handleResponse(response);
  },
  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/stats/${id}`, { 
      method: 'DELETE', 
      headers: getHeaders(token) 
    });
    return handleResponse(response);
  },
  update: async (id: number, stat: Partial<Stat>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/stats/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(stat),
    });
    return handleResponse(response);
  },
};

export const testimonialsApi = {
  getAll: async (token?: string): Promise<Testimonial[]> => {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
  create: async (t: Omit<Testimonial, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(t),
    });
    return handleResponse(response);
  },
  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, { 
      method: 'DELETE', 
      headers: getHeaders(token) 
    });
    return handleResponse(response);
  },
};

export const partnersApi = {
  getAll: async (token?: string): Promise<Partner[]> => {
    const response = await fetch(`${API_BASE_URL}/partners`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
  create: async (p: Omit<Partner, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/partners`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(p),
    });
    return handleResponse(response);
  },
  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/partners/${id}`, { 
      method: 'DELETE', 
      headers: getHeaders(token) 
    });
    return handleResponse(response);
  },
  update: async (id: number, p: Partial<Partner>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/partners/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(p),
    });
    return handleResponse(response);
  },
};

export interface Blog {
    id: number;
    title_en: string;
    title_ru: string;
    content_en: string;
    content_ru: string;
    category: string;
    author?: string;
    image_url?: string;
    created_at: string;
}
export const blogsApi = {
    getAll: async (token?: string): Promise<Blog[]> => {
        const response = await fetch(`${API_BASE_URL}/blogs`, { 
          headers: getHeaders(token) 
        });
        return handleResponse(response);
    },
    create: async (b: Omit<Blog, 'id' | 'created_at'>, token: string) => {
        const response = await fetch(`${API_BASE_URL}/blogs`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(b),
        });
        return handleResponse(response);
    },
    delete: async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`, { 
          method: 'DELETE', 
          headers: getHeaders(token) 
        });
        return handleResponse(response);
    },
    update: async (id: number, b: Partial<Blog>, token: string) => {
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify(b),
        });
        return handleResponse(response);
    },
};

export interface Faq { id: number; question_en: string; question_ru: string; answer_en: string; answer_ru: string; }
export const faqsApi = {
    getAll: async (token?: string): Promise<Faq[]> => {
        const response = await fetch(`${API_BASE_URL}/faqs`, { 
          headers: getHeaders(token) 
        });
        return handleResponse(response);
    },
    create: async (f: Omit<Faq, 'id'>, token: string) => {
        const response = await fetch(`${API_BASE_URL}/faqs`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(f),
        });
        return handleResponse(response);
    },
    delete: async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/faqs/${id}`, { 
          method: 'DELETE', 
          headers: getHeaders(token) 
        });
        return handleResponse(response);
    },
};

export interface Timeline { id: number; year: string; desc_en: string; desc_ru: string; }
export const timelinesApi = {
    getAll: async (token?: string): Promise<Timeline[]> => {
        const response = await fetch(`${API_BASE_URL}/timelines`, { 
          headers: getHeaders(token) 
        });
        return handleResponse(response);
    },
    create: async (t: Omit<Timeline, 'id'>, token: string) => {
        const response = await fetch(`${API_BASE_URL}/timelines`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(t),
        });
        return handleResponse(response);
    },
    delete: async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/timelines/${id}`, { 
          method: 'DELETE', 
          headers: getHeaders(token) 
        });
        return handleResponse(response);
    },
};

export interface Setting { key: string; value_en: string; value_ru: string; }
export const settingsApi = {
    getAll: async (token?: string): Promise<Setting[]> => {
        const response = await fetch(`${API_BASE_URL}/settings`, { 
          headers: getHeaders(token) 
        });
        return handleResponse(response);
    },
    update: async (setting: Setting, token: string) => {
        const response = await fetch(`${API_BASE_URL}/settings`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(setting),
        });
        return handleResponse(response);
    },
    bulkUpdate: async (settings: Setting[], token: string) => {
        const response = await fetch(`${API_BASE_URL}/settings/bulk`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify({ settings }),
        });
        return handleResponse(response);
    },
};

export const systemApi = {
  seedDemo: async () => {
    const response = await fetch(`${API_BASE_URL}/seed-demo`, { method: 'POST' });
    return handleResponse(response);
  }
};

export const telegramApi = {
  testConnection: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/telegram/test`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  }
};
