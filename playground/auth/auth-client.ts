import { createAuthClient } from "better-auth/vue";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { statement } from "rimelight-components/auth";
import { ac, owner, admin, member, user } from "rimelight-components/auth";

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    organizationClient({
      ac: ac as any,
      roles: {
        owner,
        admin,
        member,
        user,
      },
    }),
  ],
});
