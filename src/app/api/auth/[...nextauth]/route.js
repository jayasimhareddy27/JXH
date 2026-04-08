import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import { connectToDB } from "@lib/mongodb";
import User from "@models/login";
import Resume from "@models/resume";
import UserReferences from "@models/userreferences";
import { resumeformatPrompts } from '@public/prompts/resume/schema';

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
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      issuer: "https://www.linkedin.com",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      authorization: { params: { scope: "openid profile email" } },
      client: { token_endpoint_auth_method: "client_secret_post" },
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
    async signIn({ profile, user: oauthUser }) {
      try {
        if (!profile?.email) return false;

        await connectToDB();

        // 1. Check if user exists
        let user = await User.findOne({ email: profile.email });

        // 2. IF USER IS NEW (SIGNUP LOGIC)
        if (!user) {
          // Create the User
          user = await User.create({
            email: profile.email,
            name: profile.name || profile.given_name || "New User",
            image: profile.picture || null,
          });

          // Create the Initial Resume (Matching your signup/route.js logic)
          const initialResume = await Resume.create({
            userId: user._id,
            name: 'My Profile', 
            personalInformation: { 
              ...resumeformatPrompts.personalInformation.initial, 
              name: user.name, 
              email: user.email 
            },
            onlineProfiles: resumeformatPrompts.onlineProfiles.initial,
            educationHistory: resumeformatPrompts.educationHistory.initial,
            workExperience: resumeformatPrompts.workExperience.initial,
            projects: resumeformatPrompts.projects.initial,
            certifications: resumeformatPrompts.certifications.initial,
            skillsSummary: resumeformatPrompts.skillsSummary.initial,
            careerSummary: resumeformatPrompts.careerSummary.initial,
            templateId: 'template01',
            resumetextAireference: "",
          });

          // Create UserReferences
          await UserReferences.create({
            userId: user._id,
            resumeRefs: [initialResume._id],
            primaryResumeRef: initialResume._id,
            myProfileRef: initialResume._id, 
            aiResumeRef: initialResume._id,
          });

        }

        return true;
      } catch (err) {
        console.error("OAuth SignIn Error:", err.message);
        return false;
      }
    },

    async jwt({ token, account }) {
      if (account) {
        await connectToDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
        }
        token.accessToken = account.access_token; 
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };