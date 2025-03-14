class AddUidToAdmins < ActiveRecord::Migration[7.0]
  def change
    add_column :admins, :uid, :string
  end
end
