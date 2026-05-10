export const users = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    first_name: 'Jane',
    last_name: 'Smith',
    profile: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    email: 'jane.smith@example.com',
    password: null,
    username: 'janesmith',
    is_verified: true,
    is_active: true,
    updated_at: new Date('2024-01-15T10:30:00Z'),
    created_at: new Date('2024-01-02T00:00:00Z'),
    deleted_at: null
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    first_name: 'Bob',
    last_name: 'Wilson',
    profile: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    email: 'bob.wilson@example.com',
    password: null,
    username: 'bobwilson',
    is_verified: true,
    is_active: true,
    updated_at: new Date('2024-01-15T10:30:00Z'),
    created_at: new Date('2024-01-03T00:00:00Z'),
    deleted_at: null
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    first_name: 'Alice',
    last_name: 'Johnson',
    profile: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    email: 'alice.johnson@example.com',
    password: null,
    username: 'alicejohnson',
    is_verified: true,
    is_active: true,
    updated_at: new Date('2024-01-15T10:30:00Z'),
    created_at: new Date('2024-01-04T00:00:00Z'),
    deleted_at: null
  }
];

export const projects = [
  {
    id: '650e8400-e29b-41d4-a716-446655440000',
    title: 'Website Redesign',
    description: 'Complete overhaul of the company website with new branding and improved UX',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    is_deleted: false,
    updated_at: new Date('2024-02-01T14:20:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440001',
    title: 'Mobile App Development',
    description: 'Build a cross-platform mobile app for iOS and Android',
    created_by: '550e8400-e29b-41d4-a716-446655440002',
    is_deleted: false,
    updated_at: new Date('2024-02-05T11:30:00Z'),
    created_at: new Date('2024-01-15T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440002',
    title: 'Marketing Campaign Q1',
    description: 'Plan and execute Q1 marketing initiatives',
    created_by: '550e8400-e29b-41d4-a716-446655440003',
    is_deleted: false,
    updated_at: new Date('2024-02-10T16:45:00Z'),
    created_at: new Date('2024-01-20T09:00:00Z'),
    deleted_at: null
  }
];

export const customFields = [
  {
    id: '750e8400-e29b-41d4-a716-446655440000',
    project_id: projects[0].id,
    title: 'To Do',
    color: '#6366f1',
    type: 'status' as const,
    position: 1,
    updated_at: new Date('2024-01-10T09:00:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440001',
    project_id: projects[0].id,
    title: 'In Progress',
    color: '#f59e0b',
    type: 'status' as const,
    position: 2,
    updated_at: new Date('2024-01-10T09:00:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440002',
    project_id: projects[0].id,
    title: 'Done',
    color: '#10b981',
    type: 'status' as const,
    position: 3,
    updated_at: new Date('2024-01-10T09:00:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440003',
    project_id: projects[0].id,
    title: 'Low',
    color: '#94a3b8',
    type: 'priority' as const,
    position: 1,
    updated_at: new Date('2024-01-10T09:00:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440004',
    project_id: projects[0].id,
    title: 'Medium',
    color: '#f59e0b',
    type: 'priority' as const,
    position: 2,
    updated_at: new Date('2024-01-10T09:00:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440005',
    project_id: projects[0].id,
    title: 'High',
    color: '#ef4444',
    type: 'priority' as const,
    position: 3,
    updated_at: new Date('2024-01-10T09:00:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440006',
    project_id: projects[0].id,
    title: 'Bug',
    color: '#ef4444',
    type: 'label' as const,
    position: 1,
    updated_at: new Date('2024-01-10T09:00:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440007',
    project_id: projects[0].id,
    title: 'Feature',
    color: '#8b5cf6',
    type: 'label' as const,
    position: 2,
    updated_at: new Date('2024-01-10T09:00:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440008',
    project_id: projects[0].id,
    title: 'Enhancement',
    color: '#06b6d4',
    type: 'label' as const,
    position: 3,
    updated_at: new Date('2024-01-10T09:00:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  }
];

export const tasks = [
  {
    id: '850e8400-e29b-41d4-a716-446655440000',
    project_id: projects[0].id,
    status_id: customFields[0].id,
    priority_id: customFields[5].id,
    title: 'Design new homepage mockup',
    description: 'Create wireframes and high-fidelity designs for the new homepage layout',
    position: 1,
    created_by: users[0].id,
    updated_by: null,
    start_date: new Date('2024-02-01T00:00:00Z'),
    due_date: new Date('2024-02-10T00:00:00Z'),
    is_deleted: false,
    updated_at: new Date('2024-02-01T09:00:00Z'),
    created_at: new Date('2024-02-01T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440001',
    project_id: projects[0].id,
    status_id: customFields[1].id,
    priority_id: customFields[4].id,
    title: 'Implement responsive navigation',
    description: 'Build the new navigation component with mobile menu support',
    position: 2,
    created_by: users[0].id,
    updated_by: users[1].id,
    start_date: new Date('2024-02-05T00:00:00Z'),
    due_date: new Date('2024-02-12T00:00:00Z'),
    is_deleted: false,
    updated_at: new Date('2024-02-06T14:30:00Z'),
    created_at: new Date('2024-02-02T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440002',
    project_id: projects[0].id,
    status_id: customFields[1].id,
    priority_id: customFields[5].id,
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment workflows',
    position: 3,
    created_by: users[1].id,
    updated_by: users[1].id,
    start_date: new Date('2024-02-03T00:00:00Z'),
    due_date: new Date('2024-02-08T00:00:00Z'),
    is_deleted: false,
    updated_at: new Date('2024-02-06T10:15:00Z'),
    created_at: new Date('2024-02-03T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440003',
    project_id: projects[0].id,
    status_id: customFields[2].id,
    priority_id: customFields[3].id,
    title: 'Update color scheme documentation',
    description: 'Document the new brand colors and usage guidelines',
    position: 4,
    created_by: users[2].id,
    updated_by: users[2].id,
    start_date: new Date('2024-01-25T00:00:00Z'),
    due_date: new Date('2024-01-30T00:00:00Z'),
    is_deleted: false,
    updated_at: new Date('2024-01-30T16:00:00Z'),
    created_at: new Date('2024-01-25T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440004',
    project_id: projects[0].id,
    status_id: customFields[0].id,
    priority_id: customFields[4].id,
    title: 'Create API documentation',
    description: 'Write comprehensive API docs using OpenAPI specification',
    position: 5,
    created_by: users[0].id,
    updated_by: null,
    start_date: null,
    due_date: new Date('2024-02-20T00:00:00Z'),
    is_deleted: false,
    updated_at: new Date('2024-02-01T09:00:00Z'),
    created_at: new Date('2024-02-01T09:00:00Z'),
    deleted_at: null
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440005',
    project_id: projects[1].id,
    status_id: '750e8400-e29b-41d4-a716-446655440009',
    priority_id: '750e8400-e29b-41d4-a716-446655440010',
    title: 'Design app icons',
    description: 'Create icons for iOS and Android platforms',
    position: 1,
    created_by: users[1].id,
    updated_by: null,
    start_date: new Date('2024-02-10T00:00:00Z'),
    due_date: new Date('2024-02-15T00:00:00Z'),
    is_deleted: false,
    updated_at: new Date('2024-02-10T09:00:00Z'),
    created_at: new Date('2024-02-10T09:00:00Z'),
    deleted_at: null
  }
];

export const taskLabels = [
  { task_id: tasks[0].id, field_id: customFields[6].id },
  { task_id: tasks[0].id, field_id: customFields[7].id },
  { task_id: tasks[1].id, field_id: customFields[7].id },
  { task_id: tasks[2].id, field_id: customFields[6].id },
  { task_id: tasks[3].id, field_id: customFields[8].id }
];

export const taskAssignees = [
  { user_id: users[0].id, task_id: tasks[0].id },
  { user_id: users[1].id, task_id: tasks[0].id },
  { user_id: users[0].id, task_id: tasks[1].id },
  { user_id: users[1].id, task_id: tasks[2].id },
  { user_id: users[2].id, task_id: tasks[3].id }
];

export const taskComments = [
  {
    id: '950e8400-e29b-41d4-a716-446655440000',
    task_id: tasks[0].id,
    user_id: users[0].id,
    comment: 'I think we should add a hero section with a gradient background',
    updated_at: new Date('2024-02-02T10:30:00Z'),
    created_at: new Date('2024-02-02T10:30:00Z'),
    deleted_at: null
  },
  {
    id: '950e8400-e29b-41d4-a716-446655440001',
    task_id: tasks[0].id,
    user_id: users[1].id,
    comment: 'Good idea! I will update the mockup today',
    updated_at: new Date('2024-02-02T11:00:00Z'),
    created_at: new Date('2024-02-02T11:00:00Z'),
    deleted_at: null
  },
  {
    id: '950e8400-e29b-41d4-a716-446655440002',
    task_id: tasks[1].id,
    user_id: users[2].id,
    comment: 'Make sure to test on Safari and Firefox as well',
    updated_at: new Date('2024-02-05T14:00:00Z'),
    created_at: new Date('2024-02-05T14:00:00Z'),
    deleted_at: null
  }
];

export const taskAttachments = [
  {
    id: 'a50e8400-e29b-41d4-a716-446655440000',
    task_id: tasks[0].id,
    file_url: 'https://example.com/files/homepage-mockup-v2.fig',
    uploaded_by: users[0].id,
    updated_at: new Date('2024-02-01T09:00:00Z'),
    created_at: new Date('2024-02-01T09:00:00Z'),
    deleted_at: null
  },
  {
    id: 'a50e8400-e29b-41d4-a716-446655440001',
    task_id: tasks[1].id,
    file_url: 'https://example.com/files/navigation-spec.pdf',
    uploaded_by: users[1].id,
    updated_at: new Date('2024-02-05T09:00:00Z'),
    created_at: new Date('2024-02-05T09:00:00Z'),
    deleted_at: null
  }
];

export const projectMembers = [
  {
    user_id: users[0].id,
    project_id: projects[0].id,
    role: 'admin',
    updated_at: new Date('2024-01-10T09:00:00Z'),
    created_at: new Date('2024-01-10T09:00:00Z'),
    deleted_at: null
  },
  {
    user_id: users[1].id,
    project_id: projects[0].id,
    role: 'member',
    updated_at: new Date('2024-01-11T09:00:00Z'),
    created_at: new Date('2024-01-11T09:00:00Z'),
    deleted_at: null
  },
  {
    user_id: users[2].id,
    project_id: projects[0].id,
    role: 'member',
    updated_at: new Date('2024-01-12T09:00:00Z'),
    created_at: new Date('2024-01-12T09:00:00Z'),
    deleted_at: null
  }
];

export const notifications = [
  {
    id: 1,
    user_id: users[0].id,
    title: 'Task assigned to you',
    description: 'You have been assigned to "Design new homepage mockup"',
    is_seen: false,
    updated_at: new Date('2024-02-01T09:00:00Z'),
    created_at: new Date('2024-02-01T09:00:00Z'),
    deleted_at: null
  },
  {
    id: 2,
    user_id: users[0].id,
    title: 'New comment on task',
    description: 'Jane Smith commented on "Design new homepage mockup"',
    is_seen: true,
    updated_at: new Date('2024-02-02T10:30:00Z'),
    created_at: new Date('2024-02-02T10:30:00Z'),
    deleted_at: null
  },
  {
    id: 3,
    user_id: users[0].id,
    title: 'Task due soon',
    description: '"Implement responsive navigation" is due in 2 days',
    is_seen: false,
    updated_at: new Date('2024-02-08T09:00:00Z'),
    created_at: new Date('2024-02-08T09:00:00Z'),
    deleted_at: null
  }
];

export const activityLogs = [
  {
    id: 1,
    user_id: users[0].id,
    project_id: projects[0].id,
    task_id: tasks[0].id,
    action: 'created_task',
    metadata: { task_title: 'Design new homepage mockup' },
    updated_at: new Date('2024-02-01T09:00:00Z'),
    created_at: new Date('2024-02-01T09:00:00Z'),
    deleted_at: null
  },
  {
    id: 2,
    user_id: users[1].id,
    project_id: projects[0].id,
    task_id: tasks[0].id,
    action: 'commented',
    metadata: { comment_length: 62 },
    updated_at: new Date('2024-02-02T10:30:00Z'),
    created_at: new Date('2024-02-02T10:30:00Z'),
    deleted_at: null
  },
  {
    id: 3,
    user_id: users[0].id,
    project_id: projects[0].id,
    task_id: tasks[1].id,
    action: 'updated_status',
    metadata: { from: 'To Do', to: 'In Progress' },
    updated_at: new Date('2024-02-06T14:30:00Z'),
    created_at: new Date('2024-02-06T14:30:00Z'),
    deleted_at: null
  }
];
