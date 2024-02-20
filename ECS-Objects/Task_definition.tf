provider "aws" {
  region = var.aws_region
  version = "4.65.0"
}

data "aws_ecs_task_definition" "app" {
  task_definition = aws_ecs_task_definition.app.family
  depends_on      = [aws_ecs_task_definition.app]
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.ecs_cluster_name}_${var.ecs_service_name}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  execution_role_arn       = var.role_name

  container_definitions = <<DEFINITION
[
  {
    "cpu": ${var.fargate_cpu},
    "image": "${var.app_image}",
    "memoryReservation": ${var.fargate_memory},
    "name": "${var.ecs_cluster_name}_${var.ecs_service_name}",
    "networkMode": "awsvpc",
    "portMappings": [
      {
        "containerPort": ${var.app_port},
        "hostPort": ${var.app_port}
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${var.ecs_cluster_name}-logs",
        "awslogs-region": "${var.aws_region}",
        "awslogs-stream-prefix": "ecs"
        }
      }
  }
]
DEFINITION
}

resource "aws_service_discovery_service" "frontend" {
  name = "${var.ecs_cluster_name}_${var.ecs_service_name}"

  dns_config {
    namespace_id = var.dns_ns_id

    dns_records {
      ttl  = 30
      type = "A"
    }
    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 5
  }
}


resource "aws_ecs_service" "main" {
  name            = "${var.ecs_cluster_name}_${var.ecs_service_name}"
  cluster         = var.cluster_id
  task_definition = "${aws_ecs_task_definition.app.family}:${max(aws_ecs_task_definition.app.revision, data.aws_ecs_task_definition.app.revision)}"
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = ["${var.ecs_sg_id}"]
    subnets          = ["${var.public_subnet[0]}"]
    assign_public_ip = "true"
  }

  load_balancer {
    target_group_arn = var.frontend_tg_id
    container_name   = "${var.ecs_cluster_name}_${var.ecs_service_name}"
    container_port   = var.app_port
  }

  lifecycle {
    create_before_destroy = true
  }

  service_registries {
    registry_arn = aws_service_discovery_service.frontend.arn
  }
}
