import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session }) {
            const sessionUser = await User.findOne({
                email: session.user.email
            })

            session.user.id = sessionUser._id.toString();

            return session;
        },
        async signIn({ profile }) {
            try {
                await connectToDB();

                console.log("Profile object:", profile);
                // check if a user already exists
                const userExists = await User.findOne({
                    email: profile.email
                });

                console.log("User exists:", userExists);

                // if not, create a new user
                if (!userExists) {

                    // Generate a valid username
                    let username = profile.name
                        .replace(/[^a-zA-Z0-9]/g, "") // Remove special characters
                        .toLowerCase();
                    
                    //! i have added this lines
                    // Ensure the username is between 8-20 characters
                    if (username.length < 8) {
                        username = username.padEnd(8, "0"); // Pad with zeros if less than 8 characters
                    } else if (username.length > 20) {
                        username = username.substring(0, 20); // Trim to 20 characters if too long
                    }

                    //! i have added this lines to ensure the username is unique
                    // Ensure the username does not start or end with invalid characters
                    username = username.replace(/^[_\.]+|[_\.]+$/g, "");
                    // Ensure the username does not contain consecutive underscores or periods
                    username = username.replace(/[_\.]{2,}/g, "_");

                    console.log("Generated username:", username); // Debugging log

                    await User.create({
                        email: profile.email,
                        username: username,
                        image: profile.picture
                    });
                }

                return true;
            }
            catch (error) {
                console.log("Error checking user: ", error);
                return false;
            }
        }
    }

});

export { handler as GET, handler as POST }

// 1:20:00 