CREATE TABLE public.author (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL
);
ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (id);
