class Team < ApplicationRecord
    has_many :users, through: :teams_users
    has_many :teams_user, dependent: :destroy
end