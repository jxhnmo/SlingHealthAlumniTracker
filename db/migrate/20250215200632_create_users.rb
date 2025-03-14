class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :major, 
      t.integer :graduation_year, 
      t.string :user_profile_url
      t.string :biography
      t.string :email, null: false, unique: true

      t.timestamps
    end
  end
end
