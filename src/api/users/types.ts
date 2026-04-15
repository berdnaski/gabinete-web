export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  CITIZEN = "CITIZEN"
}

export const UserRoleLabel: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.MEMBER]: "Membro",
  [UserRole.CITIZEN]: "Cidadão",
}