export interface MyCalendarUser {
  date: string;
  matter: string;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
  my_calendar: MyCalendarUser[];
}
