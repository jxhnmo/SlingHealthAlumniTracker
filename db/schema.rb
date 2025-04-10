# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2025_03_13_170341) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_stat_statements"
  enable_extension "plpgsql"

  create_table "achievements", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "achievement_type", limit: 20, default: "Other Achievements", null: false
    t.index ["user_id"], name: "index_achievements_on_user_id"
  end

  create_table "admins", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "encrypted_password"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "email"
    t.string "uid"
    t.string "full_name"
    t.string "avatar_url"
  end

  create_table "contact_methods", force: :cascade do |t|
    t.string "contact_type", null: false
    t.string "info", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_link", default: false
    t.index ["user_id"], name: "index_contact_methods_on_user_id"
  end

  create_table "documents", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.string "link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "teams", id: :serial, force: :cascade do |t|
    t.string "team_name", limit: 255, null: false
    t.string "team_area", limit: 255, null: false
  end

  create_table "teams_users", primary_key: ["user_id", "team_id"], force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "team_id", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "major", null: false
    t.integer "graduation_year", null: false
    t.string "user_profile_url"
    t.string "biography"
    t.string "contact_info"
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "availability", default: true, null: false
    t.boolean "isfaculty", default: false, null: false
  end

  add_foreign_key "achievements", "users"
  add_foreign_key "contact_methods", "users"
  add_foreign_key "teams_users", "teams", name: "teams_users_team_id_fkey", on_delete: :cascade
  add_foreign_key "teams_users", "users", name: "teams_users_user_id_fkey", on_delete: :cascade
end
