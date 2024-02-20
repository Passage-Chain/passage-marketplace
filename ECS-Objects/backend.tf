terraform {
  backend "s3" {
    bucket = "envadiv-tf-s3-backend"
    key    = "envadiv-pc-dev/pass002_frontend/terraform.tfstate"
    region = "us-east-2"
  }
}
