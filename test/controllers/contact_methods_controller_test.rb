require "test_helper"

class ContactMethodsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @contact_method = contact_methods(:one)
  end

  test "should get index" do
    get contact_methods_url, as: :json
    assert_response :success
  end

  test "should create contact_method" do
    assert_difference("ContactMethod.count") do
      post contact_methods_url, params: { contact_method: { contact_type: @contact_method.contact_type, info: @contact_method.info, user_id: @contact_method.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show contact_method" do
    get contact_method_url(@contact_method), as: :json
    assert_response :success
  end

  test "should update contact_method" do
    patch contact_method_url(@contact_method), params: { contact_method: { contact_type: @contact_method.contact_type, info: @contact_method.info, user_id: @contact_method.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy contact_method" do
    assert_difference("ContactMethod.count", -1) do
      delete contact_method_url(@contact_method), as: :json
    end

    assert_response :no_content
  end
end
