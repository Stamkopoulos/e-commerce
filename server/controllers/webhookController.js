import User from "../models/User.js";
import { verifyWebhook } from "@clerk/express/webhooks";

export const handleClerkWebhook = async (req, res) => {
  try {
    const event = await verifyWebhook(req);

    const clerkUser = event.data;

    switch (event.type) {
      case "user.created":
        const existingUser = await User.findOne({ clerkId: clerkUser.id });
        if (existingUser) {
          return res.status(200).json({ message: "User already exists" });
        }

        /* -----Use it only for testing purposes-----
        const email =
          clerkUser.email_addresses[0]?.email_address || "noemail@example.com";

        const newUser = await User.create({
          clerkId: clerkUser.id,
          name: `${clerkUser.first_name || ""} ${
            clerkUser.last_name || ""
          }`.trim(),
          email,
          role: "user",
        });

        */

        // Create new user
        const newUser = await User.create({
          clerkId: clerkUser.id,
          name: `${clerkUser.first_name || ""} ${
            clerkUser.last_name || ""
          }`.trim(),
          email: clerkUser.email_addresses[0]?.email_address /*||
            "noemail@example.com"*/, // only for testing purposes
          role: "user", // default role
        });

        console.log("New user created: ", newUser);
        return res.status(201).json({ message: "User created" });

      case "user.updated":
        // Update user info
        const updatedUser = await User.findOneAndUpdate(
          { clerkId: clerkUser.id },
          {
            name: `${clerkUser.first_name || ""} ${
              clerkUser.last_name || ""
            }`.trim(),
            email: clerkUser.email_addresses[0]?.email_address,
          },
          { new: true }
        );

        if (!updatedUser)
          return res.status(404).json({ message: "User not found" });
        console.log("User updated:", updatedUser);
        return res.status(200).json({ message: "User updated" });

      case "user.deleted":
        //Delete user from db
        const deletedUser = await User.findOneAndDelete({
          clerkId: clerkUser.id,
        });
        if (!deletedUser) {
          console.log("User not found for deletion:", clerkUser.id);
          return res.status(200).send("User not found");
        }

        console.log("User deleted: ", deletedUser);
        return res.status(200).json({ message: "User deleted" });

      default:
        return res.status(400).json({ message: "Event ignored" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
