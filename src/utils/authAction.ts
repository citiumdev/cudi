import { authConfig } from "@/auth";
import { User } from "@/types/User";
import { getServerSession } from "next-auth";

export const authAction = <Params = void, Return = void>(
  action: (params: Params) => Promise<Return>,
  role?: User["role"],
) => {
  return async (params: Params): Promise<Return> => {
    const session = await getServerSession(authConfig);
    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (role && user.role !== role) {
      throw new Error("Unauthorized");
    }

    return action(params);
  };
};
