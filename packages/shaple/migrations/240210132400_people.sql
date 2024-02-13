CREATE TABLE IF NOT EXISTS public.people
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age  INT          NOT NULL,
    owner UUID        NOT NULL DEFAULT auth.uid()
);

ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow people authenticated" ON public.people FOR ALL TO authenticated USING (auth.uid() = owner);
