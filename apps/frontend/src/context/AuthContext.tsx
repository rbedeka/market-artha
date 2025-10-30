// // context/AuthContext.tsx
// import React, { createContext, useState, useEffect, ReactNode } from "react";
// import { fetchWithCookies } from "@/lib/api"; // Your fetch wrapper that sends cookies

// type User = { id: string; email: string } | null;

// type AuthContextType = {
//   user: User;
//   loading: boolean;
//   refetchUser: () => Promise<void>;
// };

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   refetchUser: async () => {},
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User>(null);
//   const [loading, setLoading] = useState(true);

//   async function fetchUser() {
//     try {
//       const data = await fetchWithCookies("/user/profile"); // Protected user info endpoint
//       setUser(data);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         refetchUser: fetchUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
