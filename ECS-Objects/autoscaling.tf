resource "aws_appautoscaling_target" "target" {
  service_namespace  = "ecs"
  resource_id        = "service/${var.ecs_cluster_name}/${var.ecs_cluster_name}_${var.ecs_service_name}"
  scalable_dimension = "ecs:service:DesiredCount"
#   role_arn           = aws_iam_role.ecs_auto_scale_role.arn
  min_capacity       = var.min_capacity
  max_capacity       = var.max_capacity
}


resource "aws_appautoscaling_policy" "ecs_policy_memory" {
  name               = "${var.ecs_cluster_name}-${var.ecs_service_name}-memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.target.resource_id
  scalable_dimension = aws_appautoscaling_target.target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.target.service_namespace
 
  target_tracking_scaling_policy_configuration {
   predefined_metric_specification {
     predefined_metric_type = "ECSServiceAverageMemoryUtilization"
   }
 
   target_value       = 70
  }
}
 
resource "aws_appautoscaling_policy" "ecs_policy_cpu" {
  name               = "${var.ecs_cluster_name}-${var.ecs_service_name}-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.target.resource_id
  scalable_dimension = aws_appautoscaling_target.target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.target.service_namespace
 
  target_tracking_scaling_policy_configuration {
   predefined_metric_specification {
     predefined_metric_type = "ECSServiceAverageCPUUtilization"
   }
 
   target_value       = 60
  }
}

# # Automatically scale capacity up by one
# resource "aws_appautoscaling_policy" "up" {
#   name               = "${var.ecs_service_name}_scale_up"
#   service_namespace  = "ecs"
#   resource_id        = "service/${var.ecs_cluster_name}/ecs-${var.ecs_service_name}"
#   scalable_dimension = "ecs:service:DesiredCount"

#   step_scaling_policy_configuration {
#     adjustment_type         = "ChangeInCapacity"
#     cooldown                = 60
#     metric_aggregation_type = "Maximum"

#     step_adjustment {
#       metric_interval_lower_bound = 0
#       scaling_adjustment          = 1
#     }
#   }

#   depends_on = [aws_appautoscaling_target.target]
# }

# # Automatically scale capacity down by one
# resource "aws_appautoscaling_policy" "down" {
#   name               = "${var.ecs_service_name}_scale_down"
#   service_namespace  = "ecs"
#   resource_id        = "service/${var.ecs_cluster_name}/ecs-${var.ecs_service_name}"
#   scalable_dimension = "ecs:service:DesiredCount"

#   step_scaling_policy_configuration {
#     adjustment_type         = "ChangeInCapacity"
#     cooldown                = 60
#     metric_aggregation_type = "Maximum"

#     step_adjustment {
#       metric_interval_lower_bound = 0
#       scaling_adjustment          = -1
#     }
#   }

#   depends_on = [aws_appautoscaling_target.target]
# }

# # CloudWatch alarm that triggers the autoscaling up policy
# resource "aws_cloudwatch_metric_alarm" "service_cpu_high" {
#   alarm_name          = "${var.ecs_service_name}_cpu_utilization_high"
#   comparison_operator = "GreaterThanOrEqualToThreshold"
#   evaluation_periods  = "15"
#   metric_name         = "CPUUtilization"
#   namespace           = "AWS/ECS"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "70"

#   dimensions = {
#     ClusterName = "${var.ecs_cluster_name}"
#     ServiceName = "${var.ecs_service_name}"
#   }

#   alarm_actions = [aws_appautoscaling_policy.up.arn]
# }

# # CloudWatch alarm that triggers the autoscaling down policy
# resource "aws_cloudwatch_metric_alarm" "service_cpu_low" {
#   alarm_name          = "${var.ecs_service_name}_cpu_utilization_low"
#   comparison_operator = "LessThanOrEqualToThreshold"
#   evaluation_periods  = "15"
#   metric_name         = "CPUUtilization"
#   namespace           = "AWS/ECS"
#   period              = "60"
#   statistic           = "Average"
#   threshold           = "50"

#   dimensions = {
#     ClusterName = "${var.ecs_cluster_name}"
#     ServiceName = "${var.ecs_service_name}"
#   }

#   alarm_actions = [aws_appautoscaling_policy.down.arn]
# }