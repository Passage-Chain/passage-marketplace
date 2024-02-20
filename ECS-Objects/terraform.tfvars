aws_region = "us-east-2"
ecs_cluster_name = "pc-dev"
ecs_service_name  = "pass002_frontend"
app_image = "250664004806.dkr.ecr.us-east-2.amazonaws.com/pc-dev_pass002_frontend:latest"
fargate_cpu = "2048"
fargate_memory = "4096"
app_port = "80"
app_count = "1"
role_name = "arn:aws:iam::250664004806:role/pc-dev-ecs-role"
cluster_id = "arn:aws:ecs:us-east-2:250664004806:cluster/pc-dev"
public_subnet = [
  "subnet-094af89390ef235ad",
  "subnet-04b4cadef77f39f36"
]
ecs_sg_id = "sg-0463c39a05cf8394a"
frontend_tg_id = "arn:aws:elasticloadbalancing:us-east-2:250664004806:targetgroup/pc-dev-frontend-tg/81f652452370e417"
dns_ns_id = "ns-3hynblovskq2zwg7"
min_capacity = 1
max_capacity = 2
