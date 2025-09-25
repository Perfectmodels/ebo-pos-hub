-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'employee');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = user_uuid 
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1 
      WHEN 'manager' THEN 2 
      WHEN 'employee' THEN 3 
    END 
  LIMIT 1;
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = required_role
  );
$$;

-- Create function to check if user has admin or manager role
CREATE OR REPLACE FUNCTION public.is_admin_or_manager(user_uuid UUID DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'manager')
  );
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own role" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Update employees table RLS policies
DROP POLICY IF EXISTS "employees_select_auth" ON public.employees;
DROP POLICY IF EXISTS "employees_insert_auth" ON public.employees;
DROP POLICY IF EXISTS "employees_update_auth" ON public.employees;

-- New secure RLS policies for employees
CREATE POLICY "Employees can view their own data" ON public.employees
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins and managers can view all employees" ON public.employees
FOR SELECT USING (public.is_admin_or_manager());

CREATE POLICY "Admins can manage employees" ON public.employees
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can update employees" ON public.employees
FOR UPDATE USING (public.has_role(auth.uid(), 'manager'));

-- Update users table RLS policies to be more secure
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_auth" ON public.users;

CREATE POLICY "Users can view their own profile" ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile" ON public.users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage users" ON public.users
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Update sales_goals RLS policies
DROP POLICY IF EXISTS "Employees can view their own sales goals" ON public.sales_goals;

CREATE POLICY "Employees can view their own sales goals" ON public.sales_goals
FOR SELECT USING (auth.uid() = employee_id);

CREATE POLICY "Admins and managers can view all sales goals" ON public.sales_goals
FOR SELECT USING (public.is_admin_or_manager());

CREATE POLICY "Admins can manage sales goals" ON public.sales_goals
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger for user_roles
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin role (this should be updated with real admin user ID)
-- Users will need to manually assign the first admin role via database
COMMENT ON TABLE public.user_roles IS 'User roles table - First admin must be assigned manually via database';