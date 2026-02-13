import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements, ownerAc } from "better-auth/plugins/organization/access"

export const statement = {
    organization: ["update", "delete", "create"],
    member: ["update", "delete", "create"],
    invitation: ["create", "cancel"],
    team: ["update", "delete", "create"],
    ac: ["update", "delete", "read", "create"],
    admin: ["access"],
    project: ["create", "share", "update", "delete"],
    blogPost: ["create", "edit", "publish", "delete"]
} as const

export const ac = createAccessControl(statement)

export const owner = ac.newRole({
    ...ownerAc.statements,
    team: ["create", "update", "delete"],
    project: ["create", "update", "delete"],
    blogPost: ["create", "edit", "publish", "delete"]
})

export const admin = ac.newRole({
    ...adminAc.statements,
    admin: ["access"],
    team: ["create", "update", "delete"],
    project: ["create", "update"]
})

export const member = ac.newRole({
    project: ["create"]
})

export const user = ac.newRole({
    project: ["create"]
})
