import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  templates: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    createdAt: v.number(),
  }),
});
