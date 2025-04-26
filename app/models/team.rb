class Team < ApplicationRecord
    has_many :users, through: :teams_users
    has_many :teams_users, dependent: :destroy
end