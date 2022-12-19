# Regen League

Created in service of bioregionalism: https://utopia.org/guide/what-is-a-bioregion-and-which-ones-are-there/

This is essentially a mapping exercise to catalogue the regenerative movement via an app that can permeate the space
by first letting power users map out what they know in terms of entities, projects and efforts using publicly available information. 
Actual operators of projects can later claim and take ownership of their profiles, if desired!

Bioregion data from the following sources was used:
- One Earth Bioregions 2020 framework: https://www.oneearth.org/bioregions/
- EPA Ecoregions definition: https://www.epa.gov/eco-research/ecoregions-north-america


## Requirements

### General notes on using Supabase
The app makes use of a lot of stored functions to select data and sometimes to store it. If a table being queried uses RLS
and there is no rule corresponding rule, the function just returns an empty result and no error. Using the JS API to query
a table correctly returns an error. This is mentioned here as a warning when working with Supabase. The current behavior
is considered a bug!

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

2. The app uses stored SQL functions to INSERT hubs and projects, e.g. to ensure that an admin is atomically assigned. These functions were authorized in the following way:
```
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Choose which roles can execute functions
GRANT EXECUTE ON FUNCTION add_hub TO authenticated;
GRANT EXECUTE ON FUNCTION add_hub TO service_role;
GRANT EXECUTE ON FUNCTION add_project TO authenticated;
GRANT EXECUTE ON FUNCTION add_project TO service_role;

create or replace function public.new_entity_with_user_relation(name varchar, description text, entity_type_id int, role_id uuid, user_id uuid) 
returns uuid as $$
declare
  new_id uuid;
begin
  insert into entities(name, description, type_id, created_by)
  values (
    new_entity_with_user_relation.name,
    new_entity_with_user_relation.description,
    new_entity_with_user_relation.entity_type_id,
    new_entity_with_user_relation.user_id
  )
  returning id into new_id;
  insert into relationships(entity1_id, entity2_id, role_id)
  values(new_entity_with_user_relation.user_id, new_id, new_entity_with_user_relation.role_id);
  return new_id;
end;$$ language plpgsql;

```

3. Function handle_new_user
A trigger and function are being used to ensure a new user automatically gets a profile and an entity entry
```
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  insert into public.entities (id, name, type_id, created_by)
  values (new.id, new.id, 4, new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

4. Special getter functions to perform JOIN queries which are not possible via the supabase-js functionality
```
create or replace function public.get_user_member(user_id uuid, entity_id uuid)
returns table (
  user_id uuid,
  username varchar,
  avatar_filename varchar,
  role_name varchar
)
language sql
as $$
  SELECT p.id, p.username, p.avatar_filename, r.name
  FROM relationships rs
  JOIN profiles p ON (rs.from_id = p.id)
  JOIN roles r ON (rs.role_id = r.id)
  WHERE rs.from_id = $1
  AND rs.to_id = $2
$$;

create or replace function public.get_user_members(entity_id uuid)
returns table (
  user_id uuid,
  username varchar,
  avatar_filename varchar,
  role_name varchar
)
language sql
as $$
  SELECT p.id, p.username, p.avatar_filename, r.name
  FROM relationships rs
  JOIN profiles p ON (rs.from_id = p.id)
  JOIN roles r ON (rs.role_id = r.id)
  WHERE rs.to_id = $1;
$$;

create or replace function public.get_user_candidates(entity_id uuid)
returns table (
  user_id uuid,
  username varchar,
  avatar_filename varchar
)
language sql
as $$
  SELECT p.id, p.username, p.avatar_filename
  FROM profiles p
  WHERE p.id NOT IN (SELECT rs.from_id from relationships rs where rs.to_id  = $1)
$$;

create or replace function public.get_entity_target_relations_by_type(from_id uuid, type_id int)
returns table (
  id uuid,
  name varchar,
  description text,
  type_id int,
  role varchar
)
language sql
as $$
  select e.id, e.name, e.description, $2 as type_id, r.name as role
  from relationships rs
  join roles r on (rs.role_id = r.id)
  join entities e on (rs.to_id = e.id)
  where rs.from_id = $1
  and e.type_id = $2
$$;

create or replace function public.get_entity_source_relations_by_type(to_id uuid, type_id int)
returns table (
  id uuid,
  name varchar,
  description text,
  type_id int,
  role varchar
)
language sql
as $$
  select e.id, e.name, e.description, $2 as type_id, r.name as role
  from relationships rs
  join roles r on (rs.role_id = r.id)
  join entities e on (rs.from_id = e.id)
  where rs.to_id = $1
  and e.type_id = $2
$$;

create or replace function public.get_entity_target_candidates_by_type(from_id uuid, type_id int)
returns table (
  id uuid,
  name varchar,
  description text,
  type_id int
)
language sql
as $$
  SELECT e.id, e.name, e.description, $2 as type_id
  FROM entities e
  WHERE e.id NOT IN (SELECT to_id FROM relationships rs WHERE rs.from_id = $1)
  AND e.type_id = $2
$$;

create or replace function public.get_entity_source_candidates_by_type(to_id uuid, type_id int)
returns table (
  id uuid,
  name varchar,
  description text,
  type_id int
)
language sql
as $$
  SELECT e.id, e.name, e.description, $2 as type_id
  FROM entities e
  WHERE e.id NOT IN (SELECT from_id FROM relationships rs WHERE rs.to_id = $1)
  AND e.type_id = $2
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
  FROM oe_bioregions br
  JOIN oe_subrealms sr ON (br.subrealm_id = sr.id)
  JOIN oe_realms r ON (sr.realm_id = r.id)
  WHERE br.id = $1;
$$;

```

5. Added ON CASCADE DELETE clause to the profiles table to automatically delete a profile when a user is deleted.

The Supabase UI cannot handle defining cascading deletes, so a table either has to be created from scratch via SQL CREATE
or an existing table can be altered in the following way.

This command lists existing constraints on tables (see also https://stackoverflow.com/questions/69251891/delete-associated-records-in-supabase:)
```
SELECT con.*
    FROM pg_catalog.pg_constraint con
        INNER JOIN pg_catalog.pg_class rel
                      ON rel.oid = con.conrelid
        INNER JOIN pg_catalog.pg_namespace nsp
                      ON nsp.oid = connamespace
    WHERE 1=1
         AND rel.relname = 'profiles';
```
Then drop and re-add the appropriate constraint. This procedure was used for the following constraints:
```
ALTER TABLE public.relationships
DROP CONSTRAINT relationships_from_id_fkey,
ADD CONSTRAINT relationships_from_id_fkey
    FOREIGN KEY (from_id)
    REFERENCES public.entities(id)
    ON DELETE CASCADE;

ALTER TABLE public.relationships
DROP CONSTRAINT relationships_to_id_fkey,
ADD CONSTRAINT relationships_to_id_fkey
    FOREIGN KEY (to_id)
    REFERENCES public.entities(id)
    ON DELETE CASCADE;

ALTER TABLE public.profiles
DROP CONSTRAINT profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

```

6. Functions joining data across a 4-level region tables to retrieve tuples of data.

```
create or replace function public.get_oe_region_info_l1(region_id int)
RETURNS TABLE (
    l1_id int,
    l1_name varchar,
    l1_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link
  FROM oe_regions_1 l1
  WHERE l1.id = $1;
$$;

create or replace function public.get_oe_region_info_l2(region_id int)
RETURNS TABLE (
    l1_id int,
    l1_name varchar,
    l1_link varchar,
    l2_id int,
    l2_name varchar,
    l2_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link,
    l2.id AS l2_id, l2.name AS l2_name, l2.link AS l2_link
  FROM oe_regions_1 l1
  JOIN oe_regions_2 l2 ON (l2.parent_id = l1.id)
  WHERE l2.id = $1;
$$;

create or replace function public.get_oe_region_info_l3(region_id int)
RETURNS TABLE (
    l1_id int,
    l1_name varchar,
    l1_link varchar,
    l2_id int,
    l2_name varchar,
    l2_link varchar,
    l3_id int,
    l3_name varchar,
    l3_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link,
    l2.id AS l2_id, l2.name AS l2_name, l2.link AS l2_link,
    l3.id AS l3_id, l3.name AS l3_name, l3.link AS l3_link
  FROM oe_regions_1 l1
  JOIN oe_regions_2 l2 ON (l2.parent_id = l1.id)
  JOIN oe_regions_3 l3 ON (l3.parent_id = l2.id)
  WHERE l3.id = $1;
$$;

create or replace function public.get_oe_region_info_l4(region_id int)
RETURNS TABLE (
    l1_id int,
    l1_name varchar,
    l1_link varchar,
    l2_id int,
    l2_name varchar,
    l2_link varchar,
    l3_id int,
    l3_name varchar,
    l3_link varchar,
    l4_id int,
    l4_name varchar,
    l4_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link,
    l2.id AS l2_id, l2.name AS l2_name, l2.link AS l2_link,
    l3.id AS l3_id, l3.name AS l3_name, l3.link AS l3_link,
    l4.id AS l4_id, l4.name AS l4_name, l4.link AS l4_link
  FROM oe_regions_1 l1
  JOIN oe_regions_2 l2 ON (l2.parent_id = l1.id)
  JOIN oe_regions_3 l3 ON (l3.parent_id = l2.id)
  JOIN oe_regions_4 l4 ON (l4.parent_id = l3.id)
  WHERE l4.id = $1;
$$;

create or replace function public.get_epa_region_info_l1(region_id int)
RETURNS TABLE (
    l1_id int,
    l1_name varchar,
    l1_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link
  FROM epa_regions_1 l1
  WHERE l1.id = $1;
$$;

create or replace function public.get_epa_region_info_l2(region_id int)
RETURNS TABLE (
    l1_id int,
    l1_name varchar,
    l1_link varchar,
    l2_id int,
    l2_name varchar,
    l2_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link,
    l2.id AS l2_id, l2.name AS l2_name, l2.link AS l2_link
  FROM epa_regions_1 l1
  JOIN epa_regions_2 l2 ON (l2.parent_id = l1.id)
  WHERE l2.id = $1;
$$;

create or replace function public.get_epa_region_info_l3(region_id int)
RETURNS TABLE (
    l1_id int,
    l1_name varchar,
    l1_link varchar,
    l2_id int,
    l2_name varchar,
    l2_link varchar,
    l3_id int,
    l3_name varchar,
    l3_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link,
    l2.id AS l2_id, l2.name AS l2_name, l2.link AS l2_link,
    l3.id AS l3_id, l3.name AS l3_name, l3.link AS l3_link
  FROM epa_regions_1 l1
  JOIN epa_regions_2 l2 ON (l2.parent_id = l1.id)
  JOIN epa_regions_3 l3 ON (l3.parent_id = l2.id)
  WHERE l3.id = $1;
$$;

create or replace function public.get_epa_region_info_l4(region_id int)
RETURNS TABLE (
    l1_id int,
    l1_name varchar,
    l1_link varchar,
    l2_id int,
    l2_name varchar,
    l2_link varchar,
    l3_id int,
    l3_name varchar,
    l3_link varchar,
    l4_id int,
    l4_name varchar,
    l4_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link,
    l2.id AS l2_id, l2.name AS l2_name, l2.link AS l2_link,
    l3.id AS l3_id, l3.name AS l3_name, l3.link AS l3_link,
    l4.id AS l4_id, l4.name AS l4_name, l4.link AS l4_link
  FROM epa_regions_1 l1
  JOIN epa_regions_2 l2 ON (l2.parent_id = l1.id)
  JOIN epa_regions_3 l3 ON (l3.parent_id = l2.id)
  JOIN epa_regions_4 l4 ON (l4.parent_id = l3.id)
  WHERE l4.id = $1;
$$;

create or replace function public.get_rl_region_info_l1(region_id uuid)
RETURNS TABLE (
    l1_id uuid,
    l1_name varchar,
    l1_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link
  FROM rl_regions_1 l1
  WHERE l1.id = $1;
$$;

create or replace function public.get_rl_region_info_l2(region_id uuid)
RETURNS TABLE (
    l1_id uuid,
    l1_name varchar,
    l1_link varchar,
    l2_id uuid,
    l2_name varchar,
    l2_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link,
    l2.id AS l2_id, l2.name AS l2_name, l2.link AS l2_link
  FROM rl_regions_1 l1
  JOIN rl_regions_2 l2 ON (l2.parent_id = l1.id)
  WHERE l2.id = $1;
$$;

create or replace function public.get_rl_region_info_l3(region_id uuid)
RETURNS TABLE (
    l1_id uuid,
    l1_name varchar,
    l1_link varchar,
    l2_id uuid,
    l2_name varchar,
    l2_link varchar,
    l3_id uuid,
    l3_name varchar,
    l3_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link,
    l2.id AS l2_id, l2.name AS l2_name, l2.link AS l2_link,
    l3.id AS l3_id, l3.name AS l3_name, l3.link AS l3_link
  FROM rl_regions_1 l1
  JOIN rl_regions_2 l2 ON (l2.parent_id = l1.id)
  JOIN rl_regions_3 l3 ON (l3.parent_id = l2.id)
  WHERE l3.id = $1;
$$;

create or replace function public.get_rl_region_info_l4(region_id uuid)
RETURNS TABLE (
    l1_id uuid,
    l1_name varchar,
    l1_link varchar,
    l2_id uuid,
    l2_name varchar,
    l2_link varchar,
    l3_id uuid,
    l3_name varchar,
    l3_link varchar,
    l4_id uuid,
    l4_name varchar,
    l4_link varchar
)
language sql
as $$
  SELECT 
    l1.id AS l1_id, l1.name AS l1_name, l1.link AS l1_link,
    l2.id AS l2_id, l2.name AS l2_name, l2.link AS l2_link,
    l3.id AS l3_id, l3.name AS l3_name, l3.link AS l3_link,
    l4.id AS l4_id, l4.name AS l4_name, l4.link AS l4_link
  FROM rl_regions_1 l1
  JOIN rl_regions_2 l2 ON (l2.parent_id = l1.id)
  JOIN rl_regions_3 l3 ON (l3.parent_id = l2.id)
  JOIN rl_regions_4 l4 ON (l4.parent_id = l3.id)
  WHERE l4.id = $1;
$$;
```

