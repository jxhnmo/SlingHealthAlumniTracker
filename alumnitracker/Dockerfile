# Dockerfile
FROM ruby:3.1.2
# Install essential Linux packages
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    nodejs \
    npm
# Install Yarn
RUN npm install -g yarn
# Install Rails
RUN gem install rails

# Set working directory
EXPOSE 4000

WORKDIR /app
# Keep container running for interactive use
CMD [“/bin/bash”]
