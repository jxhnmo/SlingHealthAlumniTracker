class CreateContactMethods < ActiveRecord::Migration[7.0]
  def change
    create_table :contact_methods do |t|
      t.string :contact_type, null: false
      t.string :info, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
