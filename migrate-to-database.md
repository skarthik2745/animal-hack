# Database Migration Guide

## Updated Files for Supabase Integration

### Core Database Files
- ✅ `src/lib/supabase.ts` - Supabase client
- ✅ `src/lib/database.ts` - Database operations
- ✅ `src/hooks/useDatabase.ts` - Database hooks
- ✅ `src/hooks/useMessages.ts` - Chat functionality
- ✅ `src/hooks/useEvents.ts` - Events management
- ✅ `src/AuthContext.tsx` - Supabase authentication

### Components to Update

Replace localStorage usage with database hooks in these components:

1. **AdoptionEvents.tsx** ✅ - Already updated
2. **PetStories.tsx** - Use `usePetProfiles()` and `usePetPosts()`
3. **LostFound.tsx** - Use `useLostFound()`
4. **ReportAbuse.tsx** - Use `useAbuseReports()`
5. **AwarenessCampaigns.tsx** - Use `useCampaigns()`
6. **PetDoctors.tsx** - Use `useDoctors()`
7. **PetTrainers.tsx** - Use `useTrainers()`
8. **PetShops.tsx** - Use `useShops()`
9. **PetSurrender.tsx** - Use `useCaretakers()`
10. **WildlifeSanctuary.tsx** - Use `useWildlife()`
11. **Community.tsx** - Use `useCommunities()`
12. **Profile.tsx** - Use database hooks for all data
13. **ChatScreen.tsx** - Use `useMessages()`

### Usage Examples

```typescript
// In any component
import { useDatabase } from '../hooks/useDatabase';

const MyComponent = () => {
  const { usePetProfiles } = useDatabase();
  const { profiles, loading, createProfile } = usePetProfiles();
  
  // Use profiles instead of localStorage
  return (
    <div>
      {loading ? 'Loading...' : profiles.map(profile => ...)}
    </div>
  );
};
```

### Migration Steps

1. ✅ Run SQL schema in Supabase
2. ✅ Update authentication to use Supabase
3. ✅ Create database hooks
4. 🔄 Update each component to use hooks instead of localStorage
5. 🔄 Test all functionality
6. 🔄 Remove localStorage dependencies

### Key Changes

- Replace `localStorage.getItem()` with database hooks
- Replace `localStorage.setItem()` with database operations
- Add loading states for async operations
- Handle errors from database operations
- Use user authentication for data ownership