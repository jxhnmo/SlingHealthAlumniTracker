# location: spec/feature/user_spec.rb
require 'rails_helper'

RSpec.describe 'Edit User', type: :feature do
    scenario 'valid inputs' do
        visit '/profile'
        click_button 'Edit'
        fill_in 'name', with: 'Test User'
        fill_in 'major', with: 'Computer Engineering'
        fill_in 'year', with: '20XX'
        fill_in 'bio', with: 'I am not a real person'
        fill_in 'achievements', with: 'I have no achievements'
        fill_in 'contact', with: 'realEmail@email.com'
        click_button 'Save'

        expect(page).to have_content('Test User')
        expect(page).to have_content('Computer Engineering Class of 20XX')
        expect(page).to have_content('I am not a real person')
        expect(page).to have_content('I have no achievements')
        expect(page).to have_content('realEmail@email.com')
    end
end
