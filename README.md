# Regen League

Created in service of bioregionalism: https://utopia.org/guide/what-is-a-bioregion-and-which-ones-are-there/

Using bioregions as defined by the One Earth Bioregions 2020 framework: https://www.oneearth.org/bioregions/

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
create or replace function public.get_hub_members(hub_id uuid)
returns table (
  user_id uuid,
  username varchar,
  avatar_image varchar,
  role_name varchar
)
language sql
as $$
  SELECT DISTINCT p.id, p.username, p.avatar_url, hr.name
  FROM hub_members hm
  JOIN profiles p ON (hm.user_id = p.id)
  JOIN hub_roles hr ON (hm.role_id = hr.id)
  WHERE hm.hub_id = hub_id;
$$;

create or replace function public.get_project_members(project_id uuid)
returns table (
  user_id uuid,
  username varchar,
  avatar_image varchar,
  role_name varchar
)
language sql
as $$
  SELECT DISTINCT p.id, p.username, p.avatar_url, pr.name
  FROM project_members pm
  JOIN profiles p ON (pm.user_id = p.id)
  JOIN project_roles pr ON (pm.role_id = pr.id)
  WHERE pm.project_id = project_id;
$$;

create or replace function public.get_user_projects(user_id uuid)
returns setof record
language sql
as $$
  select p.id, p.name, p.description, pr.name as role
  from project_members pm
  join project_roles pr on (pm.role_id = pr.id)
  join projects p on (p.id = pm.project_id)
  where pm.user_id = user_id
$$;

create or replace function public.get_user_hubs(user_id uuid)
returns setof record
language sql
as $$
  select h.id, h.name, h.description, hr.name as role
  from hub_members hm
  join hub_roles hr on (hm.role_id = hr.id)
  join hubs h on (h.id = hm.hub_id)
  where hm.user_id = user_id
$$;

create or replace function public.get_bioregion_data(bioregion_id int)
RETURNS TABLE (
    br_id int,
    br_code varchar,
    br_name varchar,
    br_link varchar,
    sr_id int,
    sr_name varchar,
    r_id int,
    r_name varchar,
    r_link varchar
)
language sql
as $$
  SELECT 
    br.id AS br_id, br.code AS br_code, br.name AS br_name, br.link AS br_link,
    sr.id AS sr_id, sr.name AS sr_name,
    r.id AS r_id, r.name AS r_name, r.link AS r_link
  FROM bioregions br
  JOIN subrealms sr ON (br.subrealm_id = sr.id)
  JOIN realms r ON (sr.realm_id = r.id)
  WHERE br.id = bioregion_id;
$$;


```