import { v } from "convex/values";
import { query } from "./_generated/server";

export const active = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("alerts")
      .withIndex("by_resolved", (q) => q.eq("resolved", false))
      .order("desc")
      .take(50);
  },
});

export const byDevice = query({
  args: { deviceId: v.id("devices") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("alerts")
      .withIndex("by_device_and_timestamp", (q) => q.eq("deviceId", args.deviceId))
      .order("desc")
      .take(50);
  },
});
