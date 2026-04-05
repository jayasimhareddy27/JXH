import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import { connectToDB } from "@lib/mongodb";
import User from "@models/login";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
// api/auth/[...nextauth]/route.js

LinkedInProvider({
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  // This tells NextAuth exactly how to talk to LinkedIn's new OIDC server
  issuer: "https://www.linkedin.com",
  jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
  authorization: {
    params: { scope: "openid profile email" },
  },
  client: {
    token_endpoint_auth_method: "client_secret_post",
  },
  // Ensure the profile mapping matches the OIDC response fields
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    };
  },
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
    async jwt({ token, user, account }) {
      // On initial login, fetch the MongoDB user ID
      if (account && user) {
        await connectToDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
        }
        // This is your 'fucking token' - the NextAuth session token
        token.accessToken = account.access_token; 
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the data to the client-side session object
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken; // Now available in useSession()
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };