import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@lib/mongodb";
import User from "@models/login";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      try {
        if (!profile?.email) return false;

        await connectToDB();

        let user = await User.findOne({ email: profile.email });

        if (!user) {
          user = await User.create({
            email: profile.email,
            name: profile.name || profile.given_name || "New User",
            image: profile.picture || null,
            userdata: {},
          });
        }

        return true;
      } catch (err) {
        console.error(
          "Google SignIn Error:",
          process.env.NODE_ENV === "development" ? err : err.message
        );
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user?._id) token.id = user._id.toString();
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
