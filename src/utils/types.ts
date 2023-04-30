export type UserType = string;

export interface CountdownProps {
  id: string;
  name: string;
  endDate: string;
  createdBy: UserType;
}

export interface CountdownPayload {
  id?: string;
  name?: string;
  endDate?: string;
  createdBy?: UserType;
}

export interface CountdownPropsSnakeCase
  extends Omit<CountdownProps, "endDate" | "createdBy"> {
  end_date: string;
  created_by: UserType;
}
