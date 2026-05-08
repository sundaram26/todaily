# Todaily: Production-Grade Distributed System Architecture - Complete Implementation Plan

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current Architecture Assessment](#current-architecture-assessment)
3. [Target Architecture](#target-architecture)
4. [Microservices Design](#microservices-design)
5. [Database Architecture](#database-architecture)
6. [Implementation Phases](#implementation-phases)
7. [Code Examples & Configurations](#code-examples--configurations)
8. [Deployment Strategy](#deployment-strategy)
9. [Testing Strategy](#testing-strategy)
10. [Monitoring & Observability](#monitoring--observability)

---

## Executive Summary

**Project Goal:** Transform Todaily from a modular monolith into a production-grade distributed system demonstrating advanced architecture patterns for 1-3 year experience roles.

**Key Achievements:**
- 5 microservices with clear boundaries
- Database-per-service pattern
- API Gateway with JWT validation
- Service discovery with Consul
- Message queues with RabbitMQ
- Real-time communication with Socket.io
- WebRTC integration with LiveKit
- Comprehensive observability stack

**Technology Stack:**
- **API Gateway:** Kong / Traefik
- **Service Discovery:** Consul
- **Message Queue:** RabbitMQ
- **Cache:** Redis
- **Databases:** PostgreSQL, TimescaleDB, ClickHouse
- **Storage:** S3 / Cloudflare R2
- **WebSocket:** Socket.io
- **WebRTC:** LiveKit
- **Monitoring:** Prometheus, Grafana, Jaeger
- **Error Tracking:** Sentry

---

## Current Architecture Assessment

### Current State

```
todaily/
├── backend/                    # Monolithic Express.js
│   ├── src/
│   │   ├── app.ts
│   │   ├── config/
│   │   ├── db/
│   │   │   └── schema/        # Drizzle ORM
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── auth/          # ✅ Complete
│   │   │   ├── oauth/         # ✅ Google OAuth
│   │   │   └── system-config/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── frontend/                   # Next.js 16
│   ├── app/
│   ├── components/
│   └── package.json
└── docker-compose.yml
```

### What's Working
- ✅ JWT authentication with refresh tokens
- ✅ Google OAuth integration
- ✅ Email verification system
- ✅ Password reset with OTP
- ✅ Database schema (PostgreSQL + Drizzle)
- ✅ Next.js 16 with Shadcn UI

### What's Missing
- ❌ API routes for tasks/projects (only auth exists)
- ❌ WebSocket implementation
- ❌ Real-time features
- ❌ Service separation
- ❌ Message queue integration
- ❌ Observability

---

## Target Architecture

### Complete System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Web App (Next.js)  │  Mobile App (React Native)  │  Desktop (Electron)    │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │ HTTPS/WSS
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CDN (Cloudflare)                                 │
│  • Static Assets  • DDoS Protection  • SSL Termination  • Edge Caching     │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LOAD BALANCER (NGINX)                              │
│  • Round Robin  • Health Checks  • SSL Passthrough  • WebSocket Support    │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  ▼                         ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │   API Gateway (Kong)  │   │   WebSocket Gateway    │
    │   • JWT Validation    │   │   • Socket.io          │
    │   • Rate Limiting     │   │   • Redis Adapter      │
    │   • Request Routing   │   │   • Presence Tracking  │
    │   • Response Cache    │   │   • Live Cursors       │
    └───────────┬───────────┘   └───────────┬───────────┘
                │                           │
    ┌───────────┴───────────┬───────────────┴───────────┬───────────────┐
    │                       │                           │               │
    ▼                       ▼                           ▼               ▼
┌─────────┐          ┌─────────┐                  ┌─────────┐    ┌──────────┐
│  Core   │          │  Comm   │                  │  Media  │    │ Workers  │
│Service  │          │Service  │                  │Service  │    │          │
│         │          │         │                  │         │    │          │
│• Auth   │          │• Chat   │                  │• Upload │    │• Email   │
│• Project│          │• Voice  │                  │• Trans- │    │• Push    │
│• Todo   │          │• Video  │                  │  code   │    │• Analytics│
│• Member │          │• Call   │                  │• Stream │    │• Logs    │
│         │          │  Log    │                  │• Record │    │          │
│:3001    │          │:3003    │                  │:3004    │    │:3005-3007│
└────┬────┘          └────┬────┘                  └────┬────┘    └────┬─────┘
     │                    │                            │             │
     ▼                    ▼                            ▼             ▼
┌─────────┐          ┌─────────┐                  ┌─────────┐    ┌──────────┐
│auth_db  │          │msg_db   │                  │ S3/R2   │    │RabbitMQ  │
│(PostgreSQL│      │(Timescale│                  │         │    │          │
│+Drizzle)│          │DB)      │                  │         │    │• Email   │
│         │          │         │                  │         │    │• Push    │
│• users  │          │• messages│                  │• files  │    │• Analyt- │
│• sessions│         │• calls  │                  │• media  │    │  ics     │
│• accounts│         │• presence│                  │         │    │          │
│• projects│         │         │                  │         │    │          │
│• tasks  │          │         │                  │         │    │          │
└─────────┘          └─────────┘                  └─────────┘    └──────────┘
     │                    │                            │             │
     └────────────────────┴────────────────────────────┴─────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Shared Redis       │
                    │                     │
                    │  • Cache            │
                    │  • Sessions         │
                    │  • Pub/Sub          │
                    │  • Rate Limiting    │
                    │  • Distributed Lock │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Consul Cluster    │
                    │                     │
                    │  • Service Registry │
                    │  • Health Checks    │
                    │  • KV Store         │
                    │  • Service Mesh     │
                    └─────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
    ┌───────────────────┐          ┌───────────────────┐
    │  Observability    │          │   Development      │
    │                   │          │                   │
    │  • Prometheus     │          │  • GitLab/GitHub   │
    │  • Grafana        │          │  • CI/CD Pipelines │
    │  • Jaeger         │          │  • Docker Registry │
    │  • Sentry         │          │  • K8s/Helm Charts  │
    │  • Loki           │          │                   │
    └───────────────────┘          └───────────────────┘
```

### Service Port Allocation

| Service | Port | Protocol | Purpose |
|---------|------|----------|---------|
| API Gateway | 8080 | HTTP | Main entry point |
| Core Service | 3001 | HTTP | Auth, Projects, Tasks |
| Real-time Service | 3002 | WS | WebSocket connections |
| Communication Service | 3003 | HTTP | Chat, Voice, Video |
| Media Service | 3004 | HTTP | File operations |
| Notification Worker | 3005 | - | Email processing |
| Push Worker | 3006 | - | Push notifications |
| Analytics Worker | 3007 | - | Data processing |
| PostgreSQL (auth_db) | 5432 | TCP | Auth database |
| PostgreSQL (msg_db) | 5433 | TCP | Messages database |
| Redis | 6379 | TCP | Cache & Pub/Sub |
| RabbitMQ | 5672 | TCP | Message queue |
| Consul | 8500 | HTTP | Service discovery |
| Prometheus | 9090 | HTTP | Metrics |
| Grafana | 3000 | HTTP | Dashboards |
| Jaeger | 16686 | HTTP | Tracing UI |

---

## Microservices Design

### Service 1: Core Service (Auth + Todo + Project)

**Responsibility:** User management, authentication, project/task CRUD

**Database:** `auth_db` (PostgreSQL)

**API Endpoints:**

```
# Authentication
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/oauth/google

# Users
GET    /api/v1/users/me
PATCH  /api/v1/users/me
DELETE /api/v1/users/me

# Projects
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
GET    /api/v1/projects/:id/members
POST   /api/v1/projects/:id/members
DELETE /api/v1/projects/:id/members/:userId

# Tasks
GET    /api/v1/projects/:id/tasks
POST   /api/v1/projects/:id/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
POST   /api/v1/tasks/:id/assign
DELETE /api/v1/tasks/:id/assign/:userId

# Custom Fields
GET    /api/v1/projects/:id/fields
POST   /api/v1/projects/:id/fields
PATCH  /api/v1/fields/:id
DELETE /api/v1/fields/:id

# Health
GET    /health
GET    /metrics
```

**Database Schema:**

```sql
-- auth_db schema

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  profile_picture_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(500) NOT NULL,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, refresh_token)
);

-- OAuth accounts
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project members
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member', 'viewer'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status_id UUID REFERENCES custom_fields(id),
  priority_id UUID REFERENCES custom_fields(id),
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  position INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom fields (status, priority, labels)
CREATE TABLE custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'status', 'priority', 'label', 'text', 'number'
  options JSONB, -- For select/label types
  color VARCHAR(7), -- Hex color for UI
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task labels (many-to-many)
CREATE TABLE task_labels (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  field_id UUID REFERENCES custom_fields(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, field_id)
);

-- Task attachments
CREATE TABLE task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task comments
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES task_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status_id ON tasks(status_id);
```

---

### Service 2: Real-time Service (WebSocket + Presence)

**Responsibility:** Real-time updates, presence tracking, live cursors

**Database:** `msg_db` (PostgreSQL + TimescaleDB) for persistence, Redis for ephemeral state

**WebSocket Events:**

```javascript
// Client → Server Events
{
  join: { projectId, userId }
  leave: { projectId }
  presence: { status } // 'online', 'away', 'offline', 'busy'
  cursor: { x, y, taskId, userId }
  typing: { taskId, isTyping }
}

// Server → Client Events
{
  user_joined: { userId, username, avatar }
  user_left: { userId }
  presence_updated: { userId, status }
  cursors_updated: { cursors: [{ userId, x, y, taskId }] }
  task_updated: { task }
  task_created: { task }
  task_deleted: { taskId }
  member_added: { userId, projectId }
  member_removed: { userId, projectId }
  notification: { notification }
}
```

**Redis Data Structures:**

```redis
# Presence tracking
HSET presence:user:{userId} status "online" lastSeen "{timestamp}" projectId "{projectId}"
EXPIRE presence:user:{userId} 300

# Online users per project
SADD presence:project:{projectId} {userId}
EXPIRE presence:project:{projectId} 3600

# Cursor positions
HSET cursor:{projectId}:{userId} x {x} y {y} taskId {taskId}
EXPIRE cursor:{projectId}:{userId} 60

# Typing indicators
SETEX typing:{taskId}:{userId} 10 "true"

# Socket.io room mappings
SADD socket:rooms:{socketId} {projectId1},{projectId2}
```

**Service Structure:**

```typescript
// backend/services/realtime-service/src/app.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { RedisAdapter } from '@socket.io/redis-adapter';
import { verifyToken } from './utils/jwt';

const app = express();
const httpServer = createServer(app);

// Redis clients for pub/sub
const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

// Socket.io with Redis adapter
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  },
  adapter: RedisAdapter({
    pubClient,
    subClient
  })
});

// JWT authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = await verifyToken(token);
    socket.data.userId = decoded.userId;
    socket.data.username = decoded.username;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Connection handler
io.on('connection', async (socket) => {
  const userId = socket.data.userId;
  const username = socket.data.username;

  console.log(`User connected: ${username} (${socket.id})`);

  // Update presence in Redis
  await pubClient.hSet(
    `presence:user:${userId}`,
    {
      status: 'online',
      lastSeen: Date.now().toString(),
      socketId: socket.id
    }
  );
  await pubClient.expire(`presence:user:${userId}`, 300);

  // Join project rooms
  socket.on('join', async ({ projectId }) => {
    await socket.join(`project:${projectId}`);
    await pubClient.sAdd(`presence:project:${projectId}`, userId);

    // Notify others in the project
    socket.to(`project:${projectId}`).emit('user_joined', {
      userId,
      username,
      socketId: socket.id
    });

    // Send current online users
    const onlineUsers = await pubClient.sMembers(`presence:project:${projectId}`);
    socket.emit('presence_list', { users: onlineUsers });
  });

  // Leave project room
  socket.on('leave', async ({ projectId }) => {
    await socket.leave(`project:${projectId}`);
    await pubClient.sRem(`presence:project:${projectId}`, userId);

    socket.to(`project:${projectId}`).emit('user_left', { userId, username });
  });

  // Update presence
  socket.on('presence', async ({ status }) => {
    await pubClient.hSet(`presence:user:${userId}`, {
      status,
      lastSeen: Date.now().toString()
    });

    // Broadcast to all user's active sockets across all servers
    io.emit('presence_updated', { userId, status });
  });

  // Cursor tracking
  socket.on('cursor', async ({ x, y, taskId }) => {
    const projects = Array.from(socket.rooms).filter(r => r.startsWith('project:'));

    for (const room of projects) {
      await pubClient.hSet(
        `cursor:${room}:${userId}`,
        { x, y, taskId, userId, username }
      );
      await pubClient.expire(`cursor:${room}:${userId}`, 60);

      // Broadcast to room
      socket.to(room).emit('cursor_updated', {
        userId,
        username,
        x,
        y,
        taskId
      });
    }
  });

  // Typing indicator
  socket.on('typing', async ({ taskId, isTyping }) => {
    const taskRoom = `task:${taskId}`;

    if (isTyping) {
      await pubClient.set(`typing:${taskId}:${userId}`, 'true', { EX: 10 });
    } else {
      await pubClient.del(`typing:${taskId}:${userId}`);
    }

    socket.to(taskRoom).emit('typing_updated', {
      taskId,
      userId,
      isTyping
    });
  });

  // Disconnect handler
  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${username} (${socket.id})`);

    // Check if user has other active connections
    const userSockets = await io.of('/').in(`user:${userId}`).allSockets();

    if (userSockets.size === 0) {
      // No more connections, mark as offline
      await pubClient.hSet(`presence:user:${userId}`, {
        status: 'offline',
        lastSeen: Date.now().toString()
      });

      // Remove from all project presence sets
      const projects = Array.from(socket.rooms).filter(r => r.startsWith('project:'));
      for (const project of projects) {
        await pubClient.sRem(`presence:project:${project}`, userId);
        io.to(project).emit('user_left', { userId, username });
      }
    }
  });
});

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Real-time Service listening on port ${PORT}`);
});
```

---

### Service 3: Communication Service (Chat + Voice + Video)

**Responsibility:** Messaging, voice/video calls, call recording

**Database:** `msg_db` (PostgreSQL + TimescaleDB)

**API Endpoints:**

```
# Messages
GET    /api/v1/projects/:projectId/messages
POST   /api/v1/projects/:projectId/messages
GET    /api/v1/messages/:id
PATCH  /api/v1/messages/:id
DELETE /api/v1/messages/:id
GET    /api/v1/messages/:id/thread
POST   /api/v1/messages/:id/replies

# Voice Rooms
POST   /api/v1/rooms/voice
GET    /api/v1/rooms/:roomId
POST   /api/v1/rooms/:roomId/join
POST   /api/v1/rooms/:roomId/leave
DELETE /api/v1/rooms/:roomId

# Video Rooms
POST   /api/v1/rooms/video
GET    /api/v1/rooms/:roomId/participants
POST   /api/v1/rooms/:roomId/record
DELETE /api/v1/rooms/:roomId/record

# Call History
GET    /api/v1/calls/history
GET    /api/v1/calls/:id/recording
```

**Database Schema:**

```sql
-- msg_db schema with TimescaleDB extension

CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Messages table (hypertable for time-series)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  thread_id UUID, -- For message threading
  parent_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  mentions UUID[], -- Array of mentioned user IDs
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('messages', 'created_at');

-- Add indexes
CREATE INDEX idx_messages_project_id ON messages(project_id, created_at DESC);
CREATE INDEX idx_messages_thread_id ON messages(thread_id, created_at DESC);
CREATE INDEX idx_mentions ON messages USING GIN(mentions);

-- Call rooms
CREATE TABLE call_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name VARCHAR(255) NOT NULL UNIQUE,
  project_id UUID,
  type VARCHAR(20) NOT NULL, -- 'voice', 'video'
  created_by UUID NOT NULL,
  max_participants INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  recording_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Call participants
CREATE TABLE call_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES call_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  is_muted BOOLEAN DEFAULT FALSE,
  is_video_on BOOLEAN DEFAULT TRUE,
  UNIQUE(room_id, user_id)
);

-- Call recordings
CREATE TABLE call_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES call_rooms(id) ON DELETE CASCADE,
  recording_url TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size BIGINT,
  format VARCHAR(10), -- 'mp4', 'webm'
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable
SELECT create_hypertable('call_rooms', 'created_at');
SELECT create_hypertable('call_recordings', 'created_at');
```

**LiveKit Integration:**

```typescript
// backend/services/communication-service/src/services/livekit.ts
import { RoomServiceClient, AccessToken } from 'livekit-server-sdk';

const LIVEKIT_URL = process.env.LIVEKIT_URL!;
const API_KEY = process.env.LIVEKIT_API_KEY!;
const API_SECRET = process.env.LIVEKIT_API_SECRET!;

// Room service client
const roomService = new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET);

interface CreateRoomParams {
  name: string;
  projectId?: string;
  type: 'voice' | 'video';
  maxParticipants?: number;
  enableRecording?: boolean;
  createdBy: string;
}

interface JoinRoomParams {
  roomName: string;
  participantName: string;
  userId: string;
}

export class LiveKitService {
  /**
   * Create a new room
   */
  async createRoom(params: CreateRoomParams) {
    const room = await roomService.createRoom({
      name: params.name,
      emptyTimeout: 300, // 5 minutes
      maxParticipants: params.maxParticipants || 10,
    });

    // Save room metadata to database
    const callRoom = await db.insert(call_rooms).values({
      id: room.sid,
      room_name: room.name,
      project_id: params.projectId,
      type: params.type,
      created_by: params.createdBy,
      max_participants: params.maxParticipants || 10,
      recording_enabled: params.enableRecording || false,
    }).returning().get();

    return callRoom;
  }

  /**
   * Generate access token for participant
   */
  async generateToken(params: JoinRoomParams) {
    const { roomName, participantName, userId } = params;

    // Check if room exists in database
    const room = await db.query.call_rooms.findFirst({
      where: eq(call_rooms.room_name, roomName)
    });

    if (!room || !room.is_active) {
      throw new Error('Room not found or inactive');
    }

    // Create access token
    const token = new AccessToken(API_KEY, API_SECRET, {
      identity: userId,
      name: participantName,
    });

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return {
      token: token.toJwt(),
      roomName,
      livekitUrl: LIVEKIT_URL,
    };
  }

  /**
   * End a room
   */
  async endRoom(roomId: string) {
    await roomService.deleteRoom(roomId);

    // Update database
    await db.update(call_rooms)
      .set({
        is_active: false,
        ended_at: new Date(),
      })
      .where(eq(call_rooms.id, roomId));

    return { success: true };
  }

  /**
   * Start recording
   */
  async startRecording(roomId: string) {
    // Implement recording with Egress service
    const egressClient = new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET);

    const recording = await egressClient.startRoomCompositeEgress({
      roomName: roomId,
      layout: 'speaker',
      outputPath: `s3://todaily-recordings/${roomId}`,
    });

    return recording;
  }

  /**
   * List active participants
   */
  async getParticipants(roomId: string) {
    const participants = await roomService.listParticipants(roomId);

    return participants.map(p => ({
      userId: p.identity,
      name: p.name,
      state: p.state,
      tracks: p.tracks,
      joinedAt: p.joinedAt,
      isMuted: p.tracks?.some(t =>
        t.type === 'audio' && t.muted
      ) || false,
    }));
  }

  /**
   * Remove participant from room
   */
  async removeParticipant(roomId: string, userId: string) {
    await roomService.removeParticipant(roomId, userId);

    // Update database
    await db.update(call_participants)
      .set({ left_at: new Date() })
      .where(
        and(
          eq(call_participants.room_id, roomId),
          eq(call_participants.user_id, userId)
        )
      );
  }
}
```

**Chat API Implementation:**

```typescript
// backend/services/communication-service/src/routes/messages.ts
import { Router } from 'express';
import { db } from '../db';
import { messages, projects, project_members } from '../db/schema';
import { eq, and, desc, lt } from 'drizzle-orm';
import { verifyToken } from '../utils/jwt';

const router = Router();

// Get messages for a project
router.get('/projects/:projectId/messages', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const before = req.query.before as string | undefined;
    const threadId = req.query.threadId as string | undefined;

    // Verify user is project member
    const member = await db.query.project_members.findFirst({
      where: and(
        eq(project_members.project_id, projectId),
        eq(project_members.user_id, userId)
      ),
    });

    if (!member) {
      return res.status(403).json({ error: 'Not a project member' });
    }

    // Build query
    let query = db
      .select({
        id: messages.id,
        content: messages.content,
        userId: messages.user_id,
        threadId: messages.thread_id,
        parentId: messages.parent_id,
        mentions: messages.mentions,
        attachments: messages.attachments,
        createdAt: messages.created_at,
        updatedAt: messages.updated_at,
      })
      .from(messages)
      .where(eq(messages.project_id, projectId))
      .orderBy(desc(messages.created_at))
      .limit(limit);

    if (before) {
      query = query.where(lt(messages.created_at, new Date(before)));
    }

    if (threadId) {
      query = query.where(eq(messages.thread_id, threadId));
    }

    const messagesList = await query;

    res.json({
      messages: messagesList.reverse(),
      hasMore: messagesList.length === limit,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create message
router.post('/projects/:projectId/messages', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.id;
    const { content, threadId, parentId, mentions, attachments } = req.body;

    // Verify user is project member
    const member = await db.query.project_members.findFirst({
      where: and(
        eq(project_members.project_id, projectId),
        eq(project_members.user_id, userId)
      ),
    });

    if (!member) {
      return res.status(403).json({ error: 'Not a project member' });
    }

    // Create message
    const [message] = await db
      .insert(messages)
      .values({
        id: crypto.randomUUID(),
        project_id: projectId,
        thread_id: threadId || crypto.randomUUID(),
        parent_id: parentId,
        user_id: userId,
        content,
        mentions: mentions || [],
        attachments: attachments || null,
      })
      .returning();

    // Emit to WebSocket service
    await redis.publish(
      `project:${projectId}`,
      JSON.stringify({
        type: 'message_created',
        data: message,
      })
    );

    // Create notifications for mentioned users
    if (mentions && mentions.length > 0) {
      for (const mentionedUserId of mentions) {
        await db.insert(notifications).values({
          user_id: mentionedUserId,
          type: 'mention',
          title: 'You were mentioned',
          body: `${req.user!.username} mentioned you`,
          metadata: {
            messageId: message.id,
            projectId,
          },
        });
      }
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

---

### Service 4: Media Service (File Management)

**Responsibility:** File upload, download, transcoding, thumbnail generation

**Storage:** S3 / Cloudflare R2

**API Endpoints:**

```
POST   /api/v1/media/upload/presigned
POST   /api/v1/media/upload/confirm
GET    /api/v1/media/:id
GET    /api/v1/media/:id/download
GET    /api/v1/media/:id/thumbnail
GET    /api/v1/media/:id/stream
DELETE /api/v1/media/:id
GET    /api/v1/media/task/:taskId
```

**Presigned Upload Flow:**

```typescript
// backend/services/media-service/src/routes/upload.ts
import { Router } from 'express';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { db } from '../db';
import { media_files } from '../db/schema';
import { verifyToken } from '../utils/jwt';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT, // For R2
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

interface PresignedUploadRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  contentType: string;
  taskId?: string;
}

// Generate presigned URL for upload
router.post('/upload/presigned', verifyToken, async (req, res) => {
  try {
    const { fileName, fileType, fileSize, contentType, taskId }: PresignedUploadRequest = req.body;
    const userId = req.user!.id;

    // Validate file size (max 100MB)
    if (fileSize > 100 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large (max 100MB)' });
    }

    // Generate unique file key
    const fileId = uuidv4();
    const extension = fileName.split('.').pop();
    const fileKey = `uploads/${userId}/${new Date().toISOString().split('T')[0]}/${fileId}.${extension}`;

    // Create metadata entry
    const [mediaFile] = await db.insert(media_files).values({
      id: fileId,
      user_id: userId,
      file_name: fileName,
      file_key: fileKey,
      file_type: fileType,
      content_type: contentType,
      file_size: fileSize,
      task_id: taskId || null,
      upload_status: 'pending',
    }).returning();

    // Generate presigned URL (valid for 1 hour)
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
      ContentLength: fileSize,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.json({
      uploadUrl,
      fileId,
      fileKey,
      expiresIn: 3600,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileSize.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Confirm upload and generate thumbnail
router.post('/upload/confirm', verifyToken, async (req, res) => {
  try {
    const { fileId } = req.body;
    const userId = req.user!.id;

    // Get file metadata
    const mediaFile = await db.query.media_files.findFirst({
      where: eq(media_files.id, fileId),
    });

    if (!mediaFile || mediaFile.user_id !== userId) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Update status to uploaded
    await db.update(media_files)
      .set({
        upload_status: 'uploaded',
        uploaded_at: new Date(),
      })
      .where(eq(media_files.id, fileId));

    // Generate thumbnail for images
    if (mediaFile.content_type.startsWith('image/')) {
      await generateThumbnail(mediaFile);
    }

    // Transcode video if needed
    if (mediaFile.content_type.startsWith('video/')) {
      // Queue video transcoding job
      await rabbitMQ.publish('media', 'video.transcode', {
        fileId,
        fileKey: mediaFile.file_key,
      });
    }

    res.json({ success: true, fileId });
  } catch (error) {
    console.error('Error confirming upload:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate thumbnail for image
async function generateThumbnail(mediaFile: any) {
  try {
    // Get original image from S3
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: mediaFile.file_key,
    });

    const response = await s3Client.send(getCommand);
    const imageBuffer = Buffer.from(await response.Body!.transformToByteArray());

    // Generate thumbnail
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload thumbnail
    const thumbnailKey = `thumbnails/${mediaFile.id}.jpg`;
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: 'image/jpeg',
    });

    await s3Client.send(putCommand);

    // Update database
    await db.update(media_files)
      .set({
        thumbnail_key: thumbnailKey,
        thumbnail_url: `${process.env.CDN_URL}/${thumbnailKey}`,
      })
      .where(eq(media_files.id, mediaFile.id));
  } catch (error) {
    console.error('Error generating thumbnail:', error);
  }
}

// Download file
router.get('/:id/download', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const mediaFile = await db.query.media_files.findFirst({
      where: eq(media_files.id, id),
    });

    if (!mediaFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Generate presigned URL for download
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: mediaFile.file_key,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    res.json({ downloadUrl, fileName: mediaFile.file_name });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

---

### Service 5: Notification Service

**Responsibility:** In-app notifications, push notifications, email notifications

**Database:** Can share `auth_db`

**Notification Types:**

```typescript
enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_DUE_SOON = 'task_due_soon',
  TASK_OVERDUE = 'task_overdue',
  TASK_COMPLETED = 'task_completed',
  COMMENT_ADDED = 'comment_added',
  MENTION = 'mention',
  PROJECT_INVITE = 'project_invite',
  CALL_STARTED = 'call_started',
  MESSAGE_SENT = 'message_sent',
}

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}
```

**Email Worker:**

```typescript
// backend/services/workers/src/email-worker.ts
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { sendEmail } from '../services/email';

export class EmailWorker {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async onModuleInit() {
    await this.amqpConnection.channel.assertQueue('email', { durable: true });
    await this.amqpConnection.channel.assertExchange('notifications', 'topic', {
      durable: true,
    });
    await this.amqpConnection.channel.bindQueue('email', 'notifications', 'email.*');

    await this.amqpConnection.channel.consume('email', async (msg: ConsumeMessage) => {
      try {
        const { type, to, subject, template, data } = JSON.parse(msg.content.toString());

        console.log(`Processing email: ${type} -> ${to}`);

        await sendEmail({
          to,
          subject,
          template,
          data,
        });

        this.amqpConnection.channel.ack(msg);
      } catch (error) {
        console.error('Error processing email:', error);

        // Move to dead letter queue after 3 retries
        const headers = msg.properties.headers || {};
        const retries = headers['x-retries'] || 0;

        if (retries < 3) {
          headers['x-retries'] = retries + 1;
          this.amqpConnection.channel.nack(msg, false, true);
        } else {
          this.amqpConnection.channel.reject(msg, false);
        }
      }
    });
  }
}

// Email templates
interface EmailTemplate {
  welcome: {
    username: string;
    verifyUrl: string;
  };
  taskAssigned: {
    taskTitle: string;
    projectName: string;
    taskUrl: string;
    assignee: string;
  };
  projectInvite: {
    projectName: string;
    inviteUrl: string;
    invitedBy: string;
  };
}
```

---

## Database Architecture

### Complete Schema Overview

**auth_db (PostgreSQL):**

```sql
-- Core business data
users, sessions, accounts, projects, project_members,
tasks, task_comments, task_attachments, custom_fields,
task_labels, verification_tokens, otps, notifications,
notification_preferences, push_tokens
```

**msg_db (PostgreSQL + TimescaleDB):**

```sql
-- Time-series communication data
messages (hypertable), message_reactions,
call_rooms (hypertable), call_participants (hypertable),
call_recordings (hypertable), presence_history (hypertable)
```

**analytics_db (ClickHouse):**

```sql
-- Analytics and reporting
events (user_actions, page_views, feature_usage),
metrics (daily_active_users, task_completion_rate, call_duration),
aggregations (user_engagement, project_health)
```

### Database Connection Configuration

```typescript
// backend/services/core-service/src/db/connection.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(process.env.DATABASE_URL!, {
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, {
  schema: import('./schema'),
});

// Health check
export async function checkDatabaseHealth() {
  try {
    await db.execute('SELECT 1');
    return { healthy: true };
  } catch (error) {
    return { healthy: false, error: (error as Error).message };
  }
}
```

### Database Partitioning (for large tables)

```sql
-- Partition messages by month for better performance
CREATE TABLE messages_2025_01 PARTITION OF messages
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE messages_2025_02 PARTITION OF messages
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Automatic partition creation
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
  partition_date DATE;
  partition_name TEXT;
  start_date TEXT;
  end_date TEXT;
BEGIN
  partition_date := date_trunc('month', CURRENT_DATE + interval '1 month');
  partition_name := 'messages_' || to_char(partition_date, 'YYYY_MM');
  start_date := partition_date::TEXT;
  end_date := (partition_date + interval '1 month')::TEXT;

  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF messages FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );
END;
$$ LANGUAGE plpgsql;

-- Run monthly
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('create-monthly-partition', '0 0 1 * *', 'SELECT create_monthly_partition()');
```

---

## Implementation Phases

### Phase 1: Infrastructure & Service Extraction (Week 1-2)

**Day 1-2: Docker Compose Setup**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API Gateway
  gateway:
    image: kong:latest
    ports:
      - "8080:8080"
      - "8443:8443"
    environment:
      KONG_DATABASE: "off"
      KONG_PROXY_ACCESS_LOG: /dev/stdout
    volumes:
      - ./docker/kong/kong.yml:/usr/local/kong/declarative/kong.yml:ro
    networks:
      - todaily-network

  # Consul
  consul:
    image: consul:latest
    ports:
      - "8500:8500"
    environment:
      CONSUL_BIND_INTERFACE: eth0
    networks:
      - todaily-network

  # PostgreSQL - Auth DB
  auth-db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: todaily
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - auth-db-data:/var/lib/postgresql/data
    networks:
      - todaily-network

  # PostgreSQL - Message DB
  msg-db:
    image: timescale/timescaledb:latest-pg15
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: msg_db
      POSTGRES_USER: todaily
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - msg-db-data:/var/lib/postgresql/data
    networks:
      - todaily-network

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - todaily-network

  # RabbitMQ
  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: todaily
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    networks:
      - todaily-network

  # Core Service
  core-service:
    build:
      context: ./backend/services/core-service
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://todaily:${DB_PASSWORD}@auth-db:5432/auth_db
      REDIS_URL: redis://redis:6379
      CONSUL_HOST: consul
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - auth-db
      - redis
      - consul
    networks:
      - todaily-network

  # Real-time Service
  realtime-service:
    build:
      context: ./backend/services/realtime-service
      dockerfile: Dockerfile
    ports:
      - "3002:3002"
    environment:
      REDIS_URL: redis://redis:6379
      CONSUL_HOST: consul
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - redis
      - consul
    networks:
      - todaily-network

  # Communication Service
  communication-service:
    build:
      context: ./backend/services/communication-service
      dockerfile: Dockerfile
    ports:
      - "3003:3003"
    environment:
      DATABASE_URL: postgresql://todaily:${DB_PASSWORD}@msg-db:5432/msg_db
      REDIS_URL: redis://redis:6379
      CONSUL_HOST: consul
      LIVEKIT_URL: ${LIVEKIT_URL}
      LIVEKIT_API_KEY: ${LIVEKIT_API_KEY}
      LIVEKIT_API_SECRET: ${LIVEKIT_API_SECRET}
    depends_on:
      - msg-db
      - redis
      - consul
    networks:
      - todaily-network

  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    networks:
      - todaily-network

  # Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
    volumes:
      - grafana-data:/var/lib/grafana
      - ./docker/grafana/provisioning:/etc/grafana/provisioning:ro
    networks:
      - todaily-network

volumes:
  auth-db-data:
  msg-db-data:
  redis-data:
  rabbitmq-data:
  prometheus-data:
  grafana-data:

networks:
  todaily-network:
    driver: bridge
```

**Day 3-4: Extract Auth Service**

```bash
# Create service structure
mkdir -p backend/services/core-service/src/{routes,services,utils,db}
mkdir -p backend/services/core-service/src/modules/{auth,projects,tasks}

# Move existing auth code
cp -r backend/src/modules/auth/* backend/services/core-service/src/modules/auth/
cp -r backend/src/modules/oauth/* backend/services/core-service/src/modules/oauth/
cp -r backend/src/db/* backend/services/core-service/src/db/
cp -r backend/src/services/* backend/services/core-service/src/services/
cp -r backend/src/utils/* backend/services/core-service/src/utils/

# Create package.json
cd backend/services/core-service
npm init -y
npm install express drizzle-orm postgres bcrypt jsonwebtoken
npm install -D typescript @types/node @types/express
```

**Day 5-7: API Gateway Configuration**

```yaml
# docker/kong/kong.yml
_format_version: "3.0"

services:
  # Core Service Routes
  - name: core-service-auth
    url: http://core-service:3001
    routes:
      - name: auth-register
        paths:
          - /api/v1/auth/register
        methods:
          - POST
      - name: auth-login
        paths:
          - /api/v1/auth/login
        methods:
          - POST
      - name: auth-logout
        paths:
          - /api/v1/auth/logout
        methods:
          - POST
    plugins:
      - name: rate-limiting
        config:
          minute: 60
          hour: 1000
          policy: redis
          redis_host: redis
          redis_port: 6379

  - name: core-service-projects
    url: http://core-service:3001
    routes:
      - name: projects
        paths:
          - /api/v1/projects
        strip_path: false
    plugins:
      - name: jwt
        config:
          key_claim_name: kid
          claims_to_verify:
            - exp
      - name: rate-limiting
        config:
          minute: 100
          hour: 2000

  - name: core-service-tasks
    url: http://core-service:3001
    routes:
      - name: tasks
        paths:
          - /api/v1/tasks
        strip_path: false
    plugins:
      - name: jwt
      - name: rate-limiting

  # Communication Service Routes
  - name: communication-service
    url: http://communication-service:3003
    routes:
      - name: messages
        paths:
          - /api/v1/messages
        strip_path: false
      - name: rooms
        paths:
          - /api/v1/rooms
        strip_path: false
    plugins:
      - name: jwt
      - name: rate-limiting
        config:
          minute: 200
          hour: 5000

  # Media Service Routes
  - name: media-service
    url: http://media-service:3004
    routes:
      - name: media
        paths:
          - /api/v1/media
        strip_path: false
    plugins:
      - name: jwt
      - name: rate-limiting
        config:
          minute: 50
          hour: 1000

  # WebSocket Proxy
  - name: realtime-service
    url: http://realtime-service:3002
    routes:
      - name: websocket
        paths:
          - /ws
        protocols:
          - http
          - https
    plugins:
      - name: jwt
```

**Day 8-10: Service Discovery with Consul**

```typescript
// backend/shared/consul-client.ts
import { Consul } from 'consul';

const consul = new Consul({
  host: process.env.CONSUL_HOST || 'localhost',
  port: 8500,
});

export class ServiceRegistry {
  private serviceName: string;
  private serviceId: string;
  private port: number;

  constructor(serviceName: string, port: number) {
    this.serviceName = serviceName;
    this.port = port;
    this.serviceId = `${serviceName}-${process.env.HOSTNAME || 'local'}`;
  }

  async register() {
    await consul.agent.service.register({
      id: this.serviceId,
      name: this.serviceName,
      port: this.port,
      check: {
        http: `http://localhost:${this.port}/health`,
        interval: '10s',
        timeout: '5s',
        deregistercriticalserviceafter: '30s',
      },
      tags: [
        process.env.NODE_ENV || 'development',
        process.env.GIT_COMMIT || 'latest',
      ],
    });

    console.log(`Service ${this.serviceName} registered with Consul`);
  }

  async deregister() {
    await consul.agent.service.deregister(this.serviceId);
    console.log(`Service ${this.serviceName} deregistered from Consul`);
  }

  async getService(serviceName: string): Promise<string | null> {
    const services = await consul.health.service(serviceName, { passing: true });

    if (!services || services.length === 0) {
      return null;
    }

    // Simple round-robin selection
    const service = services[Math.floor(Math.random() * services.length)];
    const address = service.Service.Address || 'localhost';
    const port = service.Service.Port;

    return `http://${address}:${port}`;
  }

  async watchService(serviceName: string, callback: (url: string) => void) {
    const watch = consul.watch({
      method: consul.health.service,
      options: {
        service: serviceName,
        passing: true,
      },
    });

    watch.on('change', (data) => {
      if (data && data.length > 0) {
        const service = data[0];
        const url = `http://${service.Service.Address}:${service.Service.Port}`;
        callback(url);
      }
    });
  }
}

// Usage in each service
// backend/services/core-service/src/app.ts
const registry = new ServiceRegistry('core-service', 3001);

await registry.register();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await registry.deregister();
  process.exit(0);
});
```

---

### Phase 2: Real-time Service (Week 3-4)

**Day 1-3: Socket.io Setup**

```typescript
// backend/services/realtime-service/src/socket/index.ts
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { RedisAdapter } from '@socket.io/redis-adapter';
import { verifyToken } from '../utils/jwt';

export class SocketManager {
  private io: Server;
  private pubClient: ReturnType<typeof createClient>;
  private subClient: ReturnType<typeof createClient>;

  constructor(httpServer: any) {
    // Initialize Redis clients
    this.pubClient = createClient({ url: process.env.REDIS_URL });
    this.subClient = this.pubClient.duplicate();

    // Initialize Socket.io
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'],
        credentials: true,
      },
      pingTimeout: 10000,
      pingInterval: 5000,
      transports: ['websocket', 'polling'],
      adapter: RedisAdapter({
        pubClient: this.pubClient,
        subClient: this.subClient,
      }),
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // JWT authentication
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = await verifyToken(token);
        socket.data = {
          userId: decoded.userId,
          username: decoded.username,
          email: decoded.email,
        };

        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });

    // Rate limiting per user
    this.io.use(async (socket, next) => {
      const userId = socket.data?.userId;
      const key = `socket:rate:${userId}`;

      const current = await this.pubClient.incr(key);
      await this.pubClient.expire(key, 60); // 1 minute window

      if (current > 100) { // Max 100 events per minute
        return next(new Error('Rate limit exceeded'));
      }

      next();
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => this.handleConnection(socket));
  }

  private async handleConnection(socket: any) {
    const userId = socket.data.userId;
    const username = socket.data.username;

    console.log(`User connected: ${username} (${socket.id})`);

    // Join user's personal room for direct messages
    await socket.join(`user:${userId}`);

    // Update presence
    await this.updatePresence(userId, 'online');

    // Set up event handlers
    socket.on('disconnect', () => this.handleDisconnect(socket));
    socket.on('error', (error) => console.error('Socket error:', error));

    // Project events
    socket.on('project:join', (data) => this.handleJoinProject(socket, data));
    socket.on('project:leave', (data) => this.handleLeaveProject(socket, data));

    // Task events
    socket.on('task:update', (data) => this.handleTaskUpdate(socket, data));
    socket.on('task:cursor', (data) => this.handleTaskCursor(socket, data));

    // Typing indicators
    socket.on('typing:start', (data) => this.handleTypingStart(socket, data));
    socket.on('typing:stop', (data) => this.handleTypingStop(socket, data));

    // Presence
    socket.on('presence:update', (data) => this.handlePresenceUpdate(socket, data));

    // Send initial data
    socket.emit('connected', {
      socketId: socket.id,
      userId,
      username,
      timestamp: Date.now(),
    });
  }

  private async handleJoinProject(socket: any, { projectId }: { projectId: string }) {
    const userId = socket.data.userId;
    const room = `project:${projectId}`;

    await socket.join(room);

    // Update Redis
    await this.pubClient.sAdd(`project:${projectId}:users`, userId);
    await this.pubClient.hSet(`presence:${userId}`, {
      currentProject: projectId,
      lastSeen: Date.now(),
    });

    // Notify others
    socket.to(room).emit('project:user_joined', {
      userId,
      username: socket.data.username,
      socketId: socket.id,
      timestamp: Date.now(),
    });

    // Send current online users to the joiner
    const onlineUsers = await this.pubClient.sMembers(`project:${projectId}:users`);
    const usersData = await Promise.all(
      onlineUsers.map(async (id) => ({
        userId: id,
        presence: await this.pubClient.hGetAll(`presence:${id}`),
      }))
    );

    socket.emit('project:users', { projectId, users: usersData });
  }

  private async handleLeaveProject(socket: any, { projectId }: { projectId: string }) {
    const userId = socket.data.userId;
    const room = `project:${projectId}`;

    await socket.leave(room);

    // Update Redis
    await this.pubClient.sRem(`project:${projectId}:users`, userId);

    // Notify others
    socket.to(room).emit('project:user_left', {
      userId,
      username: socket.data.username,
      timestamp: Date.now(),
    });
  }

  private async handleDisconnect(socket: any) {
    const userId = socket.data.userId;
    const username = socket.data.username;

    console.log(`User disconnected: ${username} (${socket.id})`);

    // Check if user has other connections
    const userSockets = await this.io.of('/').in(`user:${userId}`).allSockets();

    if (userSockets.size === 0) {
      await this.updatePresence(userId, 'offline');

      // Remove from all projects
      const projects = Array.from(socket.rooms).filter((r) => r.toString().startsWith('project:'));
      for (const project of projects) {
        await this.pubClient.sRem(`${project}:users`, userId);
        this.io.to(project.toString()).emit('project:user_left', {
          userId,
          username,
          timestamp: Date.now(),
        });
      }
    }
  }

  private async updatePresence(userId: string, status: 'online' | 'offline' | 'away' | 'busy') {
    await this.pubClient.hSet(`presence:${userId}`, {
      status,
      lastSeen: Date.now(),
    });
    await this.pubClient.expire(`presence:${userId}`, 300); // 5 minutes

    // Broadcast to all interested parties
    this.io.emit('presence:updated', {
      userId,
      status,
      timestamp: Date.now(),
    });
  }

  private async handleTaskUpdate(socket: any, data: any) {
    const { taskId, projectId, changes } = data;

    // Broadcast to project members
    this.io.to(`project:${projectId}`).emit('task:updated', {
      taskId,
      changes,
      updatedBy: {
        userId: socket.data.userId,
        username: socket.data.username,
      },
      timestamp: Date.now(),
    });
  }

  private async handleTaskCursor(socket: any, data: any) {
    const { taskId, x, y } = data;

    // Store cursor position in Redis (TTL: 1 minute)
    await this.pubClient.hSet(`cursor:${socket.data.userId}`, {
      taskId,
      x,
      y,
      username: socket.data.username,
      timestamp: Date.now(),
    });
    await this.pubClient.expire(`cursor:${socket.data.userId}`, 60);

    // Broadcast to task viewers
    this.io.to(`task:${taskId}`).emit('cursor:moved', {
      userId: socket.data.userId,
      username: socket.data.username,
      taskId,
      x,
      y,
    });
  }

  private async handleTypingStart(socket: any, { taskId, projectId }: { taskId: string; projectId: string }) {
    const key = `typing:${taskId}:${socket.data.userId}`;
    await this.pubClient.set(key, 'true', { EX: 10 }); // 10 seconds TTL

    socket.to(`project:${projectId}`).emit('typing:started', {
      userId: socket.data.userId,
      username: socket.data.username,
      taskId,
    });
  }

  private async handleTypingStop(socket: any, { taskId, projectId }: { taskId: string; projectId: string }) {
    const key = `typing:${taskId}:${socket.data.userId}`;
    await this.pubClient.del(key);

    socket.to(`project:${projectId}`).emit('typing:stopped', {
      userId: socket.data.userId,
      taskId,
    });
  }

  private async handlePresenceUpdate(socket: any, { status }: { status: string }) {
    await this.updatePresence(socket.data.userId, status);
  }

  // Public method to broadcast events from other services
  async broadcast(event: string, data: any, room?: string) {
    if (room) {
      this.io.to(room).emit(event, data);
    } else {
      this.io.emit(event, data);
    }
  }
}
```

**Day 4-7: Presence System**

```typescript
// backend/services/realtime-service/src/services/presence.ts
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });

export interface PresenceData {
  userId: string;
  username: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  currentProject?: string;
  lastSeen: number;
  avatar?: string;
}

export class PresenceService {
  async getUserPresence(userId: string): Promise<PresenceData | null> {
    const data = await redis.hGetAll(`presence:${userId}`);

    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      userId,
      username: data.username || '',
      status: data.status as PresenceData['status'],
      currentProject: data.currentProject,
      lastSeen: parseInt(data.lastSeen),
      avatar: data.avatar,
    };
  }

  async getProjectPresence(projectId: string): Promise<PresenceData[]> {
    const userIds = await redis.sMembers(`project:${projectId}:users`);

    const presences = await Promise.all(
      userIds.map(async (userId) => this.getUserPresence(userId))
    );

    return presences.filter((p): p is PresenceData => p !== null);
  }

  async updatePresence(userId: string, updates: Partial<PresenceData>): Promise<void> {
    await redis.hSet(`presence:${userId}`, updates as any);
    await redis.expire(`presence:${userId}`, 300);
  }

  async setOnline(userId: string, projectId: string, userData: Partial<PresenceData>): Promise<void> {
    await redis.sAdd(`project:${projectId}:users`, userId);
    await redis.hSet(`presence:${userId}`, {
      status: 'online',
      currentProject: projectId,
      lastSeen: Date.now(),
      ...userData,
    });
    await redis.expire(`presence:${userId}`, 300);
  }

  async setOffline(userId: string): Promise<void> {
    const data = await redis.hGetAll(`presence:${userId}`);
    const projectId = data.currentProject;

    if (projectId) {
      await redis.sRem(`project:${projectId}:users`, userId);
    }

    await redis.hSet(`presence:${userId}`, {
      status: 'offline',
      lastSeen: Date.now(),
      currentProject: '',
    });
    await redis.expire(`presence:${userId}`, 300); // Keep for 5 minutes
  }

  async getUsersTyping(taskId: string): Promise<string[]> {
    const keys = await redis.keys(`typing:${taskId}:*`);
    const userIds = keys.map((key) => key.split(':')[2]);

    // Check if keys still exist
    const activeUsers = await Promise.all(
      userIds.map(async (userId) => {
        const exists = await redis.exists(`typing:${taskId}:${userId}`);
        return exists ? userId : null;
      })
    );

    return activeUsers.filter((u): u is string => u !== null);
  }
}
```

---

### Phase 3: Message Queue & Workers (Week 5-6)

**Day 1-3: RabbitMQ Setup**

```typescript
// backend/shared/rabbitmq.ts
import amqp, { Channel, Connection } from 'amqplib';

export class RabbitMQClient {
  private static instance: RabbitMQClient;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor() {}

  static getInstance(): RabbitMQClient {
    if (!RabbitMQClient.instance) {
      RabbitMQClient.instance = new RabbitMQClient();
    }
    return RabbitMQClient.instance;
  }

  async connect(url: string): Promise<void> {
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();

    this.connection.on('error', (err) => console.error('RabbitMQ connection error:', err));
    this.connection.on('close', () => {
      console.log('RabbitMQ connection closed, reconnecting...');
      setTimeout(() => this.connect(url), 5000);
    });

    await this.setupExchangesAndQueues();
  }

  private async setupExchangesAndQueues(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');

    // Declare exchanges
    await this.channel.assertExchange('notifications', 'topic', { durable: true });
    await this.channel.assertExchange('media', 'topic', { durable: true });
    await this.channel.assertExchange('analytics', 'topic', { durable: true });

    // Declare queues
    await this.channel.assertQueue('email', { durable: true });
    await this.channel.assertQueue('push', { durable: true });
    await this.channel.assertQueue('analytics', { durable: true });
    await this.channel.assertQueue('media-processing', { durable: true });

    // Dead letter queues
    await this.channel.assertQueue('email-dlq', { durable: true });
    await this.channel.assertQueue('push-dlq', { durable: true });

    // Bind queues to exchanges
    await this.channel.bindQueue('email', 'notifications', 'email.*');
    await this.channel.bindQueue('push', 'notifications', 'push.*');
    await this.channel.bindQueue('analytics', 'analytics', '#');
    await this.channel.bindQueue('media-processing', 'media', '#');

    // Configure dead letter queues
    await this.channel.bindQueue('email-dlq', 'notifications', 'email.dlq');
    await this.channel.bindQueue('push-dlq', 'notifications', 'push.dlq');
  }

  async publish(exchange: string, routingKey: string, message: any): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');

    const content = Buffer.from(JSON.stringify(message));
    const options = {
      contentType: 'application/json',
      deliveryMode: 2, // Persistent
      timestamp: Date.now(),
      messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    this.channel.publish(exchange, routingKey, content, options);
  }

  async consume(
    queue: string,
    handler: (message: any, content: any) => Promise<void>,
    options: { prefetch?: number; retries?: number } = {}
  ): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');

    const { prefetch = 10, retries = 3 } = options;

    await this.channel.prefetch(prefetch);

    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        const headers = msg.properties.headers || {};
        const retryCount = headers['x-retry-count'] || 0;

        await handler(msg, content);

        this.channel!.ack(msg);
      } catch (error) {
        console.error(`Error processing message from ${queue}:`, error);

        const headers = msg.properties.headers || {};
        const retryCount = (headers['x-retry-count'] || 0) + 1;

        if (retryCount < retries) {
          // Retry message
          headers['x-retry-count'] = retryCount;
          this.channel!.nack(msg, false, true);
        } else {
          // Move to dead letter queue
          const dlqQueue = queue.includes('-') ? queue.split('-')[0] + '-dlq' : queue + '-dlq';
          this.channel!.sendToQueue(dlqQueue, msg.content, {
            headers: { ...headers, 'x-original-queue': queue, 'x-error': (error as Error).message },
          });
          this.channel!.ack(msg);
        }
      }
    });
  }

  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}

// Export singleton instance
export const rabbitMQ = RabbitMQClient.getInstance();
```

**Day 4-7: Email Worker**

```typescript
// backend/services/workers/src/email-worker.ts
import { rabbitMQ } from '@todaily/shared/rabbitmq';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailPayload {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export class EmailWorker {
  async start(): Promise<void> {
    await rabbitMQ.connect(process.env.RABBITMQ_URL!);

    await rabbitMQ.consume('email', async (msg, content: EmailPayload) => {
      console.log(`Processing email: ${content.template} -> ${content.to}`);

      const result = await this.sendEmail(content);

      console.log(`Email sent successfully: ${result}`);
    });
  }

  private async sendEmail(payload: EmailPayload): Promise<string> {
    const html = await this.renderTemplate(payload.template, payload.data);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: payload.to,
      subject: payload.subject,
      html,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data.id;
  }

  private async renderTemplate(template: string, data: Record<string, any>): Promise<string> {
    // Template rendering logic
    const templates: Record<string, (data: any) => string> = {
      welcome: (d) => `
        <h1>Welcome to Todaily!</h1>
        <p>Hello ${d.username},</p>
        <p>Welcome to Todaily! Please verify your email by clicking the link below:</p>
        <a href="${d.verifyUrl}">Verify Email</a>
      `,
      'task-assigned': (d) => `
        <h1>Task Assigned</h1>
        <p>Hello ${d.assigneeName},</p>
        <p>You have been assigned to a new task:</p>
        <h2>${d.taskTitle}</h2>
        <p>Project: ${d.projectName}</p>
        <a href="${d.taskUrl}">View Task</a>
      `,
      'project-invite': (d) => `
        <h1>Project Invitation</h1>
        <p>You have been invited to join the project <strong>${d.projectName}</strong></p>
        <p>Invited by: ${d.invitedByName}</p>
        <a href="${d.inviteUrl}">Accept Invitation</a>
      `,
    };

    const renderFn = templates[template];
    if (!renderFn) {
      throw new Error(`Unknown template: ${template}`);
    }

    return renderFn(data);
  }
}

// Start the worker
const worker = new EmailWorker();
worker.start().catch(console.error);
```

---

### Phase 4: Communication Service (Week 7-8)

**Day 1-3: Message API Implementation**

```typescript
// backend/services/communication-service/src/routes/messages.ts
import { Router } from 'express';
import { db } from '../db';
import { messages, projects, project_members, users } from '../db/schema';
import { eq, and, desc, lt, inArray } from 'drizzle-orm';
import { rabbitMQ } from '@todaily/shared/rabbitmq';
import { verifyToken } from '../utils/jwt';

const router = Router();

// GET /api/v1/projects/:projectId/messages
router.get('/projects/:projectId/messages', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.id;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const before = req.query.before as string | undefined;
    const threadId = req.query.threadId as string | undefined;

    // Verify user is a project member
    const memberCheck = await db.query.project_members.findFirst({
      where: and(
        eq(project_members.project_id, projectId),
        eq(project_members.user_id, userId)
      ),
    });

    if (!memberCheck) {
      return res.status(403).json({ error: 'Not a project member' });
    }

    // Build query
    let conditions = [eq(messages.project_id, projectId)];

    if (before) {
      conditions.push(lt(messages.created_at, new Date(before)));
    }

    if (threadId) {
      conditions.push(eq(messages.thread_id, threadId));
    }

    const messagesList = await db
      .select({
        id: messages.id,
        content: messages.content,
        threadId: messages.thread_id,
        parentId: messages.parent_id,
        userId: messages.user_id,
        mentions: messages.mentions,
        attachments: messages.attachments,
        createdAt: messages.created_at,
        updatedAt: messages.updated_at,
        user: {
          id: users.id,
          username: users.username,
          profilePicture: users.profile_picture_url,
        },
      })
      .from(messages)
      .innerJoin(users, eq(messages.user_id, users.id))
      .where(and(...conditions))
      .orderBy(desc(messages.created_at))
      .limit(limit + 1); // Fetch one extra to check for more

    const hasMore = messagesList.length > limit;
    const result = hasMore ? messagesList.slice(0, -1) : messagesList;

    res.json({
      messages: result.reverse(),
      hasMore,
      nextCursor: hasMore ? result[result.length - 1].createdAt.toISOString() : null,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/projects/:projectId/messages
router.post('/projects/:projectId/messages', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.id;
    const { content, threadId, parentId, mentions, attachments } = req.body;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (content.length > 10000) {
      return res.status(400).json({ error: 'Message too long (max 10000 characters)' });
    }

    // Verify user is a project member
    const memberCheck = await db.query.project_members.findFirst({
      where: and(
        eq(project_members.project_id, projectId),
        eq(project_members.user_id, userId)
      ),
    });

    if (!memberCheck) {
      return res.status(403).json({ error: 'Not a project member' });
    }

    // If replying to a message, verify thread exists
    let targetThreadId = threadId;
    if (parentId && !threadId) {
      const parentMessage = await db.query.messages.findFirst({
        where: eq(messages.id, parentId),
      });

      if (!parentMessage) {
        return res.status(404).json({ error: 'Parent message not found' });
      }

      targetThreadId = parentMessage.thread_id;
    }

    // Create message
    const [message] = await db
      .insert(messages)
      .values({
        id: crypto.randomUUID(),
        project_id: projectId,
        thread_id: targetThreadId || crypto.randomUUID(),
        parent_id: parentId || null,
        user_id: userId,
        content: content.trim(),
        mentions: mentions || [],
        attachments: attachments || null,
      })
      .returning();

    // Fetch message with user data
    const messageWithUser = await db.query.messages.findFirst({
      where: eq(messages.id, message.id),
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    // Publish to message queue for notifications
    if (mentions && mentions.length > 0) {
      await rabbitMQ.publish('notifications', 'email.send', {
        type: 'mention',
        recipients: mentions,
        data: {
          messageId: message.id,
          projectId,
          content: content.substring(0, 100),
          mentionedBy: req.user!.username,
        },
      });
    }

    // Publish to WebSocket for real-time updates
    await rabbitMQ.publish('notifications', 'websocket.broadcast', {
      event: 'message_created',
      room: `project:${projectId}`,
      data: messageWithUser,
    });

    res.status(201).json(messageWithUser);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/v1/messages/:id
router.patch('/messages/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { content, attachments } = req.body;

    // Get message
    const message = await db.query.messages.findFirst({
      where: eq(messages.id, id),
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check ownership
    if (message.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this message' });
    }

    // Check if message is too old (15 minutes)
    const messageAge = Date.now() - message.createdAt.getTime();
    if (messageAge > 15 * 60 * 1000) {
      return res.status(400).json({ error: 'Message too old to edit (max 15 minutes)' });
    }

    // Update message
    const [updatedMessage] = await db
      .update(messages)
      .set({
        content: content || message.content,
        attachments: attachments || message.attachments,
        updated_at: new Date(),
      })
      .where(eq(messages.id, id))
      .returning();

    // Publish real-time update
    await rabbitMQ.publish('notifications', 'websocket.broadcast', {
      event: 'message_updated',
      room: `project:${message.project_id}`,
      data: updatedMessage,
    });

    res.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/messages/:id
router.delete('/messages/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Get message
    const message = await db.query.messages.findFirst({
      where: eq(messages.id, id),
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check ownership or project admin
    const memberCheck = await db.query.project_members.findFirst({
      where: and(
        eq(project_members.project_id, message.project_id),
        eq(project_members.user_id, userId)
      ),
    });

    if (!memberCheck || (message.user_id !== userId && memberCheck.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    // Soft delete
    await db
      .update(messages)
      .set({
        is_deleted: true,
        content: '[Deleted]',
        attachments: null,
        updated_at: new Date(),
      })
      .where(eq(messages.id, id));

    // Publish real-time update
    await rabbitMQ.publish('notifications', 'websocket.broadcast', {
      event: 'message_deleted',
      room: `project:${message.project_id}`,
      data: { messageId: id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

**Day 4-7: WebRTC Implementation with LiveKit**

```typescript
// backend/services/communication-service/src/routes/rooms.ts
import { Router } from 'express';
import { LiveKitService } from '../services/livekit';
import { db } from '../db';
import { call_rooms, call_participants } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '../utils/jwt';

const router = Router();
const liveKit = new LiveKitService();

// POST /api/v1/rooms
router.post('/rooms', verifyToken, async (req, res) => {
  try {
    const { name, type = 'video', projectId, maxParticipants = 10 } = req.body;
    const userId = req.user!.id;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    // Create room in LiveKit
    const room = await liveKit.createRoom({
      name: name.trim(),
      type,
      projectId,
      maxParticipants,
      createdBy: userId,
    });

    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// POST /api/v1/rooms/:roomId/join
router.post('/rooms/:roomId/join', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user!.id;
    const { username = req.user!.username } = req.body;

    // Get room from database
    const room = await db.query.call_rooms.findFirst({
      where: eq(call_rooms.id, roomId),
    });

    if (!room || !room.is_active) {
      return res.status(404).json({ error: 'Room not found or inactive' });
    }

    // Check if room is full
    const participantCount = await db.query.call_participants.findMany({
      where: and(eq(call_participants.room_id, roomId), eq(call_participants.left_at, null as any)),
    });

    if (participantCount.length >= room.max_participants) {
      return res.status(400).json({ error: 'Room is full' });
    }

    // Generate LiveKit token
    const token = await liveKit.generateToken({
      roomName: room.room_name,
      participantName: username,
      userId,
    });

    // Add participant to database
    await db.insert(call_participants).values({
      id: crypto.randomUUID(),
      room_id: roomId,
      user_id: userId,
      joined_at: new Date(),
    });

    res.json({
      ...token,
      roomId: room.id,
      roomName: room.room_name,
      type: room.type,
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// POST /api/v1/rooms/:roomId/leave
router.post('/rooms/:roomId/leave', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user!.id;

    // Update participant record
    await db
      .update(call_participants)
      .set({
        left_at: new Date(),
      })
      .where(
        and(
          eq(call_participants.room_id, roomId),
          eq(call_participants.user_id, userId),
          eq(call_participants.left_at, null as any)
        )
      );

    res.json({ success: true });
  } catch (error) {
    console.error('Error leaving room:', error);
    res.status(500).json({ error: 'Failed to leave room' });
  }
});

// GET /api/v1/rooms/:roomId/participants
router.get('/rooms/:roomId/participants', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;

    const participants = await liveKit.getParticipants(roomId);

    res.json({ participants });
  } catch (error) {
    console.error('Error getting participants:', error);
    res.status(500).json({ error: 'Failed to get participants' });
  }
});

// POST /api/v1/rooms/:roomId/record
router.post('/rooms/:roomId/record', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user!.id;

    // Check if user is the room creator
    const room = await db.query.call_rooms.findFirst({
      where: eq(call_rooms.id, roomId),
    });

    if (!room || room.created_by !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Start recording
    const recording = await liveKit.startRecording(room.room_name);

    // Update database
    await db
      .update(call_rooms)
      .set({
        recording_enabled: true,
      })
      .where(eq(call_rooms.id, roomId));

    // Save recording metadata
    await db.insert(call_recordings).values({
      id: crypto.randomUUID(),
      room_id: roomId,
      recording_url: recording.url,
      format: 'mp4',
    });

    res.json({ recordingId: recording.recordingId, status: 'started' });
  } catch (error) {
    console.error('Error starting recording:', error);
    res.status(500).json({ error: 'Failed to start recording' });
  }
});

// DELETE /api/v1/rooms/:roomId
router.delete('/rooms/:roomId', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user!.id;

    // Check if user is the room creator
    const room = await db.query.call_rooms.findFirst({
      where: eq(call_rooms.id, roomId),
    });

    if (!room || room.created_by !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // End room in LiveKit
    await liveKit.endRoom(room.room_name);

    // Update database
    await db
      .update(call_rooms)
      .set({
        is_active: false,
        ended_at: new Date(),
      })
      .where(eq(call_rooms.id, roomId));

    // Update all active participants
    await db
      .update(call_participants)
      .set({
        left_at: new Date(),
      })
      .where(
        and(
          eq(call_participants.room_id, roomId),
          eq(call_participants.left_at, null as any)
        )
      );

    res.json({ success: true });
  } catch (error) {
    console.error('Error ending room:', error);
    res.status(500).json({ error: 'Failed to end room' });
  }
});

export default router;
```

---

### Phase 5: Observability (Week 9)

**Day 1-2: Structured Logging**

```typescript
// backend/shared/logger.ts
import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});

// Request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
    }, 'HTTP request');
  });

  next();
};

// Error logging middleware
export const errorLogger = (error: any, req: any, res: any, next: any) => {
  logger.error({
    error,
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers,
    userId: req.user?.id,
  }, 'Request error');

  next(error);
};
```

**Day 3-4: Prometheus Metrics**

```typescript
// backend/shared/metrics.ts
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

export const metricsRegistry = new Registry();

// Default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register: metricsRegistry });

// HTTP request counter
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'service'],
  registers: [metricsRegistry],
});

// HTTP request duration histogram
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code', 'service'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [metricsRegistry],
});

// Active connections gauge
export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['service'],
  registers: [metricsRegistry],
});

// Database query duration
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['operation', 'table', 'service'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  registers: [metricsRegistry],
});

// WebSocket connections
export const websocketConnections = new Gauge({
  name: 'websocket_connections',
  help: 'Number of active WebSocket connections',
  labelNames: ['service'],
  registers: [metricsRegistry],
});

// WebSocket messages
export const websocketMessagesTotal = new Counter({
  name: 'websocket_messages_total',
  help: 'Total number of WebSocket messages',
  labelNames: ['direction', 'event', 'service'],
  registers: [metricsRegistry],
});

// Task operations
export const taskOperationsTotal = new Counter({
  name: 'task_operations_total',
  help: 'Total number of task operations',
  labelNames: ['operation', 'service'],
  registers: [metricsRegistry],
});

// Message queue metrics
export const mqMessagesProcessed = new Counter({
  name: 'mq_messages_processed_total',
  help: 'Total number of messages processed from queue',
  labelNames: ['queue', 'status', 'worker'],
  registers: [metricsRegistry],
});

export const mqMessagesProcessingTime = new Histogram({
  name: 'mq_message_processing_seconds',
  help: 'Time taken to process a message from queue',
  labelNames: ['queue', 'worker'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
  registers: [metricsRegistry],
});

// Middleware to track HTTP requests
export const metricsMiddleware = (serviceName: string) => {
  return (req: any, res: any, next: any) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route?.path || req.url;

      httpRequestsTotal.inc({
        method: req.method,
        route,
        status_code: res.statusCode,
        service: serviceName,
      });

      httpRequestDuration.observe({
        method: req.method,
        route,
        status_code: res.statusCode,
        service: serviceName,
      }, duration);
    });

    next();
  };
};

// Metrics endpoint
export const metricsEndpoint = async (req: any, res: any) => {
  res.set('Content-Type', metricsRegistry.contentType);
  res.end(await metricsRegistry.metrics());
};
```

**Day 5-6: Distributed Tracing with Jaeger**

```typescript
// backend/shared/tracing.ts
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-trace-jaeger';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';

export function setupTracing(serviceName: string) {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.GIT_COMMIT || '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
    }),
  });

  // Configure Jaeger exporter
  const exporter = new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();

  // Register instrumentations
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new PinoInstrumentation(),
    ],
    tracerProvider: provider,
  });

  console.log(`Tracing initialized for ${serviceName}`);
}
```

**Day 7: Sentry Error Tracking**

```typescript
// backend/shared/sentry.ts
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function setupSentry(serviceName: string) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.GIT_COMMIT || '1.0.0',

    integrations: [
      new ProfilingIntegration(),
      nodeProfilingIntegration(),
      Sentry.httpIntegration({
        tracing: true,
      }),
      Sentry.expressIntegration({
        errorHandler: false,
      }),
    ],

    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    beforeSend(event, hint) {
      // Filter out sensitive data
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }

      // Add custom context
      event.tags = {
        ...event.tags,
        service: serviceName,
      };

      return event;
    },
  });

  console.log(`Sentry initialized for ${serviceName}`);
}

// Request handler for Sentry
export const sentryRequestHandler = Sentry.Handlers.requestHandler();
export const sentryTracingHandler = Sentry.Handlers.tracingHandler();
export const sentryErrorHandler = Sentry.Handlers.errorHandler();
```

---

## Code Examples & Configurations

### Docker Compose (Complete)

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Infrastructure
  gateway:
    image: kong:3.4-alpine
    ports:
      - "8080:8080"
      - "8443:8443"
      - "8001:8001"
    environment:
      KONG_DATABASE: "off"
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_DECLARATIVE_CONFIG: /usr/local/kong/declarative/kong.yml
    volumes:
      - ./docker/kong/kong.yml:/usr/local/kong/declarative/kong.yml:ro
    networks:
      - todaily-network
    healthcheck:
      test: ["CMD", "kong", "health"]
      interval: 10s
      timeout: 5s
      retries: 3

  consul:
    image: consul:1.15
    ports:
      - "8500:8500"
      - "8600:8600/udp"
    environment:
      CONSUL_BIND_INTERFACE: eth0
      CONSUL_CLIENT_INTERFACE: eth0
    volumes:
      - consul-data:/consul/data
    networks:
      - todaily-network
    command: agent -server -ui -bootstrap-expect=1 -client=0.0.0.0

  # Databases
  auth-db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: todaily
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme}
      POSTGRES_INITDB_ARGS: '-E UTF8 --locale=C'
    volumes:
      - auth-db-data:/var/lib/postgresql/data
      - ./docker/postgres/auth-db-init:/docker-entrypoint-initdb.d:ro
    networks:
      - todaily-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U todaily"]
      interval: 10s
      timeout: 5s
      retries: 5

  msg-db:
    image: timescale/timescaledb-ha:pg15
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: msg_db
      POSTGRES_USER: todaily
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme}
      POSTGRES_INITDB_ARGS: '-E UTF8 --locale=C'
    volumes:
      - msg-db-data:/home/postgres/pgdata/data
      - ./docker/postgres/msg-db-init:/docker-entrypoint-initdb.d:ro
    networks:
      - todaily-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U todaily"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Cache & Message Queue
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: >
      redis-server
      --appendonly yes
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    networks:
      - todaily-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: todaily
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD:-changeme}
      RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS: -rabbit log_levels [{connection,error},{default,warning}]
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
      - ./docker/rabbitmq/enabled_plugins:/etc/rabbitmq/enabled_plugins:ro
      - ./docker/rabbitmq/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf:ro
    networks:
      - todaily-network
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Services
  core-service:
    build:
      context: ./backend/services/core-service
      dockerfile: Dockerfile
      target: production
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://todaily:${DB_PASSWORD:-changeme}@auth-db:5432/auth_db
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://todaily:${RABBITMQ_PASSWORD:-changeme}@rabbitmq:5672
      CONSUL_HOST: consul
      JWT_SECRET: ${JWT_SECRET:-changeme}
      SENTRY_DSN: ${SENTRY_DSN}
      JAEGER_ENDPOINT: http://jaeger:14268/api/traces
    depends_on:
      auth-db:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
      consul:
        condition: service_started
    networks:
      - todaily-network
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  realtime-service:
    build:
      context: ./backend/services/realtime-service
      dockerfile: Dockerfile
      target: production
    ports:
      - "3002:3002"
    environment:
      NODE_ENV: production
      REDIS_URL: redis://redis:6379
      CONSUL_HOST: consul
      JWT_SECRET: ${JWT_SECRET:-changeme}
      SENTRY_DSN: ${SENTRY_DSN}
      JAEGER_ENDPOINT: http://jaeger:14268/api/traces
    depends_on:
      redis:
        condition: service_healthy
      consul:
        condition: service_started
    networks:
      - todaily-network
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3002/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  communication-service:
    build:
      context: ./backend/services/communication-service
      dockerfile: Dockerfile
      target: production
    ports:
      - "3003:3003"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://todaily:${DB_PASSWORD:-changeme}@msg-db:5432/msg_db
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://todaily:${RABBITMQ_PASSWORD:-changeme}@rabbitmq:5672
      CONSUL_HOST: consul
      LIVEKIT_URL: ${LIVEKIT_URL:-https://livekit.example.com}
      LIVEKIT_API_KEY: ${LIVEKIT_API_KEY}
      LIVEKIT_API_SECRET: ${LIVEKIT_API_SECRET}
      SENTRY_DSN: ${SENTRY_DSN}
      JAEGER_ENDPOINT: http://jaeger:14268/api/traces
    depends_on:
      msg-db:
        condition: service_healthy
      redis:
        condition: service_healthy
      consul:
        condition: service_started
    networks:
      - todaily-network
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3003/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  media-service:
    build:
      context: ./backend/services/media-service
      dockerfile: Dockerfile
      target: production
    ports:
      - "3004:3004"
    environment:
      NODE_ENV: production
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://todaily:${RABBITMQ_PASSWORD:-changeme}@rabbitmq:5672
      CONSUL_HOST: consul
      S3_ENDPOINT: ${S3_ENDPOINT:-https://storage.example.com}
      S3_ACCESS_KEY_ID: ${S3_ACCESS_KEY_ID}
      S3_SECRET_ACCESS_KEY: ${S3_SECRET_ACCESS_KEY}
      S3_BUCKET_NAME: ${S3_BUCKET_NAME:-todaily}
      CDN_URL: ${CDN_URL:-https://cdn.example.com}
      SENTRY_DSN: ${SENTRY_DSN}
      JAEGER_ENDPOINT: http://jaeger:14268/api/traces
    depends_on:
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - todaily-network
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3004/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Workers
  email-worker:
    build:
      context: ./backend/services/workers
      dockerfile: Dockerfile
      target: production
    command: node dist/email-worker.js
    environment:
      NODE_ENV: production
      RABBITMQ_URL: amqp://todaily:${RABBITMQ_PASSWORD:-changeme}@rabbitmq:5672
      RESEND_API_KEY: ${RESEND_API_KEY}
      EMAIL_FROM: ${EMAIL_FROM:-noreply@todaily.com}
      SENTRY_DSN: ${SENTRY_DSN}
    depends_on:
      rabbitmq:
        condition: service_healthy
    networks:
      - todaily-network
    deploy:
      replicas: 2
    restart: unless-stopped

  push-worker:
    build:
      context: ./backend/services/workers
      dockerfile: Dockerfile
      target: production
    command: node dist/push-worker.js
    environment:
      NODE_ENV: production
      RABBITMQ_URL: amqp://todaily:${RABBITMQ_PASSWORD:-changeme}@rabbitmq:5672
      FCM_PROJECT_ID: ${FCM_PROJECT_ID}
      FCM_PRIVATE_KEY: ${FCM_PRIVATE_KEY}
      FCM_CLIENT_EMAIL: ${FCM_CLIENT_EMAIL}
      SENTRY_DSN: ${SENTRY_DSN}
    depends_on:
      rabbitmq:
        condition: service_healthy
    networks:
      - todaily-network
    deploy:
      replicas: 2
    restart: unless-stopped

  # Observability
  prometheus:
    image: prom/prometheus:v2.47.0
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
      - '--web.enable-lifecycle'
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./docker/prometheus/recording_rules.yml:/etc/prometheus/recording_rules.yml:ro
      - ./docker/prometheus/alert_rules.yml:/etc/prometheus/alert_rules.yml:ro
      - prometheus-data:/prometheus
    networks:
      - todaily-network

  grafana:
    image: grafana/grafana:10.1.0
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD:-admin}
      GF_INSTALL_PLUGINS: grafana-piechart-panel,grafana-worldmap-panel
      GF_SERVER_ROOT_URL: ${GRAFANA_URL:-http://localhost:3000}
    volumes:
      - grafana-data:/var/lib/grafana
      - ./docker/grafana/provisioning:/etc/grafana/provisioning:ro
      - ./docker/grafana/dashboards:/var/lib/grafana/dashboards:ro
    networks:
      - todaily-network
    depends_on:
      - prometheus

  jaeger:
    image: jaegertracing/all-in-one:1.50
    ports:
      - "16686:16686" # UI
      - "14268:14268" # HTTP collector
      - "4318:4318"   # OTLP HTTP
    environment:
      COLLECTOR_OTLP_ENABLED: true
    networks:
      - todaily-network

  loki:
    image: grafana/loki:2.9.0
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    volumes:
      - ./docker/loki/loki-config.yaml:/etc/loki/local-config.yaml:ro
      - loki-data:/tmp/loki
    networks:
      - todaily-network

volumes:
  auth-db-data:
  msg-db-data:
  redis-data:
  rabbitmq-data:
  consul-data:
  prometheus-data:
  grafana-data:
  loki-data:

networks:
  todaily-network:
    driver: bridge
```

---

## Deployment Strategy

### Production Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐             │
│  │   CDN      │   │   WAF      │   │   DDoS     │             │
│  │(Cloudflare)│   │ (Cloudflare)│   │Protection  │             │
│  └─────┬──────┘   └─────┬──────┘   └─────┬──────┘             │
│        │                 │                 │                   │
│        └─────────────────┴─────────────────┘                   │
│                          │                                      │
│                   ┌──────▼──────┐                               │
│                   │ Load Balancer│                             │
│                   │  (NGINX/HAProxy)│                          │
│                   └──────┬──────┘                               │
│                          │                                      │
│     ┌────────────────────┼────────────────────┐                │
│     │                    │                    │                │
│  ┌──▼────────┐      ┌────▼─────┐       ┌─────▼─────┐          │
│  │  API GW  │      │  API GW  │       │  API GW   │          │
│  │  (Kong)  │      │  (Kong)  │       │  (Kong)   │          │
│  └──┬────────┘      └────┬─────┘       └─────┬─────┘          │
│     │                    │                    │                │
│     └────────────────────┼────────────────────┘                │
│                          │                                      │
│     ┌────────────────────┼────────────────────┐                │
│     │                    │                    │                │
│  ┌──▼──────────┐    ┌────▼──────┐    ┌───────▼─────┐          │
│  │ Core Svc    │    │ Core Svc  │    │  Core Svc   │          │
│  │ (K8s Pod)   │    │ (K8s Pod) │    │  (K8s Pod)  │          │
│  └──────────────┘    └───────────┘    └─────────────┘          │
│                                                                  │
│  Kubernetes Cluster (EKS/GKE/AKS)                             │
│  - 3+ nodes per AZ                                             │
│  - Auto-scaling based on CPU/memory                           │
│  - Horizontal Pod Autoscaler                                   │
│  - Pod Disruption Budgets                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Kubernetes Deployment Manifests

```yaml
# kubernetes/core-service/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: core-service
  namespace: todaily
  labels:
    app: core-service
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: core-service
  template:
    metadata:
      labels:
        app: core-service
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3001"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: core-service
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
        - name: core-service
          image: todaily/core-service:latest
          imagePullPolicy: Always
          ports:
            - name: http
              containerPort: 3001
              protocol: TCP
          env:
            - name: NODE_ENV
              value: "production"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: database-secrets
                  key: auth-db-url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: redis-secrets
                  key: url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: jwt-secrets
                  key: secret
            - name: SENTRY_DSN
              valueFrom:
                secretKeyRef:
                  name: sentry-secrets
                  key: dsn
            - name: JAEGER_ENDPOINT
              value: "http://jaeger-collector:14268/api/traces"
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 2
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "sleep 10"]
      terminationGracePeriodSeconds: 30
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - core-service
                topologyKey: kubernetes.io/hostname
---
apiVersion: v1
kind: Service
metadata:
  name: core-service
  namespace: todaily
  labels:
    app: core-service
spec:
  type: ClusterIP
  ports:
    - port: 3001
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app: core-service
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: core-service-hpa
  namespace: todaily
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: core-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 30
        - type: Pods
          value: 2
          periodSeconds: 60
      selectPolicy: Max
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: core-service-pdb
  namespace: todaily
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: core-service
```

---

## Testing Strategy

### Unit Testing

```typescript
// backend/services/core-service/src/__tests__/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { db } from '../db';
import { AuthService } from '../services/auth';
import { hashPassword } from '../utils/crypto';

describe('AuthService', () => {
  let authService: AuthService;

  beforeAll(async () => {
    authService = new AuthService();
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.migrate.rollback();
    await db.destroy();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
      };

      const user = await authService.register(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.password_hash).not.toBe(userData.password);
      expect(user.is_verified).toBe(false);
    });

    it('should not allow duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser2',
      };

      await expect(authService.register(userData)).rejects.toThrow('Email already exists');
    });

    it('should hash password', async () => {
      const plainPassword = 'MySecurePassword123!';
      const hashedPassword = await hashPassword(plainPassword);

      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBe(60); // bcrypt hash length
      expect(hashedPassword).toMatch(/^\$2[aby]\$/); // bcrypt format
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      };

      const result = await authService.login(credentials);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
    });

    it('should reject invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should reject unverified email', async () => {
      // Create unverified user
      await authService.register({
        email: 'unverified@example.com',
        password: 'SecurePassword123!',
        firstName: 'Unverified',
        lastName: 'User',
        username: 'unverified',
      });

      const credentials = {
        email: 'unverified@example.com',
        password: 'SecurePassword123!',
      };

      await expect(authService.login(credentials)).rejects.toThrow('Email not verified');
    });
  });

  describe('refreshToken', () => {
    it('should generate new access token', async () => {
      const loginResult = await authService.login({
        email: 'test@example.com',
        password: 'SecurePassword123!',
      });

      const refreshResult = await authService.refreshToken(loginResult.refreshToken);

      expect(refreshResult).toHaveProperty('accessToken');
      expect(refreshResult).toHaveProperty('refreshToken');
      expect(refreshResult.accessToken).not.toBe(loginResult.accessToken);
    });

    it('should reject invalid refresh token', async () => {
      await expect(authService.refreshToken('invalid-token')).rejects.toThrow('Invalid refresh token');
    });
  });
});
```

### Integration Testing

```typescript
# backend/services/core-service/src/__tests__/integration/auth.api.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Auth API Integration Tests', () => {
  let testUserId: string;

  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    // Cleanup
    if (testUserId) {
      await db.delete(sessions).where(eq(sessions.user_id, testUserId));
      await db.delete(users).where(eq(users.id, testUserId));
    }
    await db.destroy();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'integration@example.com',
          password: 'SecurePassword123!',
          firstName: 'Integration',
          lastName: 'Test',
          username: 'integrationtest',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('integration@example.com');
      expect(response.body.user).not.toHaveProperty('password_hash');

      testUserId = response.body.user.id;
    });

    it('should return validation error for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePassword123!',
          firstName: 'Test',
          lastName: 'User',
          username: 'testuser',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return validation error for weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'weak@example.com',
          password: 'weak',
          firstName: 'Test',
          lastName: 'User',
          username: 'weakuser',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'integration@example.com',
          password: 'SecurePassword123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
    });

    it('should set httpOnly cookie', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'integration@example.com',
          password: 'SecurePassword123!',
        })
        .expect(200);

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => cookie.includes('refreshToken='))).toBe(true);
      expect(cookies.some((cookie: string) => cookie.includes('HttpOnly'))).toBe(true);
    });
  });
});
```

### Load Testing

```yaml
# tests/load/artillery/task-creation.yml
config:
  target: 'http://localhost:8080'
  processor: './tasks-helper.js'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 300
      arrivalRate: 50
      name: 'Sustained load'
    - duration: 60
      arrivalRate: 100
      name: 'Peak load'
  defaults:
    headers:
      Content-Type: 'application/json'

scenarios:
  - name: 'Task Creation Flow'
    flow:
      - post:
          url: /api/v1/auth/login
          json:
            email: '{{ $processEnvironment.TEST_EMAIL }}'
            password: '{{ $processEnvironment.TEST_PASSWORD }}'
          capture:
            - json: '$.accessToken'
              as: 'authToken'
      - think: 1

      - get:
          url: /api/v1/projects
          headers:
            Authorization: 'Bearer {{ authToken }}'
          capture:
            - json: '$[0].id'
              as: 'projectId'

      - loop:
          count: 5
          flow:
            - post:
                url: /api/v1/projects/{{ projectId }}/tasks
                headers:
                  Authorization: 'Bearer {{ authToken }}'
                json:
                  title: 'Load Test Task {{ $randomNumber() }}'
                  description: 'This is a load test task'
                  statusId: '{{ $processEnvironment.DEFAULT_STATUS_ID }}'
                  priorityId: '{{ $processEnvironment.DEFAULT_PRIORITY_ID }}'
            - think: 2
```

---

## Monitoring & Observability

### Prometheus Dashboard Queries

```promql
# Overall request rate
sum(rate(http_requests_total{service=~"core-service|realtime-service|communication-service"}[5m])) by (service)

# P95 latency
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service=~"core-service|realtime-service|communication-service"}[5m])) by (le, service))

# Error rate
sum(rate(http_requests_total{status_code=~"5.."}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service)

# WebSocket connections
websocket_connections

# Active users
count(count_last_write_time_seconds{metric="presence"} > 300)

# Queue depth
rabbitmq_queue_messages{queue=~"email|push|analytics"}

# Task operations
sum(rate(task_operations_total[5m])) by (operation)

# Database query performance
histogram_quantile(0.95, sum(rate(db_query_duration_seconds_bucket[5m])) by (le, operation, table))

# Service health
up{job=~"core-service|realtime-service|communication-service"}

# Memory usage
process_resident_memory_bytes{job=~"core-service|realtime-service|communication-service"} / 1024 / 1024

# CPU usage
rate(process_cpu_seconds_total{job=~"core-service|realtime-service|communication-service"}[5m]) * 100
```

### Alert Rules

```yaml
# docker/prometheus/alert_rules.yml
groups:
  - name: todaily-alerts
    interval: 30s
    rules:
      # Service health alerts
      - alert: ServiceDown
        expr: up{job=~"core-service|realtime-service|communication-service"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: 'Service {{ $labels.job }} is down'
          description: '{{ $labels.job }} has been down for more than 1 minute'

      # High error rate alerts
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status_code=~"5.."}[5m])) by (service)
          /
          sum(rate(http_requests_total[5m])) by (service) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'High error rate on {{ $labels.service }}'
          description: '{{ $labels.service }} has error rate of {{ $value | humanizePercentage }}'

      # High latency alerts
      - alert: HighLatency
        expr: |
          histogram_quantile(0.95,
            sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
          ) > 1
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: 'High P95 latency on {{ $labels.service }}'
          description: '{{ $labels.service }} P95 latency is {{ $value }}s'

      # Queue backlog alerts
      - alert: QueueBacklog
        expr: rabbitmq_queue_messages{queue=~"email|push"} > 1000
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: 'Queue {{ $labels.queue }} has backlog'
          description: '{{ $labels.queue }} has {{ $value }} messages pending'

      # Database connection pool alerts
      - alert: DatabaseConnectionPoolHigh
        expr: |
          pg_stat_database_numbackends{datname=~"auth_db|msg_db"}
          /
          pg_settings_max_connections > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'Database connection pool high'
          description: '{{ $labels.datname }} using {{ $value | humanizePercentage }} of connections'

      # Memory alerts
      - alert: HighMemoryUsage
        expr: |
          process_resident_memory_bytes{job=~"core-service|realtime-service"}
          / 1024 / 1024 > 500
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: 'High memory usage on {{ $labels.job }}'
          description: '{{ $labels.job }} using {{ $value }}MB memory'
```

---

## Summary

This comprehensive plan provides:

1. **Complete distributed system architecture** with 5 microservices
2. **Detailed database schemas** for auth, messages, and analytics
3. **Full code examples** for WebSocket, WebRTC, file upload, and more
4. **Production-ready configurations** for Docker Compose and Kubernetes
5. **Monitoring and observability** setup with Prometheus, Grafana, Jaeger
6. **Testing strategies** with unit, integration, and load tests
7. **9-week implementation roadmap** with day-by-day breakdown

**Key Interview Talking Points:**
- Microservices extraction from monolith
- Database-per-service pattern rationale
- Real-time architecture with Socket.io + Redis
- WebRTC integration with LiveKit
- Service discovery with Consul
- Message queues with RabbitMQ
- Caching strategies at multiple levels
- Distributed tracing with Jaeger
- Circuit breakers and fault tolerance
- Kubernetes deployment strategies

**Start with Phase 1** and build incrementally. Each phase is independent and can be deployed separately. Good luck! 🚀
