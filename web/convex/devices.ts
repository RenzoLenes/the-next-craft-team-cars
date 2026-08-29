import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("devices"),
      _creationTime: v.number(),
      deviceId: v.string(),
      vin: v.string(),
      label: v.optional(v.string()),
      status: v.union(v.literal("active"), v.literal("inactive")),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("devices").order("desc").take(50);
  },
});
