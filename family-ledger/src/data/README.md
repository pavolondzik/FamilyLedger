# Seed Data Architecture Guide

## Overview

Mock/seed data is centralized in `src/data/seeds/` to provide a scalable, maintainable structure for all features.

## Folder Structure

```
src/data/
├── seeds/
│   ├── projects.seed.ts
│   ├── users.seed.ts
│   ├── incomes.seed.ts
│   ├── expenses.seed.ts
│   ├── transactions.seed.ts
│   ├── bank-connections.seed.ts
│   ├── secrets.seed.ts
│   └── index.ts (central export)
├── seedInitializer.ts (reusable utilities)
└── README.md (this file)
```

## How to Access Seed Data

### **From API Layer (Recommended)**

In your feature's API file (e.g., `src/features/users/api/usersApi.ts`):

```typescript
import type { User } from '@/features/users';
import { seedUsers } from '@/data/seeds';
import {
  readFromStorage,
  writeToStorage,
  resetStorageForKey,
} from '@/data/seedInitializer';

export const USERS_STORAGE_KEY = 'family-ledger.users';

const readUsersFromStorage = (): User[] => {
  return readFromStorage(USERS_STORAGE_KEY, seedUsers);
};

const writeUsersToStorage = (users: User[]) => {
  return writeToStorage(USERS_STORAGE_KEY, users);
};

export const getUsers = async (): Promise<User[]> => {
  return readUsersFromStorage();
};

export const resetUsersStorage = () => {
  resetStorageForKey(USERS_STORAGE_KEY);
};
```

### **From Components (Using Custom Hooks)**

Components should consume seed data through **feature hooks** in `src/features/[feature]/hooks/`, which in turn call API functions:

```typescript
// src/features/users/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/features/users/api/usersApi';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};
```

Then in your component:

```typescript
import { useUsers } from '@/features/users';

const UserList = () => {
  const { data: users } = useUsers();
  
  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

## Pattern: Adding a New Feature with Seed Data

### 1. Create the seed file

```typescript
// src/data/seeds/your-feature.seed.ts
import type { YourEntity } from '@/features/your-feature/types/your-entity';

export const seedYourEntities: YourEntity[] = [
  {
    id: 'sample-1',
    name: 'Sample Item',
    createdAt: '2026-03-20T00:00:00.000Z',
  },
];
```

### 2. Export from seed index

```typescript
// src/data/seeds/index.ts
export { seedYourEntities } from './your-feature.seed';
```

### 3. Use in your API layer

```typescript
// src/features/your-feature/api/your-feature-api.ts
import { seedYourEntities } from '@/data/seeds';
import { readFromStorage, writeToStorage } from '@/data/seedInitializer';

export const YOUR_ENTITIES_STORAGE_KEY = 'family-ledger.your-entities';

const readFromStorage = (): YourEntity[] => {
  return readFromStorage(YOUR_ENTITIES_STORAGE_KEY, seedYourEntities);
};
```

## Utilities Reference

### `readFromStorage<T>(storageKey, seedData, sortFn?)`

Reads data from localStorage or returns seed data if empty.

```typescript
const users = readFromStorage(
  'family-ledger.users',
  seedUsers,
  (users) => users.sort((a, b) => a.name.localeCompare(b.name))
);
```

### `writeToStorage<T>(storageKey, data, sortFn?)`

Writes data to localStorage (with optional sorting).

```typescript
writeToStorage(
  'family-ledger.users',
  updatedUsers,
  sortByDate
);
```

### `cloneData<T>(data)`

Deep clones an array to avoid mutations.

```typescript
const usersCopy = cloneData(users);
```

### `resetStorageForKey(storageKey)`

Clears data for a specific feature (resets to seed).

```typescript
resetStorageForKey('family-ledger.users');
```

### `resetAllStorage()`

Clears all localStorage (nuclear option).

```typescript
resetAllStorage();
```

## Best Practices

✅ **Do:**
- Store seed data in `src/data/seeds/[feature].seed.ts`
- Use utility functions from `seedInitializer.ts`
- Access data through API functions
- Consume API data through React Query hooks
- Let hooks abstract storage details from components

❌ **Don't:**
- Import seed data directly into components
- Hardcode storage logic in multiple API files
- Mix storage and business logic
- Access localStorage directly (use utilities)

## Storage Fallback

The utilities automatically use:
1. **`localStorage`** if available (browser environment)
2. **Memory map** as fallback (testing/SSR environments)

This means the same code works everywhere without modification.
