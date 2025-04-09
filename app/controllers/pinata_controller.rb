class PinataController < ApplicationController
    before_action :set_pinata only: %i[ show update destroy ]
end
