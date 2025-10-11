CREATE TABLE "admin_activity_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" varchar NOT NULL,
	"action" text NOT NULL,
	"resource_type" text,
	"resource_id" varchar,
	"details" json,
	"ip_address" text,
	"user_agent" text,
	"success" text DEFAULT 'true',
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" varchar NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_revoked" text DEFAULT 'false',
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "ai_generated_ideas" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"session_id" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"market_size" text,
	"growth_trends" text,
	"competitors" json DEFAULT '[]'::json,
	"moats" json DEFAULT '[]'::json,
	"opportunities" json DEFAULT '[]'::json,
	"location" text,
	"risks" text DEFAULT '',
	"next_steps" json DEFAULT '[]'::json,
	"is_favorited" boolean DEFAULT false,
	"user_input" text NOT NULL,
	"industry" text,
	"budget" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_generation_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"user_input" text NOT NULL,
	"industry" text,
	"budget" text,
	"location" text,
	"ideas_count" text DEFAULT '0',
	"processing_time" text,
	"status" text DEFAULT 'pending',
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_updates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" varchar NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"images" json DEFAULT '[]'::json,
	"milestone" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"subcategory" text,
	"description" text NOT NULL,
	"pitch_video" text,
	"target_amount" text NOT NULL,
	"funding_type" text NOT NULL,
	"equity_offered" text,
	"stage" text NOT NULL,
	"location" text NOT NULL,
	"team_info" json DEFAULT '[]'::json,
	"business_plan" text,
	"financials" json,
	"use_of_funds" text NOT NULL,
	"risks" json DEFAULT '[]'::json,
	"opportunities" json DEFAULT '[]'::json,
	"rewards" json DEFAULT '[]'::json,
	"tags" json DEFAULT '[]'::json,
	"images" json DEFAULT '[]'::json,
	"documents" json DEFAULT '[]'::json,
	"social_links" json DEFAULT '[]'::json,
	"campaign_duration" text NOT NULL,
	"status" text DEFAULT 'draft',
	"is_verified" text DEFAULT 'false',
	"is_featured" text DEFAULT 'false',
	"setup_payment_id" text,
	"withdrawal_payment_id" text,
	"setup_fee_paid" text DEFAULT 'false',
	"withdrawal_fee_paid" text DEFAULT 'false',
	"raised_amount" text DEFAULT '0',
	"backer_count" text DEFAULT '0',
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delete_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_type" text NOT NULL,
	"item_id" varchar NOT NULL,
	"item_data" json NOT NULL,
	"deleted_by" varchar NOT NULL,
	"deletion_reason" text,
	"can_restore" text DEFAULT 'true',
	"restored_at" timestamp,
	"restored_by" varchar,
	"permanent_delete_at" timestamp NOT NULL,
	"deleted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" varchar NOT NULL,
	"investor_id" varchar NOT NULL,
	"amount" text NOT NULL,
	"investment_type" text NOT NULL,
	"equity_percentage" text,
	"expected_return" text,
	"payment_id" text,
	"payment_status" text DEFAULT 'pending',
	"status" text DEFAULT 'pending',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"campaign_id" varchar,
	"investment_id" varchar,
	"amount" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'pending',
	"payment_gateway" text,
	"gateway_transaction_id" text,
	"gateway_response" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_ideas" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"full_description" text,
	"category" text NOT NULL,
	"subcategory" text,
	"difficulty" text,
	"investment" text,
	"timeframe" text,
	"market_size" text,
	"competitors" json DEFAULT '[]'::json,
	"target_audience" text,
	"revenue_model" text,
	"investment_required" text,
	"expected_roi" text,
	"market_trends" text,
	"risks" json DEFAULT '[]'::json,
	"opportunities" json DEFAULT '[]'::json,
	"key_features" json DEFAULT '[]'::json,
	"implementation_steps" json DEFAULT '[]'::json,
	"tags" json DEFAULT '[]'::json,
	"images" json DEFAULT '[]'::json,
	"is_visible" text DEFAULT 'true',
	"is_featured" text DEFAULT 'false',
	"views" text DEFAULT '0',
	"likes" text DEFAULT '0',
	"upload_batch_id" varchar,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submitted_ideas" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"idea_title" text NOT NULL,
	"category" text NOT NULL,
	"subcategory" text NOT NULL,
	"description" text NOT NULL,
	"knowledge" text NOT NULL,
	"experience" text NOT NULL,
	"tags" json DEFAULT '[]'::json,
	"operations" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upload_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" text NOT NULL,
	"ideas_count" text NOT NULL,
	"success_count" text DEFAULT '0',
	"error_count" text DEFAULT '0',
	"uploaded_by" varchar NOT NULL,
	"processing_status" text DEFAULT 'pending',
	"errors" json DEFAULT '[]'::json,
	"is_deleted" text DEFAULT 'false',
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admin_activity_logs" ADD CONSTRAINT "admin_activity_logs_admin_id_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_id_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_generated_ideas" ADD CONSTRAINT "ai_generated_ideas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_generation_sessions" ADD CONSTRAINT "ai_generation_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_updates" ADD CONSTRAINT "campaign_updates_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delete_history" ADD CONSTRAINT "delete_history_deleted_by_admin_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delete_history" ADD CONSTRAINT "delete_history_restored_by_admin_users_id_fk" FOREIGN KEY ("restored_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_investor_id_users_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_investment_id_investments_id_fk" FOREIGN KEY ("investment_id") REFERENCES "public"."investments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_ideas" ADD CONSTRAINT "platform_ideas_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_history" ADD CONSTRAINT "upload_history_uploaded_by_admin_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_history" ADD CONSTRAINT "upload_history_deleted_by_admin_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_logs_admin_id_idx" ON "admin_activity_logs" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "admin_logs_action_idx" ON "admin_activity_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "admin_logs_resource_type_idx" ON "admin_activity_logs" USING btree ("resource_type");--> statement-breakpoint
CREATE INDEX "admin_logs_created_at_idx" ON "admin_activity_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "admin_logs_success_idx" ON "admin_activity_logs" USING btree ("success");--> statement-breakpoint
CREATE INDEX "admin_sessions_admin_id_idx" ON "admin_sessions" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "admin_sessions_token_idx" ON "admin_sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "admin_sessions_expires_idx" ON "admin_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "admin_sessions_revoked_idx" ON "admin_sessions" USING btree ("is_revoked");--> statement-breakpoint
CREATE INDEX "admin_users_email_idx" ON "admin_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admin_users_active_idx" ON "admin_users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "ai_ideas_user_id_idx" ON "ai_generated_ideas" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_ideas_session_id_idx" ON "ai_generated_ideas" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "ai_ideas_favorited_idx" ON "ai_generated_ideas" USING btree ("is_favorited");--> statement-breakpoint
CREATE INDEX "ai_ideas_created_at_idx" ON "ai_generated_ideas" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "ai_sessions_user_id_idx" ON "ai_generation_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_sessions_status_idx" ON "ai_generation_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ai_sessions_created_at_idx" ON "ai_generation_sessions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "campaign_updates_campaign_id_idx" ON "campaign_updates" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "campaign_updates_created_at_idx" ON "campaign_updates" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "campaigns_user_id_idx" ON "campaigns" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "campaigns_status_idx" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "campaigns_category_idx" ON "campaigns" USING btree ("category");--> statement-breakpoint
CREATE INDEX "campaigns_stage_idx" ON "campaigns" USING btree ("stage");--> statement-breakpoint
CREATE INDEX "campaigns_created_at_idx" ON "campaigns" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "campaigns_end_date_idx" ON "campaigns" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "delete_history_item_type_idx" ON "delete_history" USING btree ("item_type");--> statement-breakpoint
CREATE INDEX "delete_history_item_id_idx" ON "delete_history" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "delete_history_can_restore_idx" ON "delete_history" USING btree ("can_restore");--> statement-breakpoint
CREATE INDEX "delete_history_permanent_delete_idx" ON "delete_history" USING btree ("permanent_delete_at");--> statement-breakpoint
CREATE INDEX "delete_history_deleted_at_idx" ON "delete_history" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "investments_campaign_id_idx" ON "investments" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "investments_investor_id_idx" ON "investments" USING btree ("investor_id");--> statement-breakpoint
CREATE INDEX "investments_status_idx" ON "investments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "investments_payment_status_idx" ON "investments" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "investments_created_at_idx" ON "investments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "payment_transactions_user_id_idx" ON "payment_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_transactions_campaign_id_idx" ON "payment_transactions" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_transactions_type_idx" ON "payment_transactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "payment_transactions_created_at_idx" ON "payment_transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "platform_ideas_category_idx" ON "platform_ideas" USING btree ("category");--> statement-breakpoint
CREATE INDEX "platform_ideas_visible_idx" ON "platform_ideas" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "platform_ideas_featured_idx" ON "platform_ideas" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "platform_ideas_created_at_idx" ON "platform_ideas" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "platform_ideas_upload_batch_idx" ON "platform_ideas" USING btree ("upload_batch_id");--> statement-breakpoint
CREATE INDEX "ideas_status_idx" ON "submitted_ideas" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ideas_category_idx" ON "submitted_ideas" USING btree ("category");--> statement-breakpoint
CREATE INDEX "ideas_created_at_idx" ON "submitted_ideas" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "ideas_email_idx" ON "submitted_ideas" USING btree ("email");--> statement-breakpoint
CREATE INDEX "ideas_status_created_idx" ON "submitted_ideas" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "upload_history_uploaded_by_idx" ON "upload_history" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "upload_history_status_idx" ON "upload_history" USING btree ("processing_status");--> statement-breakpoint
CREATE INDEX "upload_history_deleted_idx" ON "upload_history" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "upload_history_created_at_idx" ON "upload_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");