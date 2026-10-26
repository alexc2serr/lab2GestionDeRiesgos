export const roles = ["admin", "analista", "direccion"] as const;

export type Role = (typeof roles)[number];

export const permissions = {
  admin: [
    "users:manage",
    "roles:manage",
    "configuration:manage",
    "risks:read",
    "risks:write",
  ],
  analista: ["risks:read", "risks:write", "measures:write"],
  direccion: ["risks:read", "reports:read"],
} as const satisfies Record<Role, readonly string[]>;

export type Permission = (typeof permissions)[Role][number];

export function roleHasPermission(role: Role, permission: Permission) {
  const rolePermissions: readonly string[] = permissions[role];
  return rolePermissions.includes(permission);
}
