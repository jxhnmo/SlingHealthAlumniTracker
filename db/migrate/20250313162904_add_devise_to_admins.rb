class AddDeviseToAdmins < ActiveRecord::Migration[7.0]
  def change
    add_column :admins, :encrypted_password, :string
    add_column :admins, :reset_password_token, :string
    add_column :admins, :reset_password_sent_at, :datetime
    add_column :admins, :remember_created_at, :datetime
  end
end
