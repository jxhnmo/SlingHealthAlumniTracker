class AddAvatarUrlToAdmins < ActiveRecord::Migration[7.0]
  def change
    add_column :admins, :avatar_url, :string
  end
end
