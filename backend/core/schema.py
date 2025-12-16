import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q
from .models import Organization, Project, Task, TaskComment


# GraphQL Types
class OrganizationType(DjangoObjectType):
    """GraphQL type for Organization model."""
    project_count = graphene.Int()

    class Meta:
        model = Organization
        fields = ('id', 'name', 'slug', 'contact_email', 'created_at', 'updated_at', 'projects')

    def resolve_project_count(self, info):
        return self.projects.count()


class ProjectType(DjangoObjectType):
    """GraphQL type for Project model."""
    task_count = graphene.Int()
    completed_tasks = graphene.Int()
    completion_rate = graphene.Float()

    class Meta:
        model = Project
        fields = ('id', 'organization', 'name', 'description', 'status', 
                  'due_date', 'created_at', 'updated_at', 'tasks')

    def resolve_task_count(self, info):
        return self.task_count

    def resolve_completed_tasks(self, info):
        return self.completed_tasks

    def resolve_completion_rate(self, info):
        return self.completion_rate


class TaskType(DjangoObjectType):
    """GraphQL type for Task model."""
    comment_count = graphene.Int()

    class Meta:
        model = Task
        fields = ('id', 'project', 'title', 'description', 'status', 
                  'assignee_email', 'due_date', 'created_at', 'updated_at', 'comments')

    def resolve_comment_count(self, info):
        return self.comment_count


class TaskCommentType(DjangoObjectType):
    """GraphQL type for TaskComment model."""
    class Meta:
        model = TaskComment
        fields = ('id', 'task', 'content', 'author_email', 'created_at', 'updated_at')


class ProjectStatsType(graphene.ObjectType):
    """Statistics for a project."""
    total_tasks = graphene.Int()
    todo_tasks = graphene.Int()
    in_progress_tasks = graphene.Int()
    done_tasks = graphene.Int()
    completion_rate = graphene.Float()


# Queries
class Query(graphene.ObjectType):
    # Organization queries
    all_organizations = graphene.List(OrganizationType)
    organization = graphene.Field(OrganizationType, slug=graphene.String(required=True))

    # Project queries
    all_projects = graphene.List(
        ProjectType,
        organization_slug=graphene.String(),
        status=graphene.String()
    )
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))
    project_stats = graphene.Field(ProjectStatsType, project_id=graphene.ID(required=True))

    # Task queries
    all_tasks = graphene.List(
        TaskType,
        project_id=graphene.ID(),
        status=graphene.String(),
        assignee_email=graphene.String()
    )
    task = graphene.Field(TaskType, id=graphene.ID(required=True))

    # Comment queries
    task_comments = graphene.List(TaskCommentType, task_id=graphene.ID(required=True))

    # Organization resolvers
    def resolve_all_organizations(self, info):
        return Organization.objects.all()

    def resolve_organization(self, info, slug):
        try:
            return Organization.objects.get(slug=slug)
        except Organization.DoesNotExist:
            return None

    # Project resolvers
    def resolve_all_projects(self, info, organization_slug=None, status=None):
        queryset = Project.objects.select_related('organization').all()
        
        if organization_slug:
            queryset = queryset.filter(organization__slug=organization_slug)
        
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset

    def resolve_project(self, info, id):
        try:
            return Project.objects.select_related('organization').get(pk=id)
        except Project.DoesNotExist:
            return None

    def resolve_project_stats(self, info, project_id):
        try:
            project = Project.objects.get(pk=project_id)
            tasks = project.tasks.all()
            
            return ProjectStatsType(
                total_tasks=tasks.count(),
                todo_tasks=tasks.filter(status='TODO').count(),
                in_progress_tasks=tasks.filter(status='IN_PROGRESS').count(),
                done_tasks=tasks.filter(status='DONE').count(),
                completion_rate=project.completion_rate
            )
        except Project.DoesNotExist:
            return None

    # Task resolvers
    def resolve_all_tasks(self, info, project_id=None, status=None, assignee_email=None):
        queryset = Task.objects.select_related('project', 'project__organization').all()
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        if status:
            queryset = queryset.filter(status=status)
        
        if assignee_email:
            queryset = queryset.filter(assignee_email=assignee_email)
        
        return queryset

    def resolve_task(self, info, id):
        try:
            return Task.objects.select_related('project').get(pk=id)
        except Task.DoesNotExist:
            return None

    # Comment resolvers
    def resolve_task_comments(self, info, task_id):
        return TaskComment.objects.filter(task_id=task_id)


# Mutations
class CreateOrganization(graphene.Mutation):
    """Create a new organization."""
    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)
        slug = graphene.String()

    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, name, contact_email, slug=None):
        try:
            organization = Organization(
                name=name,
                contact_email=contact_email,
                slug=slug
            )
            organization.full_clean()
            organization.save()
            return CreateOrganization(organization=organization, success=True, errors=[])
        except Exception as e:
            return CreateOrganization(organization=None, success=False, errors=[str(e)])


class CreateProject(graphene.Mutation):
    """Create a new project."""
    class Arguments:
        organization_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, organization_slug, name, description='', status='ACTIVE', due_date=None):
        try:
            organization = Organization.objects.get(slug=organization_slug)
            project = Project(
                organization=organization,
                name=name,
                description=description,
                status=status,
                due_date=due_date
            )
            project.full_clean()
            project.save()
            return CreateProject(project=project, success=True, errors=[])
        except Organization.DoesNotExist:
            return CreateProject(project=None, success=False, errors=['Organization not found'])
        except Exception as e:
            return CreateProject(project=None, success=False, errors=[str(e)])


class UpdateProject(graphene.Mutation):
    """Update an existing project."""
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id, **kwargs):
        try:
            project = Project.objects.get(pk=id)
            
            for field, value in kwargs.items():
                if value is not None:
                    setattr(project, field, value)
            
            project.full_clean()
            project.save()
            return UpdateProject(project=project, success=True, errors=[])
        except Project.DoesNotExist:
            return UpdateProject(project=None, success=False, errors=['Project not found'])
        except Exception as e:
            return UpdateProject(project=None, success=False, errors=[str(e)])


class DeleteProject(graphene.Mutation):
    """Delete a project."""
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id):
        try:
            project = Project.objects.get(pk=id)
            project.delete()
            return DeleteProject(success=True, errors=[])
        except Project.DoesNotExist:
            return DeleteProject(success=False, errors=['Project not found'])
        except Exception as e:
            return DeleteProject(success=False, errors=[str(e)])


class CreateTask(graphene.Mutation):
    """Create a new task."""
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, project_id, title, description='', status='TODO', 
               assignee_email='', due_date=None):
        try:
            project = Project.objects.get(pk=project_id)
            task = Task(
                project=project,
                title=title,
                description=description,
                status=status,
                assignee_email=assignee_email,
                due_date=due_date
            )
            task.full_clean()
            task.save()
            return CreateTask(task=task, success=True, errors=[])
        except Project.DoesNotExist:
            return CreateTask(task=None, success=False, errors=['Project not found'])
        except Exception as e:
            return CreateTask(task=None, success=False, errors=[str(e)])


class UpdateTask(graphene.Mutation):
    """Update an existing task."""
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id, **kwargs):
        try:
            task = Task.objects.get(pk=id)
            
            for field, value in kwargs.items():
                if value is not None:
                    setattr(task, field, value)
            
            task.full_clean()
            task.save()
            return UpdateTask(task=task, success=True, errors=[])
        except Task.DoesNotExist:
            return UpdateTask(task=None, success=False, errors=['Task not found'])
        except Exception as e:
            return UpdateTask(task=None, success=False, errors=[str(e)])


class DeleteTask(graphene.Mutation):
    """Delete a task."""
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id):
        try:
            task = Task.objects.get(pk=id)
            task.delete()
            return DeleteTask(success=True, errors=[])
        except Task.DoesNotExist:
            return DeleteTask(success=False, errors=['Task not found'])
        except Exception as e:
            return DeleteTask(success=False, errors=[str(e)])


class AddComment(graphene.Mutation):
    """Add a comment to a task."""
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, task_id, content, author_email):
        try:
            task = Task.objects.get(pk=task_id)
            comment = TaskComment(
                task=task,
                content=content,
                author_email=author_email
            )
            comment.full_clean()
            comment.save()
            return AddComment(comment=comment, success=True, errors=[])
        except Task.DoesNotExist:
            return AddComment(comment=None, success=False, errors=['Task not found'])
        except Exception as e:
            return AddComment(comment=None, success=False, errors=[str(e)])


class Mutation(graphene.ObjectType):
    # Organization mutations
    create_organization = CreateOrganization.Field()

    # Project mutations
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()

    # Task mutations
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()

    # Comment mutations
    add_comment = AddComment.Field()


# Schema
schema = graphene.Schema(query=Query, mutation=Mutation)
