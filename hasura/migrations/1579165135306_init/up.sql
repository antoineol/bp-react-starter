CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.admin (
    id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    office text,
    type text,
    password_hash text,
    salt text,
    CONSTRAINT admin_type_check CHECK ((type = ANY (ARRAY['super_admin'::text, 'key_account_manager'::text, 'lead_analyst'::text])))
);
CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;
CREATE TABLE public.article (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    rating integer NOT NULL,
    author_id uuid NOT NULL
);
CREATE TABLE public.article_tag (
    article_id uuid NOT NULL,
    tag_id uuid NOT NULL
);
CREATE TABLE public.tag (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    tag_value text NOT NULL
);
CREATE VIEW public.article_tags_view AS
 SELECT article_tag.article_id,
    tag.id,
    tag.tag_value
   FROM (public.article_tag
     LEFT JOIN public.tag ON ((article_tag.tag_id = tag.id)));
CREATE TABLE public.author (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.client (
    id integer NOT NULL,
    name character varying(255),
    main_user character varying(255),
    sourcing_start_date timestamp with time zone,
    sourcing_months integer,
    rating_digests integer,
    ratings_on_demand integer,
    certificates_per_month integer,
    visible boolean,
    language text,
    key_account_manager_id integer,
    lead_analyst_id integer,
    passportings integer,
    yoomap_id character varying(255),
    main_user_id integer,
    scans integer DEFAULT 0 NOT NULL,
    ecosystem_mappings integer DEFAULT 0 NOT NULL,
    remaining_restitutions integer DEFAULT 0 NOT NULL,
    scoutings integer,
    CONSTRAINT client_language_check CHECK ((language = ANY (ARRAY['french'::text, 'english'::text])))
);
CREATE SEQUENCE public.client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;
CREATE TABLE public.client_user (
    id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    lead_user boolean,
    password_hash text,
    password_salt text,
    client_id integer,
    visible boolean
);
CREATE SEQUENCE public.client_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.client_user_id_seq OWNED BY public.client_user.id;
CREATE TABLE public.ecosystem_mapping (
    id integer NOT NULL,
    name character varying(255),
    language text,
    analyst character varying(255),
    date date,
    summary text,
    total_startups integer,
    total_rated_by_em integer,
    cluster_1 character varying(255),
    cluster_2 character varying(255),
    cluster_3 character varying(255),
    cluster_4 character varying(255),
    cluster_5 character varying(255),
    cluster_6 character varying(255),
    cluster_7 character varying(255),
    cluster_8 character varying(255),
    rating_report_pdf character varying(255),
    CONSTRAINT ecosystem_mapping_language_check CHECK ((language = ANY (ARRAY['french'::text, 'english'::text])))
);
CREATE SEQUENCE public.ecosystem_mapping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.ecosystem_mapping_id_seq OWNED BY public.ecosystem_mapping.id;
CREATE TABLE public.favorite (
    id integer NOT NULL,
    client_user_id integer,
    startup_rating_id integer
);
CREATE SEQUENCE public.favorite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.favorite_id_seq OWNED BY public.favorite.id;
CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);
CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;
CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);
CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;
CREATE TABLE public.matching (
    id integer NOT NULL,
    date date,
    client_id integer,
    display_augmented_certificate boolean
);
CREATE SEQUENCE public.matching_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.matching_id_seq OWNED BY public.matching.id;
CREATE TABLE public.matching_ratings (
    id integer NOT NULL,
    matching_id integer,
    startup_rating_id integer,
    type character varying(255) DEFAULT 'rating'::character varying,
    yoomap_startup_id integer
);
CREATE SEQUENCE public.matching_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.matching_ratings_id_seq OWNED BY public.matching_ratings.id;
CREATE TABLE public.passporting (
    id integer NOT NULL,
    startup_name character varying(255),
    language text,
    logo character varying(255),
    source_file character varying(255),
    analyst character varying(255),
    date date,
    overall_rating integer,
    subrating_founders integer,
    subrating_project integer,
    subrating_ecosystem integer,
    management_positive text,
    management_negative text,
    project_positive text,
    project_negative text,
    ecosystem_positive text,
    ecosystem_negative text,
    email character varying(255),
    url character varying(255),
    creation_date date,
    location character varying(255),
    sector_id integer,
    technical_maturity text,
    commercial_maturity text,
    stage_id integer,
    fundraising character varying(255),
    founder_1 character varying(255),
    linkedin_1 character varying(255),
    role_1 character varying(255),
    founder_2 character varying(255),
    linkedin_2 character varying(255),
    role_2 character varying(255),
    founder_3 character varying(255),
    linkedin_3 character varying(255),
    role_3 character varying(255),
    summary text,
    metric_1 character varying(255),
    metric_explanation_1 character varying(255),
    metric_2 character varying(255),
    metric_explanation_2 character varying(255),
    metric_3 character varying(255),
    metric_explanation_3 character varying(255),
    currency character varying(255),
    revenue_current_year real,
    revenue_n_plus_1 real,
    revenue_n_plus_2 real,
    revenue_n_plus_3 real,
    "EBITDA_current_year" real,
    "EBITDA_n_plus_1" real,
    "EBITDA_n_plus_2" real,
    "EBITDA_n_plus_3" real,
    target_1 character varying(255),
    target_2 character varying(255),
    target_3 character varying(255),
    target_4 character varying(255),
    target_5 character varying(255),
    business_model_1 character varying(255),
    business_model_2 character varying(255),
    business_model_3 character varying(255),
    business_model_4 character varying(255),
    business_model_5 character varying(255),
    competitor_1 character varying(255),
    competitor_url_1 character varying(255),
    competitor_2 character varying(255),
    competitor_url_2 character varying(255),
    competitor_3 character varying(255),
    competitor_url_3 character varying(255),
    last_rating_date date,
    last_kpi_tracking_date date,
    full_time_employees character varying(255),
    avg_revenues_per_month character varying(255),
    cash_at_bank character varying(255),
    general_trend integer,
    explanation text,
    uuid uuid,
    passporting_pdf character varying(255),
    founder_4 character varying(255),
    role_4 character varying(255),
    linkedin_4 character varying(255),
    CONSTRAINT passporting_commercial_maturity_check CHECK ((commercial_maturity = ANY (ARRAY['no_targets'::text, 'pre_revenue'::text, 'first_users'::text, 'turnover_250'::text, 'active_users'::text, 'turnover_1200'::text, 'turnover_5000'::text, 'globaly_deployed'::text]))),
    CONSTRAINT passporting_language_check CHECK ((language = ANY (ARRAY['french'::text, 'english'::text]))),
    CONSTRAINT passporting_technical_maturity_check CHECK ((technical_maturity = ANY (ARRAY['concept'::text, 'pre_mvp'::text, 'mvp'::text, 'stable_deployed'::text, 'optimized'::text, 'new_products'::text])))
);
CREATE SEQUENCE public.passporting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.passporting_id_seq OWNED BY public.passporting.id;
CREATE TABLE public.profile (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.purchased_object (
    id integer NOT NULL,
    client_user_id integer,
    date_purchased timestamp with time zone,
    startup_rating_id integer,
    type text,
    ecosystem_mapping_id integer,
    passporting_id integer,
    scan_startup_id integer,
    deep_check_startup_rating_id integer,
    scouting_id integer,
    yoomap_startup_id integer,
    CONSTRAINT purchased_object_type_check CHECK ((type = ANY (ARRAY['check'::text, 'deep_check'::text, 'scan'::text, 'ecosystem_mapping'::text, 'scouting'::text, 'passporting'::text])))
);
CREATE SEQUENCE public.purchased_object_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.purchased_object_id_seq OWNED BY public.purchased_object.id;
CREATE TABLE public.rod_request (
    id integer NOT NULL,
    client_user_id integer,
    date timestamp with time zone,
    requested_startup character varying(255),
    status text,
    CONSTRAINT rod_request_status_check CHECK ((status = ANY (ARRAY['requested'::text, 'accepted'::text, 'interview_planned'::text, 'interview_done'::text, 'review'::text, 'done'::text])))
);
CREATE SEQUENCE public.rod_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.rod_request_id_seq OWNED BY public.rod_request.id;
CREATE TABLE public.scouting (
    id integer NOT NULL,
    name character varying(255),
    language text,
    date date,
    summary text,
    total_startups integer,
    total_rated_by_em integer,
    startup_1 character varying(255),
    startup_2 character varying(255),
    startup_3 character varying(255),
    startup_4 character varying(255),
    startup_5 character varying(255),
    startup_6 character varying(255),
    startup_7 character varying(255),
    startup_8 character varying(255),
    startup_9 character varying(255),
    startup_10 character varying(255),
    startup_11 character varying(255),
    startup_12 character varying(255),
    startup_13 character varying(255),
    startup_14 character varying(255),
    startup_15 character varying(255),
    startup_16 character varying(255),
    startup_17 character varying(255),
    startup_18 character varying(255),
    startup_19 character varying(255),
    startup_20 character varying(255),
    scouting_report_pdf character varying(255),
    first_scouting_id character varying(255),
    CONSTRAINT scouting_language_check CHECK ((language = ANY (ARRAY['french'::text, 'english'::text])))
);
CREATE SEQUENCE public.scouting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.scouting_id_seq OWNED BY public.scouting.id;
CREATE TABLE public.sector (
    id integer NOT NULL,
    label character varying(255),
    color character varying(255)
);
CREATE SEQUENCE public.sector_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.sector_id_seq OWNED BY public.sector.id;
CREATE TABLE public.shared_object (
    id integer NOT NULL,
    token character varying(255),
    client_user_id integer,
    date_shared timestamp with time zone,
    type text,
    startup_rating_id integer,
    expires boolean DEFAULT true,
    ecosystem_mapping_id integer,
    passporting_id integer,
    scouting_id integer
);
CREATE SEQUENCE public.shared_object_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.shared_object_id_seq OWNED BY public.shared_object.id;
CREATE TABLE public.stage (
    id integer NOT NULL,
    label character varying(255),
    color character varying(255)
);
CREATE SEQUENCE public.stage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.stage_id_seq OWNED BY public.stage.id;
CREATE TABLE public.startup_rating (
    id integer NOT NULL,
    startup_name character varying(255),
    date timestamp with time zone,
    subsector character varying(255),
    summary text,
    business_model text,
    location character varying(255),
    url character varying(255),
    overall_rating integer,
    subrating_founders integer,
    subrating_project integer,
    subrating_ecosystem integer,
    swot_strength character varying(255),
    swot_weakness character varying(255),
    swot_opportunities character varying(255),
    swot_threat character varying(255),
    fundraising character varying(255),
    email character varying(255),
    rating_digest_pdf character varying(255),
    rating_report_pdf character varying(255),
    other_pdf character varying(255),
    analyst character varying(255),
    logo character varying(255),
    language text DEFAULT 'english'::text NOT NULL,
    sector_id integer,
    stage_id integer,
    founder_1 character varying(255),
    role_1 character varying(255),
    linkedin_1 character varying(255),
    founder_2 character varying(255),
    role_2 character varying(255),
    linkedin_2 character varying(255),
    founder_3 character varying(255),
    role_3 character varying(255),
    linkedin_3 character varying(255),
    competitor_1 character varying(255),
    competitor_url_1 character varying(255),
    competitor_2 character varying(255),
    competitor_url_2 character varying(255),
    competitor_3 character varying(255),
    competitor_url_3 character varying(255),
    metric_1 character varying(255),
    metric_explanation_1 character varying(255),
    metric_2 character varying(255),
    metric_explanation_2 character varying(255),
    metric_3 character varying(255),
    metric_explanation_3 character varying(255),
    revenue_current_year real,
    revenue_n_plus_1 real,
    revenue_n_plus_2 real,
    revenue_n_plus_3 real,
    "EBITDA_current_year" real,
    "EBITDA_n_plus_1" real,
    "EBITDA_n_plus_2" real,
    "EBITDA_n_plus_3" real,
    creation_date character varying(255),
    design_version text,
    commercial_maturity text,
    technical_maturity text,
    management_positive text,
    management_negative text,
    project_positive text,
    project_negative text,
    ecosystem_positive text,
    ecosystem_negative text,
    currency character varying(255),
    source_file character varying(255),
    target_1 character varying(255),
    target_2 character varying(255),
    target_3 character varying(255),
    business_model_1 character varying(255),
    business_model_2 character varying(255),
    business_model_3 character varying(255),
    uuid uuid,
    target_4 character varying(255),
    target_5 character varying(255),
    business_model_4 character varying(255),
    business_model_5 character varying(255),
    founder_4 character varying(255),
    role_4 character varying(255),
    linkedin_4 character varying(255),
    augmented_certificate_pdf character varying(255),
    prioritise_augmented_certificate boolean DEFAULT false,
    have_disclosure_agreement boolean DEFAULT true NOT NULL,
    upper_bound_rating integer,
    strength_1 text,
    strength_2 text,
    strength_3 text,
    strength_4 text,
    strength_5 text,
    strength_6 text,
    challenge_1 text,
    challenge_2 text,
    challenge_3 text,
    challenge_4 text,
    challenge_5 text,
    challenge_6 text,
    founder_5 character varying(255),
    linkedin_5 character varying(255),
    role_5 character varying(255),
    promise_1 character varying(255),
    promise_2 character varying(255),
    promise_3 character varying(255),
    revenue_1 character varying(255),
    revenue_2 character varying(255),
    revenue_3 character varying(255),
    promise_4 character varying(255),
    promise_5 character varying(255),
    revenue_4 character varying(255),
    revenue_5 character varying(255),
    augmented_certificate_pdf_scoring character varying(255),
    one_pager_pdf character varying(255),
    scan_exec_sum_pdf character varying(255),
    CONSTRAINT startup_rating_commercial_maturity_check CHECK ((commercial_maturity = ANY (ARRAY['no_targets'::text, 'pre_revenue'::text, 'first_users'::text, 'turnover_250'::text, 'active_users'::text, 'turnover_1200'::text, 'turnover_5000'::text, 'globaly_deployed'::text]))),
    CONSTRAINT startup_rating_language_check CHECK ((language = ANY (ARRAY['english'::text, 'french'::text]))),
    CONSTRAINT startup_rating_technical_maturity_check CHECK ((technical_maturity = ANY (ARRAY['concept'::text, 'pre_mvp'::text, 'mvp'::text, 'stable_deployed'::text, 'optimized'::text, 'new_products'::text])))
);
CREATE SEQUENCE public."startupRatings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."startupRatings_id_seq" OWNED BY public.startup_rating.id;
CREATE VIEW public.tag_articles_view AS
 SELECT article_tag.tag_id,
    article.id,
    article.title,
    article.content,
    article.rating,
    article.author_id
   FROM (public.article_tag
     LEFT JOIN public.article ON ((article_tag.article_id = article.id)));
CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    roles text NOT NULL
);
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);
ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);
ALTER TABLE ONLY public.client_user ALTER COLUMN id SET DEFAULT nextval('public.client_user_id_seq'::regclass);
ALTER TABLE ONLY public.ecosystem_mapping ALTER COLUMN id SET DEFAULT nextval('public.ecosystem_mapping_id_seq'::regclass);
ALTER TABLE ONLY public.favorite ALTER COLUMN id SET DEFAULT nextval('public.favorite_id_seq'::regclass);
ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);
ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);
ALTER TABLE ONLY public.matching ALTER COLUMN id SET DEFAULT nextval('public.matching_id_seq'::regclass);
ALTER TABLE ONLY public.matching_ratings ALTER COLUMN id SET DEFAULT nextval('public.matching_ratings_id_seq'::regclass);
ALTER TABLE ONLY public.passporting ALTER COLUMN id SET DEFAULT nextval('public.passporting_id_seq'::regclass);
ALTER TABLE ONLY public.purchased_object ALTER COLUMN id SET DEFAULT nextval('public.purchased_object_id_seq'::regclass);
ALTER TABLE ONLY public.rod_request ALTER COLUMN id SET DEFAULT nextval('public.rod_request_id_seq'::regclass);
ALTER TABLE ONLY public.scouting ALTER COLUMN id SET DEFAULT nextval('public.scouting_id_seq'::regclass);
ALTER TABLE ONLY public.sector ALTER COLUMN id SET DEFAULT nextval('public.sector_id_seq'::regclass);
ALTER TABLE ONLY public.shared_object ALTER COLUMN id SET DEFAULT nextval('public.shared_object_id_seq'::regclass);
ALTER TABLE ONLY public.stage ALTER COLUMN id SET DEFAULT nextval('public.stage_id_seq'::regclass);
ALTER TABLE ONLY public.startup_rating ALTER COLUMN id SET DEFAULT nextval('public."startupRatings_id_seq"'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);
ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.article_tag
    ADD CONSTRAINT article_tag_pkey PRIMARY KEY (article_id, tag_id);
ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.client_user
    ADD CONSTRAINT client_user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.ecosystem_mapping
    ADD CONSTRAINT ecosystem_mapping_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_client_user_id_startup_rating_id_unique UNIQUE (client_user_id, startup_rating_id);
ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);
ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.matching
    ADD CONSTRAINT matching_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.matching_ratings
    ADD CONSTRAINT matching_ratings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.passporting
    ADD CONSTRAINT passporting_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.purchased_object
    ADD CONSTRAINT purchased_object_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.rod_request
    ADD CONSTRAINT rod_request_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.scouting
    ADD CONSTRAINT scouting_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.sector
    ADD CONSTRAINT sector_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shared_object
    ADD CONSTRAINT shared_object_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.stage
    ADD CONSTRAINT stage_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.startup_rating
    ADD CONSTRAINT "startupRatings_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_profile_updated_at BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_profile_updated_at ON public.profile IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.author(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.article_tag
    ADD CONSTRAINT article_tag_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.article(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.article_tag
    ADD CONSTRAINT article_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_key_account_manager_foreign FOREIGN KEY (key_account_manager_id) REFERENCES public.admin(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_lead_analyst_foreign FOREIGN KEY (lead_analyst_id) REFERENCES public.admin(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.client_user
    ADD CONSTRAINT client_user_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.client(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_client_user_id_foreign FOREIGN KEY (client_user_id) REFERENCES public.client_user(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_startup_rating_id_foreign FOREIGN KEY (startup_rating_id) REFERENCES public.startup_rating(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.matching
    ADD CONSTRAINT matching_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.client(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.matching_ratings
    ADD CONSTRAINT matching_ratings_matching_id_foreign FOREIGN KEY (matching_id) REFERENCES public.matching(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.matching_ratings
    ADD CONSTRAINT matching_ratings_startup_rating_id_foreign FOREIGN KEY (startup_rating_id) REFERENCES public.startup_rating(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.passporting
    ADD CONSTRAINT passporting_sector_id_foreign FOREIGN KEY (sector_id) REFERENCES public.sector(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.passporting
    ADD CONSTRAINT passporting_stage_id_foreign FOREIGN KEY (stage_id) REFERENCES public.stage(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.purchased_object
    ADD CONSTRAINT purchased_object_client_user_id_foreign FOREIGN KEY (client_user_id) REFERENCES public.client_user(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.purchased_object
    ADD CONSTRAINT purchased_object_ecosystem_mapping_id_foreign FOREIGN KEY (ecosystem_mapping_id) REFERENCES public.ecosystem_mapping(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.purchased_object
    ADD CONSTRAINT purchased_object_passporting_id_foreign FOREIGN KEY (passporting_id) REFERENCES public.passporting(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.purchased_object
    ADD CONSTRAINT purchased_object_scan_startup_id_foreign FOREIGN KEY (scan_startup_id) REFERENCES public.startup_rating(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.purchased_object
    ADD CONSTRAINT purchased_object_scouting_id_foreign FOREIGN KEY (scouting_id) REFERENCES public.scouting(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.purchased_object
    ADD CONSTRAINT purchased_object_startup_rating_id_foreign FOREIGN KEY (startup_rating_id) REFERENCES public.startup_rating(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.rod_request
    ADD CONSTRAINT rod_request_client_user_id_foreign FOREIGN KEY (client_user_id) REFERENCES public.client_user(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.shared_object
    ADD CONSTRAINT shared_object_client_user_id_foreign FOREIGN KEY (client_user_id) REFERENCES public.client_user(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.shared_object
    ADD CONSTRAINT shared_object_scouting_id_foreign FOREIGN KEY (scouting_id) REFERENCES public.scouting(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.shared_object
    ADD CONSTRAINT shared_object_startup_rating_id_foreign FOREIGN KEY (startup_rating_id) REFERENCES public.startup_rating(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.startup_rating
    ADD CONSTRAINT startup_rating_sector_id_foreign FOREIGN KEY (sector_id) REFERENCES public.sector(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.startup_rating
    ADD CONSTRAINT startup_rating_stage_id_foreign FOREIGN KEY (stage_id) REFERENCES public.stage(id) ON DELETE SET NULL;
