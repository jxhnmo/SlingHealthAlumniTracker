require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded any time
  # it changes. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable server timing
  config.server_timing = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join("tmp/caching-dev.txt").exist?
    config.cache_store = :memory_store
    config.public_file_server.headers = {
      "Cache-Control" => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true


  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Uncomment if you wish to allow Action Cable access from any origin.
  # config.action_cable.disable_request_forgery_protection = true
  ENV['GOOGLE_OAUTH_CLIENT_ID'] = '1070957917658-lprpbovp0pm4jofpvmhop93bb5649chs.apps.googleusercontent.com'
  ENV['GOOGLE_OAUTH_CLIENT_SECRET'] = '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'

  ENV['PINATA_API_KEY']='8cc97c6fcdfdc4cbf72f'
  ENV['PINATA_API_SECRET']='446e46832961913471b51671f418a45eabf03903dd0f781c9485bedc901b5d82'
  ENV['PINATA_SECRET_JWT']='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNjlmNTk1OC02OTgyLTQ1ZmMtOTAzYS03OWVmOWQzNTQyNWEiLCJlbWFpbCI6Imh6NzQxNDU2OTYzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4Y2M5N2M2ZmNkZmRjNGNiZjcyZiIsInNjb3BlZEtleVNlY3JldCI6IjQ0NmU0NjgzMjk2MTkxMzQ3MWI1MTY3MWY0MThhNDVlYWJmMDM5MDNkZDBmNzgxYzk0ODViZWRjOTAxYjVkODIiLCJleHAiOjE3NzQ5NDIzMTd9.K2G6uAqTBZZJlZcA2Lhz-QFLkPyB-ftjm2-RNE82tcY'
  ENV['PINATA_GATEWAY']='scarlet-impossible-orangutan-706.mypinata.cloud'
end
