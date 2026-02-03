// Temporarily disabled for Vercel deployment until Convex is properly configured
// import { query, mutation } from "./_generated/server";
// import { v } from "convex/values";

// export const getTemplates = query({
//   args: {},
//   handler: async (ctx) => {
//     return await ctx.db.query("templates").collect();
//   },
// });

// export const createTemplate = mutation({
//   args: {
//     title: v.string(),
//     content: v.string(),
//     category: v.string(),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.insert("templates", {
//       ...args,
//       createdAt: Date.now(),
//     });
//   },
// });

// export const updateTemplate = mutation({
//   args: {
//     id: v.id("templates"),
//     title: v.optional(v.string()),
//     content: v.optional(v.string()),
//     category: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const { id, ...rest } = args;
//     return await ctx.db.patch(id, rest);
//   },
// });

// export const deleteTemplate = mutation({
//   args: { id: v.id("templates") },
//   handler: async (ctx, args) => {
//     return await ctx.db.delete(args.id);
//   },
// });

// export const seedTemplates = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const templates = [
//       {
//         title: "Professional Resignation",
//         category: "professional",
//         content: `Dear [Manager Name],

// I am writing to formally notify you of my resignation from my position as [Job Title] at [Company Name], effective [Last Working Day - typically 2 weeks from date].

// I have accepted an opportunity that aligns more closely with my career goals. I want to express my sincere gratitude for the professional growth and experiences I've gained during my tenure here. The skills and knowledge I've acquired will undoubtedly contribute to my future endeavors.

// I am committed to ensuring a smooth transition and will complete all pending projects and handover documentation before my departure. Please let me know how I can assist during this transition period.

// Thank you for your understanding and support.

// Sincerely,
// [Your Name]`,
//       },
//       {
//         title: "Friendly Resignation",
//         category: "friendly",
//         content: `Hi [Manager Name],

// I wanted to let you know that I'll be moving on from my role as [Job Title] at [Company Name]. My last day will be [Last Working Day].

// It's been a wonderful experience working here, and I've genuinely enjoyed being part of such a great team. While I'm excited about this new chapter, I'll definitely miss the collaborative environment and friendships we've built.

// I'm happy to help train my replacement and wrap up my current projects. Let's stay in touch!

// Wishing the team continued success.

// Best regards,
// [Your Name]`,
//       },
//       {
//         title: "Short Notice Resignation",
//         category: "short",
//         content: `Dear [Manager Name],

// Please accept this letter as formal notice of my resignation from my position as [Job Title] at [Company Name], effective immediately.

// Due to unforeseen circumstances, I am unable to continue in my current role. I apologize for any inconvenience this may cause.

// I appreciate the opportunities provided during my time here.

// Regards,
// [Your Name]`,
//       },
//     ];

//     for (const template of templates) {
//       await ctx.db.insert("templates", {
//         ...template,
//         createdAt: Date.now(),
//       });
//     }

//     return templates.length;
//   },
// });
