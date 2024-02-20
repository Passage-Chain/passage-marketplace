#---- variables.tf----
variable "aws_region" {}
variable "ecs_service_name" {}
variable "app_image" {}
variable "fargate_cpu" {}
variable "fargate_memory" {}
variable "app_port" {}
variable "app_count" {}
variable "role_name" {}
variable "cluster_id" {}
variable "public_subnet" {}
variable "ecs_sg_id" {}
variable "frontend_tg_id" {}
variable "ecs_cluster_name" {}
variable "dns_ns_id" {}
variable "min_capacity" {}
variable "max_capacity" {}