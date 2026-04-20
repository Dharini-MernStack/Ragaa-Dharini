-- ============================================================
-- RAGAA ACADEMY — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. PROFILES (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  phone text,
  role text default 'student' check (role in ('student', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. COURSES
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  level text not null,
  description text,
  price_label text,
  price_amount integer, -- in paise/cents
  duration text,
  sessions_count text,
  color text default '#D4A843',
  is_featured boolean default false,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Seed courses
insert into public.courses (title, level, description, price_label, price_amount, duration, sessions_count, color, is_featured, sort_order) values
  ('Swara Sadhana', 'Foundation', 'Begin your journey with sruti, swara exercises, basic rāgas like Mayamalavagowla, and simple devotional songs.', '₹4,999', 499900, '3 months', '24 sessions', '#2D6A4F', false, 1),
  ('Rāga Deepam', 'Intermediate', 'Dive into rāga elaboration, kritis by the Trinity, neraval practice, and intermediate tāla patterns.', '₹8,999', 899900, '6 months', '48 sessions', '#A67C2E', true, 2),
  ('Compositions Lab', 'Specialty', 'Deep-dive into specific composers: Thyagaraja, Dikshitar, Syama Sastri, Purandaradasa, and contemporary works.', '₹2,499/mo', 249900, 'Ongoing', 'Flexible', '#7B4F9E', false, 3),
  ('8 Sessions / Month', 'Regular', 'Two classes per week with your guru — vocal exercises, rāga practice, and compositions.', '₹2,000/mo', 200000, 'Monthly', '8 sessions', '#C45B3A', false, 4),
  ('4 Sessions / Month', 'Regular', 'One class per week to steadily build your foundation and keep your practice on track.', '₹1,500/mo', 150000, 'Monthly', '4 sessions', '#5B8A72', false, 5);

-- 3. ENROLLMENTS
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  status text default 'active' check (status in ('active', 'paused', 'completed', 'cancelled')),
  enrolled_at timestamptz default now(),
  unique(student_id, course_id)
);

-- 4. WHITELISTED USERS
create table public.whitelisted_users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  note text,
  added_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 5. CLASS SCHEDULE
create table public.class_sessions (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  scheduled_at timestamptz not null,
  duration_minutes integer default 60,
  meeting_link text,
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- 6. CLASS RECORDINGS (authenticated students only)
create table public.class_recordings (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.class_sessions(id) on delete set null,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  video_url text not null,
  thumbnail_url text,
  duration_seconds integer,
  recorded_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 7. NOTIFICATIONS
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text default 'info' check (type in ('info', 'reminder', 'achievement', 'announcement')),
  title text not null,
  message text,
  is_read boolean default false,
  link_to text, -- optional deep link like "recordings" or "schedule"
  created_at timestamptz default now()
);

-- 8. BLOG POSTS
create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  tags text[] default '{}',
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.whitelisted_users enable row level security;
alter table public.class_sessions enable row level security;
alter table public.class_recordings enable row level security;
alter table public.notifications enable row level security;
alter table public.blog_posts enable row level security;

-- PROFILES: users can read/update own profile, admins can read all
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- COURSES: everyone can read active courses
create policy "Anyone can view active courses" on public.courses
  for select using (is_active = true);
create policy "Admins can manage courses" on public.courses
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ENROLLMENTS: students see own, admins see all
create policy "Students can view own enrollments" on public.enrollments
  for select using (auth.uid() = student_id);
create policy "Admins can manage enrollments" on public.enrollments
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- WHITELIST: admins manage all, users can verify their own email status
create policy "Users can view own whitelist status" on public.whitelisted_users
  for select using (lower(email) = lower(coalesce(auth.jwt()->>'email', '')));
create policy "Admins can manage whitelist" on public.whitelisted_users
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  ) with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- CLASS SESSIONS: enrolled students can view
create policy "Enrolled students can view sessions" on public.class_sessions
  for select using (
    exists (
      select 1 from public.enrollments
      where student_id = auth.uid() and course_id = class_sessions.course_id and status = 'active'
    )
  );
create policy "Admins can manage sessions" on public.class_sessions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- RECORDINGS: only enrolled students
create policy "Enrolled students can view recordings" on public.class_recordings
  for select using (
    exists (
      select 1 from public.enrollments
      where student_id = auth.uid() and course_id = class_recordings.course_id and status = 'active'
    )
  );
create policy "Admins can manage recordings" on public.class_recordings
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- NOTIFICATIONS: users see own only
create policy "Users can view own notifications" on public.notifications
  for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications
  for update using (auth.uid() = user_id);
create policy "Admins can create notifications" on public.notifications
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- BLOG: published posts are public
create policy "Anyone can view published posts" on public.blog_posts
  for select using (is_published = true);
create policy "Admins can manage posts" on public.blog_posts
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index idx_enrollments_student on public.enrollments(student_id);
create index idx_enrollments_course on public.enrollments(course_id);
create index idx_whitelist_email on public.whitelisted_users(lower(email));
create index idx_notifications_user on public.notifications(user_id, is_read);
create index idx_class_sessions_course on public.class_sessions(course_id, scheduled_at);
create index idx_recordings_course on public.class_recordings(course_id, recorded_at);
create index idx_blog_published on public.blog_posts(is_published, published_at);
