class RemoveGoogleUidFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :google_uid, :string
  end
end
