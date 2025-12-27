CREATE TABLE "cemeteries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(500) NOT NULL,
	"type" varchar(100) DEFAULT 'public-cemetery' NOT NULL,
	"type_slug" varchar(100),
	"address" varchar(500),
	"city" varchar(100) NOT NULL,
	"county" varchar(100),
	"state" varchar(100) NOT NULL,
	"state_abbr" varchar(5) NOT NULL,
	"zip_code" varchar(10),
	"country" varchar(50) DEFAULT 'USA' NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"phone" varchar(50),
	"email" varchar(255),
	"website" varchar(500),
	"google_place_id" varchar(255),
	"google_cid" varchar(255),
	"rating" numeric(2, 1),
	"review_count" integer DEFAULT 0,
	"photo_url" text,
	"photos" text[],
	"opening_hours" text,
	"facilities" text[],
	"categories" text[],
	"year_established" varchar(10),
	"description" text,
	"seo_title" varchar(255),
	"seo_description" text,
	"enriched_content" text,
	"generated_summary" text,
	"generated_history" text,
	"generated_features" text[],
	"generated_amenities" text[],
	"generated_visitor_tips" text[],
	"generated_directions" text,
	"generated_local_context" text,
	"enriched_at" timestamp,
	"source" varchar(50) DEFAULT 'google_maps',
	"status" varchar(20) DEFAULT 'active',
	"discovered_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "cemeteries_slug_unique" ON "cemeteries" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "cemeteries_state_idx" ON "cemeteries" USING btree ("state" text_ops);--> statement-breakpoint
CREATE INDEX "cemeteries_state_abbr_idx" ON "cemeteries" USING btree ("state_abbr" text_ops);--> statement-breakpoint
CREATE INDEX "cemeteries_county_idx" ON "cemeteries" USING btree ("county" text_ops);--> statement-breakpoint
CREATE INDEX "cemeteries_city_idx" ON "cemeteries" USING btree ("city" text_ops);--> statement-breakpoint
CREATE INDEX "cemeteries_type_slug_idx" ON "cemeteries" USING btree ("type_slug" text_ops);--> statement-breakpoint
CREATE INDEX "cemeteries_rating_idx" ON "cemeteries" USING btree ("rating" DESC NULLS LAST);