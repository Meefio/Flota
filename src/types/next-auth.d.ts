import "next-auth";

declare module "next-auth" {
  interface User {
    role: "admin" | "driver";
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "admin" | "driver";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "admin" | "driver";
    userId: string;
  }
}
