const API_BASE_URL = 'http://127.0.0.1:8000';

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
}

export const adminApi = {
  register: async (email: string, username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    return response.json();
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  getCurrentAdmin: async (token: string): Promise<Admin> => {
    const response = await fetch(`${API_BASE_URL}/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to get admin info');
    return response.json();
  },
};

export const applicationsApi = {
  getAll: async (token: string): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  updateStatus: async (id: number, status: string, token: string): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  update: async (id: number, data: Partial<Application>, token: string): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  create: async (application: Omit<Application, 'id' | 'status' | 'created_at'>): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application),
    });
    return response.json();
  },

  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};

export const servicesApi = {
  getAll: async (token: string): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  create: async (service: Omit<Service, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(service),
    });
    return response.json();
  },

  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  update: async (id: number, service: Partial<Service>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(service),
    });
    return response.json();
  },
};

export const projectsApi = {
  getAll: async (token: string): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  create: async (project: Omit<Project, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
    return response.json();
  },

  update: async (id: number, project: Partial<Project>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
    return response.json();
  },

  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
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
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },
};

export interface TeamMember {
  id: number;
  fullname: string;
  role_en: string;
  role_ru: string;
  image_url?: string;
  linkedin?: string;
  email?: string;
}

export const teamApi = {
  getAll: async (token: string): Promise<TeamMember[]> => {
    const response = await fetch(`${API_BASE_URL}/team`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  create: async (member: Omit<TeamMember, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(member),
    });
    return response.json();
  },

  update: async (id: number, member: Partial<TeamMember>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/team/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(member),
    });
    return response.json();
  },

  delete: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/team/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
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
  getAll: async (token: string): Promise<Stat[]> => {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
  create: async (stat: Omit<Stat, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(stat),
    });
    return response.json();
  },
  delete: async (id: number, token: string) => {
    await fetch(`${API_BASE_URL}/stats/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  },
};

export interface Testimonial {
  id: number;
  text_en: string;
  text_ru: string;
  author: string;
  position_en: string;
  position_ru: string;
  avatar_url?: string;
}

export const testimonialsApi = {
  getAll: async (token: string): Promise<Testimonial[]> => {
    const response = await fetch(`${API_BASE_URL}/testimonials`, { headers: { Authorization: `Bearer ${token}` } });
    return response.json();
  },
  create: async (t: Omit<Testimonial, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(t),
    });
    return response.json();
  },
  delete: async (id: number, token: string) => {
    await fetch(`${API_BASE_URL}/testimonials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  },
};

export interface Partner { id: number; name: string; logo_url?: string; }
export const partnersApi = {
  getAll: async (token: string): Promise<Partner[]> => {
    const response = await fetch(`${API_BASE_URL}/partners`, { headers: { Authorization: `Bearer ${token}` } });
    return response.json();
  },
  create: async (p: Omit<Partner, 'id'>, token: string) => {
    const response = await fetch(`${API_BASE_URL}/partners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(p),
    });
    return response.json();
  },
  delete: async (id: number, token: string) => {
    await fetch(`${API_BASE_URL}/partners/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  },
};

export interface Blog {
    id: number;
    title_en: string;
    title_ru: string;
    content_en: string;
    content_ru: string;
    category: string;
    image_url?: string;
    created_at: string;
}
export const blogsApi = {
    getAll: async (token: string): Promise<Blog[]> => {
        const response = await fetch(`${API_BASE_URL}/blogs`, { headers: { Authorization: `Bearer ${token}` } });
        return response.json();
    },
    create: async (b: Omit<Blog, 'id' | 'created_at'>, token: string) => {
        const response = await fetch(`${API_BASE_URL}/blogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(b),
        });
        return response.json();
    },
    delete: async (id: number, token: string) => {
        await fetch(`${API_BASE_URL}/blogs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    },
};

export interface Faq { id: number; question_en: string; question_ru: string; answer_en: string; answer_ru: string; }
export const faqsApi = {
    getAll: async (token: string): Promise<Faq[]> => {
        const response = await fetch(`${API_BASE_URL}/faqs`, { headers: { Authorization: `Bearer ${token}` } });
        return response.json();
    },
    create: async (f: Omit<Faq, 'id'>, token: string) => {
        const response = await fetch(`${API_BASE_URL}/faqs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(f),
        });
        return response.json();
    },
    delete: async (id: number, token: string) => {
        await fetch(`${API_BASE_URL}/faqs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    },
};

export interface Timeline { id: number; year: string; desc_en: string; desc_ru: string; }
export const timelinesApi = {
    getAll: async (token: string): Promise<Timeline[]> => {
        const response = await fetch(`${API_BASE_URL}/timelines`, { headers: { Authorization: `Bearer ${token}` } });
        return response.json();
    },
    create: async (t: Omit<Timeline, 'id'>, token: string) => {
        const response = await fetch(`${API_BASE_URL}/timelines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(t),
        });
        return response.json();
    },
    delete: async (id: number, token: string) => {
        await fetch(`${API_BASE_URL}/timelines/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    },
};

export interface Setting { key: string; value_en: string; value_ru: string; }
export const settingsApi = {
    getAll: async (token: string): Promise<Setting[]> => {
        const response = await fetch(`${API_BASE_URL}/settings`, { headers: { Authorization: `Bearer ${token}` } });
        return response.json();
    },
    update: async (setting: Setting, token: string) => {
        const response = await fetch(`${API_BASE_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(setting),
        });
        return response.json();
    },
};

export const systemApi = {
  seedDemo: async () => {
    const response = await fetch(`${API_BASE_URL}/seed-demo`, { method: 'POST' });
    return response.json();
  }
};
