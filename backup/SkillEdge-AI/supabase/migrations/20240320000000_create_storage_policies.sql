-- Create a function to set up storage policies
create or replace function create_storage_policies(bucket_name text)
returns void
language plpgsql
security definer
as $$
begin
  -- Policy for inserting files (users can only upload their own resumes)
  create policy "Users can upload their own resumes"
  on storage.objects for insert
  with check (
    bucket_id = bucket_name
    and auth.uid()::text = (storage.foldername(name))[1]
  );

  -- Policy for selecting files (users can only view their own resumes)
  create policy "Users can view their own resumes"
  on storage.objects for select
  using (
    bucket_id = bucket_name
    and auth.uid()::text = (storage.foldername(name))[1]
  );

  -- Policy for updating files (users can only update their own resumes)
  create policy "Users can update their own resumes"
  on storage.objects for update
  using (
    bucket_id = bucket_name
    and auth.uid()::text = (storage.foldername(name))[1]
  );

  -- Policy for deleting files (users can only delete their own resumes)
  create policy "Users can delete their own resumes"
  on storage.objects for delete
  using (
    bucket_id = bucket_name
    and auth.uid()::text = (storage.foldername(name))[1]
  );
end;
$$; 