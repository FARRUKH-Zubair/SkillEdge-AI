// This file is used to set environment variables programmatically

// Set environment variables programmatically
if (typeof process !== 'undefined') {
  // Set database URL
  process.env.DATABASE_URL = "postgresql://postgres:SkillEdge-AI@db.uzcipgmeuqilktbwodls.supabase.co:5432/postgres";
  process.env.DIRECT_URL = "postgresql://postgres:SkillEdge-AI@db.uzcipgmeuqilktbwodls.supabase.co:5432/postgres";

  // Set Supabase URL and anon key
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://uzcipgmeuqilktbwodls.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Y2lwZ21ldXFpbGt0YndvZGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4OTY0MzEsImV4cCI6MjAzMTQ3MjQzMX0.7a4MiGxVuC1sVMxY0vKdLOOOKP5IVIKcxC0PIc8jz8Y";

  console.log('Environment variables set programmatically');
}

module.exports = {
  // Export the environment variables for easy access
  DATABASE_URL: "postgresql://postgres:SkillEdge-AI@db.uzcipgmeuqilktbwodls.supabase.co:5432/postgres",
  DIRECT_URL: "postgresql://postgres:SkillEdge-AI@db.uzcipgmeuqilktbwodls.supabase.co:5432/postgres",
  NEXT_PUBLIC_SUPABASE_URL: "https://uzcipgmeuqilktbwodls.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Y2lwZ21ldXFpbGt0YndvZGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4OTY0MzEsImV4cCI6MjAzMTQ3MjQzMX0.7a4MiGxVuC1sVMxY0vKdLOOOKP5IVIKcxC0PIc8jz8Y"
}; 