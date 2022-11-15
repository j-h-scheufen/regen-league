# Regen League

Created in service of bioregionalism: https://utopia.org/guide/what-is-a-bioregion-and-which-ones-are-there/

## Requirements

### Generating types for Supabase
In order for the code to work, the types need to be exported from the Supabase tables 

1. ```npx supabase login```
2. ```npx supabase gen types typescript --project-id "project-id" --schema public > src/utils/database.types.tsx```

## Postgres Changes

1. In order to modify a user's avatar image (bucket 'avatars'), public access had to be granted. The bucket was made public to allow invocation of 'getPublicUrl'.
```
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'public' );
```

2. The app uses stored SQL functions to insert hubs and projects, so it can ensure that an admin is atomically assigned. These functions were allowed access in the following way:
```
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Choose which roles can execute functions
GRANT EXECUTE ON FUNCTION add_hub TO authenticated;
GRANT EXECUTE ON FUNCTION add_hub TO service_role;
GRANT EXECUTE ON FUNCTION add_project TO authenticated;
GRANT EXECUTE ON FUNCTION add_project TO service_role;
```

3. Function handle_new_user
A trigger and function are being used to ensure a new user automatically gets a profile
```
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

4. Function get_hub_members and get_project_members
Custom functions are being used to perform JOIN queries which are not possible via the supabase-js functionality
```
create or replace function public.get_project_members(project_id uuid)
returns setof record
language sql
as $$
  SELECT p.id AS user_id, p.username, p.avatar_url AS avatar_image, hr.name as role_name FROM project_members pm
  JOIN profiles p ON (pm.user_id = p.id)
  JOIN project_roles pr ON (pm.role_id = pr.id)
  WHERE pm.project_id = project_id;
$$;

create or replace function public.get_project_members(project_id uuid)
returns setof record
language sql
as $$
  SELECT p.id AS user_id, p.username, p.avatar_url AS avatar_image, hr.name as role_name FROM project_members pm
  JOIN profiles p ON (pm.user_id = p.id)
  JOIN project_roles pr ON (pm.role_id = pr.id)
  WHERE pm.project_id = project_id;
$$;```